package com.custombluetooth;

import android.Manifest;
import android.content.Context;
import android.util.Log;
import android.bluetooth.BluetoothAdapter;
import android.bluetooth.BluetoothDevice;
import android.bluetooth.BluetoothGattCharacteristic;
import android.bluetooth.BluetoothGattDescriptor;
import android.bluetooth.BluetoothGattService;
import android.bluetooth.BluetoothGattServer;
import android.bluetooth.BluetoothGattServerCallback;
import android.bluetooth.BluetoothManager;
import android.bluetooth.le.AdvertiseCallback;
import android.bluetooth.le.AdvertiseData;
import android.bluetooth.le.AdvertiseSettings;
import android.bluetooth.le.BluetoothLeAdvertiser;
import android.os.ParcelUuid;
import java.util.Arrays;

import androidx.annotation.NonNull;
import androidx.core.app.ActivityCompat;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.bridge.Callback;
import com.facebook.react.modules.core.DeviceEventManagerModule;

/**
 * Minimal native module scaffold for CustomBluetooth.
 * Fill in Android BLE APIs where marked.
 */
public class CustomBluetoothModule extends ReactContextBaseJavaModule {
    private static final String TAG = "CustomBluetooth";
    private final ReactApplicationContext reactContext;
    private BluetoothManager mBluetoothManager;
    private BluetoothAdapter mBluetoothAdapter;
    private BluetoothLeAdvertiser mBluetoothLeAdvertiser;
    private AdvertiseCallback mAdvertiseCallback;
    private BluetoothGattServer mGattServer;
    private java.util.HashMap<String, BluetoothGattService> servicesMap = new java.util.HashMap<>();
    // stored characteristic values keyed by serviceUuid|charUuid
    private java.util.HashMap<String, byte[]> characteristicValues = new java.util.HashMap<>();
    private java.util.HashSet<BluetoothDevice> mBluetoothDevices = new java.util.HashSet<>();
    // JS write callbacks keyed by serviceUuid|charUuid
    private final java.util.HashMap<String, Callback> writeCallbacks = new java.util.HashMap<>();
    private final Object lock = new Object();
    // accumulate partial / offset writes (simple approach, not distinguishing executeWrite transactions)
    private final java.util.HashMap<String, byte[]> partialWriteBuffers = new java.util.HashMap<>();
    private int writeSequence = 0;

    public CustomBluetoothModule(ReactApplicationContext reactContext) {
        super(reactContext);
        this.reactContext = reactContext;
    }

    private void safeReject(Promise promise, String code, Throwable t) {
        if (promise == null) return;
        final String safeCode = (code == null || code.length() == 0) ? "native_error" : code;
        final String safeMsg = (t == null || t.getMessage() == null) ? "Unknown native error" : t.getMessage();
        try {
            // prefer reject(code, throwable) when available to preserve stack, but always supply non-null code
            promise.reject(safeCode, safeMsg, t);
        } catch (Exception ex) {
            // last-resort: reject with code + message strings
            try { promise.reject(safeCode, safeMsg); } catch (Exception ex2) { Log.e("CustomBluetooth", "promise.reject failed", ex2); }
        }
    }

    @NonNull
    @Override
    public String getName() {
        return "CustomBluetooth"; // JS expects NativeModules.CustomBluetooth
    }

    // Example stub methods. Implement Android BLE logic inside these.

    @ReactMethod
    public void addService(String uuid, boolean primary, Promise promise) {
        try {
            java.util.UUID SERVICE_UUID = java.util.UUID.fromString(uuid);
            int type = primary ? BluetoothGattService.SERVICE_TYPE_PRIMARY : BluetoothGattService.SERVICE_TYPE_SECONDARY;
            BluetoothGattService service = new BluetoothGattService(SERVICE_UUID, type);
            synchronized (lock) {
                servicesMap.put(uuid, service);
            }
            Log.d(TAG, "service added: " + uuid);
            promise.resolve(null);
        } catch (IllegalArgumentException e) {
            safeReject(promise, "add_service_invalid_argument", e);
        } catch (Exception e) {
            safeReject(promise, "add_service_failed", e);
        }
    }

    @ReactMethod
    public void addCharacteristicToService(String serviceUuid, String charUuid, int permissions, int properties, Promise promise) {
        try {
            BluetoothGattService service;
            synchronized (lock) { service = servicesMap.get(serviceUuid); }
            if (service == null) {
                promise.reject("no_service", "service not found: " + serviceUuid);
                return;
            }
            java.util.UUID CHAR_UUID = java.util.UUID.fromString(charUuid);
            BluetoothGattCharacteristic characteristic = new BluetoothGattCharacteristic(CHAR_UUID, properties, permissions);
            if ((properties & BluetoothGattCharacteristic.PROPERTY_NOTIFY) != 0) {
                try {
                    BluetoothGattDescriptor cccd = new BluetoothGattDescriptor(
                        java.util.UUID.fromString("00002902-0000-1000-8000-00805f9b34fb"),
                        BluetoothGattDescriptor.PERMISSION_READ | BluetoothGattDescriptor.PERMISSION_WRITE
                    );
                    characteristic.addDescriptor(cccd);
                } catch (Exception dEx) {
                    Log.w(TAG, "Failed to add CCCD descriptor: " + dEx);
                }
            }
            service.addCharacteristic(characteristic);
            Log.d(TAG, "characteristic added: " + charUuid + " to " + serviceUuid);
            promise.resolve(null);
        } catch (IllegalArgumentException e) {
            safeReject(promise, "add_characteristic_invalid_argument", e);
        } catch (Exception e) {
            safeReject(promise, "add_characteristic_failed", e);
        }
    }

    @ReactMethod
    public void startAdvertising(int timeoutMs, ReadableMap options, Promise promise) {
        Log.d(TAG, "startAdvertising timeoutMs=" + timeoutMs + " options=" + options);
        try {
            mBluetoothManager = (BluetoothManager) reactContext.getSystemService(Context.BLUETOOTH_SERVICE);
                if (mBluetoothManager == null) {
                promise.reject("no_manager", "BluetoothManager not available");
                return;
            }
            mBluetoothAdapter = mBluetoothManager.getAdapter();
            if (mBluetoothAdapter == null) {
                promise.reject("no_adapter", "BluetoothAdapter not available");
                return;
            }

            // Permissions check (BLUETOOTH_CONNECT) for Android S+
            if (android.os.Build.VERSION.SDK_INT >= android.os.Build.VERSION_CODES.S) {
                if (ActivityCompat.checkSelfPermission(reactContext, Manifest.permission.BLUETOOTH_CONNECT) != android.content.pm.PackageManager.PERMISSION_GRANTED) {
                    promise.reject("permission", "Missing BLUETOOTH_CONNECT permission");
                    return;
                }
            }

            // Open GATT server and add services
            mGattServer = mBluetoothManager.openGattServer(reactContext, new BluetoothGattServerCallback() {
                @Override
                public void onConnectionStateChange(BluetoothDevice device, int status, int newState) {
                    super.onConnectionStateChange(device, status, newState);
                    if (status == android.bluetooth.BluetoothGatt.GATT_SUCCESS) {
                        if (newState == android.bluetooth.BluetoothGatt.STATE_CONNECTED) {
                            synchronized (lock) { mBluetoothDevices.add(device); }
                        } else if (newState == android.bluetooth.BluetoothGatt.STATE_DISCONNECTED) {
                            synchronized (lock) { mBluetoothDevices.remove(device); }
                        }
                    } else {
                        synchronized (lock) { mBluetoothDevices.remove(device); }
                    }
                    try {
                        WritableMap evt = Arguments.createMap();
                        evt.putString("device", device != null ? device.getAddress() : "");
                        evt.putInt("status", status);
                        evt.putInt("state", newState);
                        sendEvent("onConnectionStateChange", evt);
                    } catch (Exception e) {
                        Log.w(TAG, "emit connection change failed: " + e);
                    }
                }

                // Maintain descriptor values (e.g. CCCD) so we can answer reads and track notification state
                private final java.util.HashMap<String, byte[]> descriptorValues = new java.util.HashMap<>();

                @Override
                public void onDescriptorReadRequest(BluetoothDevice device, int requestId, int offset, BluetoothGattDescriptor descriptor) {
                    super.onDescriptorReadRequest(device, requestId, offset, descriptor);
                    try {
                        byte[] value;
                        String key = descriptor.getCharacteristic().getService().getUuid() + "|" + descriptor.getCharacteristic().getUuid() + "|" + descriptor.getUuid();
                        synchronized (lock) { value = descriptorValues.get(key); }
                        if (value == null) {
                            value = descriptor.getValue();
                        }
                        if (value == null) value = new byte[0];
                        byte[] resp;
                        if (offset > 0) {
                            if (offset >= value.length) resp = new byte[0]; else resp = java.util.Arrays.copyOfRange(value, offset, value.length);
                        } else {
                            resp = value;
                        }
                        if (mGattServer != null) {
                            mGattServer.sendResponse(device, requestId, android.bluetooth.BluetoothGatt.GATT_SUCCESS, offset, resp);
                        }
                    } catch (Exception ex) {
                        Log.w(TAG, "descriptorRead error: " + ex);
                        if (mGattServer != null) {
                            mGattServer.sendResponse(device, requestId, android.bluetooth.BluetoothGatt.GATT_FAILURE, offset, null);
                        }
                    }
                }

                @Override
                public void onDescriptorWriteRequest(BluetoothDevice device, int requestId, BluetoothGattDescriptor descriptor, boolean preparedWrite, boolean responseNeeded, int offset, byte[] value) {
                    super.onDescriptorWriteRequest(device, requestId, descriptor, preparedWrite, responseNeeded, offset, value);
                    try {
                        if (value == null) value = new byte[0];
                        String key = descriptor.getCharacteristic().getService().getUuid() + "|" + descriptor.getCharacteristic().getUuid() + "|" + descriptor.getUuid();
                        // For CCCD writes (enable/disable notifications) we just persist the value provided
                        synchronized (lock) { descriptorValues.put(key, java.util.Arrays.copyOf(value, value.length)); }
                        if (descriptor.getUuid().toString().equalsIgnoreCase("00002902-0000-1000-8000-00805f9b34fb")) {
                            // Optionally emit JS event for subscription changes
                            final boolean notifyEnabled = value.length >= 2 && (value[0] & 0x01) == 0x01;
                            reactContext.runOnUiQueueThread(() -> {
                                try {
                                    WritableMap params = Arguments.createMap();
                                    params.putString("device", device != null ? device.getAddress() : "");
                                    params.putString("serviceUuid", descriptor.getCharacteristic().getService().getUuid().toString());
                                    params.putString("charUuid", descriptor.getCharacteristic().getUuid().toString());
                                    params.putBoolean("notificationsEnabled", notifyEnabled);
                                    sendEvent("onNotificationSubscriptionChanged", params);
                                } catch (Exception e) { Log.w(TAG, "emit subscription change failed: " + e); }
                            });
                        }
                        if (mGattServer != null && responseNeeded) {
                            mGattServer.sendResponse(device, requestId, android.bluetooth.BluetoothGatt.GATT_SUCCESS, offset, value);
                        }
                    } catch (Exception ex) {
                        Log.w(TAG, "descriptorWrite error: " + ex);
                        if (mGattServer != null && responseNeeded) {
                            mGattServer.sendResponse(device, requestId, android.bluetooth.BluetoothGatt.GATT_FAILURE, offset, null);
                        }
                    }
                }

                @Override
                public void onExecuteWrite(BluetoothDevice device, int requestId, boolean execute) {
                    super.onExecuteWrite(device, requestId, execute);
                    // We treat each write independently, so just acknowledge.
                    if (mGattServer != null) {
                        try { mGattServer.sendResponse(device, requestId, android.bluetooth.BluetoothGatt.GATT_SUCCESS, 0, null); } catch (Exception ignore) {}
                    }
                }

                @Override
                public void onCharacteristicReadRequest(BluetoothDevice device, int requestId, int offset, BluetoothGattCharacteristic characteristic) {
                    super.onCharacteristicReadRequest(device, requestId, offset, characteristic);
                    try {
                        byte[] value = characteristic.getValue();
                        if (value == null) {
                            String key = characteristic.getService().getUuid().toString() + "|" + characteristic.getUuid().toString();
                            byte[] stored;
                            synchronized (lock) { stored = characteristicValues.get(key); }
                            if (stored != null) value = stored;
                            else value = new byte[0];
                        }

                        byte[] response;
                        if (offset > 0) {
                            if (offset >= value.length) response = new byte[0];
                            else response = java.util.Arrays.copyOfRange(value, offset, value.length);
                        } else {
                            response = value;
                        }

                        if (mGattServer != null) {
                            mGattServer.sendResponse(device, requestId, android.bluetooth.BluetoothGatt.GATT_SUCCESS, offset, response);
                        }

                        final byte[] finalResp = response;
                        final String svc = characteristic.getService().getUuid().toString();
                        final String chr = characteristic.getUuid().toString();
                        reactContext.runOnUiQueueThread(() -> {
                            WritableMap params = Arguments.createMap();
                            params.putString("device", device != null ? device.getAddress() : "");
                            params.putString("serviceUuid", svc);
                            params.putString("charUuid", chr);
                            params.putString("data", android.util.Base64.encodeToString(finalResp, android.util.Base64.NO_WRAP));
                            sendEvent("onCharacteristicRead", params);
                        });
                    } catch (Exception e) {
                        Log.w(TAG, "readRequest error " + e);
                        if (mGattServer != null) {
                            mGattServer.sendResponse(device, requestId, android.bluetooth.BluetoothGatt.GATT_FAILURE, offset, null);
                        }
                    }
                }

                @Override
                public void onCharacteristicWriteRequest(BluetoothDevice device, int requestId, BluetoothGattCharacteristic characteristic, boolean preparedWrite, boolean responseNeeded, int offset, byte[] value) {
                    try {
                        super.onCharacteristicWriteRequest(device, requestId, characteristic, preparedWrite, responseNeeded, offset, value);
                        final int seq;
                        synchronized (lock) { seq = ++writeSequence; }
                        if (characteristic == null) {
                            Log.w(TAG, "[seq=" + seq + "] write req with null characteristic");
                            if (mGattServer != null && responseNeeded) {
                                mGattServer.sendResponse(device, requestId, android.bluetooth.BluetoothGatt.GATT_FAILURE, offset, null);
                            }
                            return;
                        }
                        BluetoothGattService svcObj = characteristic.getService();
                        if (svcObj == null) {
                            Log.w(TAG, "[seq=" + seq + "] write req characteristic has null service" );
                            if (mGattServer != null && responseNeeded) {
                                mGattServer.sendResponse(device, requestId, android.bluetooth.BluetoothGatt.GATT_FAILURE, offset, null);
                            }
                            return;
                        }
                        int inLen = value != null ? value.length : 0;
                        Log.d(TAG, "[seq=" + seq + "] onCharacteristicWriteRequest dev=" + (device!=null?device.getAddress():"null") +
                                " char=" + characteristic.getUuid() +
                                " inLen=" + inLen +
                                " offset=" + offset +
                                " prepared=" + preparedWrite +
                                " respNeeded=" + responseNeeded);

                        // Defensive: ensure non-null value
                        if (value == null) value = new byte[0];
                        if (offset < 0) {
                            Log.w(TAG, "[seq=" + seq + "] negative offset");
                            if (mGattServer != null && responseNeeded) {
                                mGattServer.sendResponse(device, requestId, android.bluetooth.BluetoothGatt.GATT_FAILURE, offset, null);
                            }
                            return;
                        }
                        if (offset > 1024 * 64) { // arbitrary sanity cap
                            Log.w(TAG, "[seq=" + seq + "] offset too large, rejecting");
                            if (mGattServer != null && responseNeeded) {
                                mGattServer.sendResponse(device, requestId, android.bluetooth.BluetoothGatt.GATT_FAILURE, offset, null);
                            }
                            return;
                        }

                        String key = svcObj.getUuid().toString() + "|" + characteristic.getUuid().toString();

                        byte[] finalValue;
                        if (offset > 0) {
                            // accumulate into buffer (basic support for long writes)
                            byte[] existing;
                            synchronized (lock) { existing = partialWriteBuffers.get(key); }
                            if (existing == null) {
                                existing = new byte[offset + value.length];
                            } else if (existing.length < offset + value.length) {
                                // grow buffer
                                byte[] grown = new byte[offset + value.length];
                                System.arraycopy(existing, 0, grown, 0, existing.length);
                                existing = grown;
                            }
                            System.arraycopy(value, 0, existing, offset, value.length);
                            finalValue = existing;
                            synchronized (lock) { partialWriteBuffers.put(key, existing); }
                        } else {
                            // new write starts a fresh buffer
                            finalValue = java.util.Arrays.copyOf(value, value.length);
                            synchronized (lock) { partialWriteBuffers.put(key, finalValue); }
                        }

                        // For simplicity (no explicit executeWrite), treat each request where preparedWrite==false OR responseNeeded && offset==0 as completion
                        boolean complete = !preparedWrite; // treat each non-prepared write as standalone message
                        if (complete) {
                            characteristic.setValue(finalValue);
                            synchronized (lock) { characteristicValues.put(key, finalValue); }
                            // Clear partial buffer since this "message" is done
                            synchronized (lock) { partialWriteBuffers.remove(key); }
                        }

                        // invoke JS callback if registered for this characteristic
                        Callback cb;
                        synchronized (lock) { cb = writeCallbacks.get(key); }
                        if (cb != null) {
                            final String devAddr = device != null ? device.getAddress() : "";
                            final String b64 = android.util.Base64.encodeToString(finalValue, android.util.Base64.NO_WRAP);
                            reactContext.runOnUiQueueThread(() -> {
                                try { cb.invoke(devAddr, b64); } catch (Exception invokeEx) { Log.w(TAG, "write callback invoke failed: " + invokeEx); }
                            });
                        }

                        if (mGattServer != null && responseNeeded) {
                            try {
                                // Echo back value slice starting at offset (spec allows any value; echoing full finalValue helps some stacks)
                                byte[] respVal = finalValue;
                                if (offset > 0 && offset < finalValue.length) {
                                    respVal = java.util.Arrays.copyOfRange(finalValue, offset, finalValue.length);
                                }
                                mGattServer.sendResponse(device, requestId, android.bluetooth.BluetoothGatt.GATT_SUCCESS, offset, respVal);
                            } catch (Exception respEx) {
                                Log.w(TAG, "[seq=" + seq + "] sendResponse error " + respEx);
                            }
                        }

                        final byte[] vFinal = finalValue;
                        final String svc = svcObj.getUuid().toString();
                        final String chr = characteristic.getUuid().toString();
                        reactContext.runOnUiQueueThread(() -> {
                            try {
                                WritableMap params = Arguments.createMap();
                                params.putString("device", device != null ? device.getAddress() : "");
                                params.putString("serviceUuid", svc);
                                params.putString("charUuid", chr);
                                params.putString("data", android.util.Base64.encodeToString(vFinal, android.util.Base64.NO_WRAP));
                                params.putInt("seq", seq);
                                sendEvent("onReceiveData", params);
                            } catch (Exception evEx) {
                                Log.w(TAG, "[seq=" + seq + "] emit onReceiveData fail " + evEx);
                            }
                        });
                    } catch (Exception e) {
                        Log.w(TAG, "writeRequest error " + e);
                        if (mGattServer != null && responseNeeded) {
                            mGattServer.sendResponse(device, requestId, android.bluetooth.BluetoothGatt.GATT_FAILURE, offset, null);
                        }
                        try {
                            WritableMap errEvt = Arguments.createMap();
                            errEvt.putString("error", e.getMessage());
                            sendEvent("onCharacteristicWriteError", errEvt);
                        } catch(Exception ignore) {
                            // ignore
                        }
                    }
                }
            });

            synchronized (lock) {
                for (BluetoothGattService s : servicesMap.values()) {
                    try { mGattServer.addService(s); } catch (Exception addEx) { Log.w(TAG, "addService failure: " + addEx); }
                }
            }

            if (!mBluetoothAdapter.isMultipleAdvertisementSupported()) {
                promise.reject("unsupported", "Device does not support BLE advertising");
                return;
            }

            mBluetoothLeAdvertiser = mBluetoothAdapter.getBluetoothLeAdvertiser();
            if (mBluetoothLeAdvertiser == null) {
                promise.reject("no_advertiser", "BluetoothLeAdvertiser not available");
                return;
            }

            AdvertiseSettings.Builder settingsBuilder = new AdvertiseSettings.Builder()
                    .setAdvertiseMode(AdvertiseSettings.ADVERTISE_MODE_LOW_LATENCY)
                    .setTxPowerLevel(AdvertiseSettings.ADVERTISE_TX_POWER_HIGH)
                    .setConnectable(true);
            if (timeoutMs > 0) settingsBuilder.setTimeout(timeoutMs);
            AdvertiseSettings settings = settingsBuilder.build();

            AdvertiseData.Builder dataBuilder = new AdvertiseData.Builder();
            boolean includeName = true;
            if (options != null && options.hasKey("includeDeviceName")) {
                includeName = options.getBoolean("includeDeviceName");
            }
            dataBuilder.setIncludeDeviceName(includeName);

            // Add all registered service UUIDs to the advertise packet
            for (BluetoothGattService s : servicesMap.values()) {
                try {
                    dataBuilder.addServiceUuid(new ParcelUuid(s.getUuid()));
                } catch (Exception e) {
                    Log.w(TAG, "failed addServiceUuid: " + e);
                }
            }

            AdvertiseData data = dataBuilder.build();
            AdvertiseData scanRes = new AdvertiseData.Builder().setIncludeDeviceName(includeName).build();

            mAdvertiseCallback = new AdvertiseCallback() {
                @Override
                public void onStartSuccess(AdvertiseSettings settingsInEffect) {
                    super.onStartSuccess(settingsInEffect);
                    Log.d(TAG, "Advertising started");
                    promise.resolve("started");
                }

                @Override
                public void onStartFailure(int errorCode) {
                    super.onStartFailure(errorCode);
                    Log.e(TAG, "Advertising failed: " + errorCode);
                    promise.reject("advertise_failed", "code:" + errorCode);
                }
            };

            mBluetoothLeAdvertiser.startAdvertising(settings, data, scanRes, mAdvertiseCallback);

        } catch (Exception e) {
            promise.reject("error", e == null ? "unknown error" : e.getMessage());
        }
    }

    /**
     * Register a JS callback that will be invoked when a write request is received
     * for the specified service + characteristic. The callback signature in JS:
     * (deviceAddress, base64Value) => {}
     */
    @ReactMethod
    public void onCharacteristicWriteRequest(String serviceUUID, String charUUID, Callback callback) {
        try {
            if (serviceUUID == null || charUUID == null || callback == null) return;
            String key = serviceUUID + "|" + charUUID;
            synchronized (lock) { writeCallbacks.put(key, callback); }
            Log.d(TAG, "Registered write callback for " + key);
        } catch (Exception e) {
            Log.w(TAG, "onCharacteristicWriteRequest registration failed: " + e);
        }
    }

    @ReactMethod
    public void stopAdvertising(Promise promise) {
        Log.d(TAG, "stopAdvertising");
        try {
            if (mBluetoothLeAdvertiser != null && mAdvertiseCallback != null) {
                mBluetoothLeAdvertiser.stopAdvertising(mAdvertiseCallback);
                mAdvertiseCallback = null;
            }
            if (mGattServer != null) {
                mGattServer.close();
                mGattServer = null;
            }
            synchronized (lock) {
                mBluetoothDevices.clear();
                writeCallbacks.clear();
            }
            promise.resolve("stopped");
        } catch (Exception e) {
            promise.reject("error", e == null ? "unknown error" : e.getMessage());
        }
    }

    @ReactMethod
    public void startScan(Promise promise) {
        Log.d(TAG, "startScan");
        // TODO: start scanning and emit events via sendEvent
        promise.resolve("scanning");
    }

    @ReactMethod
    public void stopScan(Promise promise) {
        Log.d(TAG, "stopScan");
        // TODO: stop scanning
        promise.resolve("stopped");
    }

    @ReactMethod
    public void sendNotificationToDevice(String serviceUUID, String charUUID, String base64Message, Promise promise) {
        Log.d(TAG, "sendNotificationToDevice: " + serviceUUID + " / " + charUUID);
        try {
            BluetoothGattService service; synchronized (lock) { service = servicesMap.get(serviceUUID); }
            if (service == null) {
                promise.reject("no_service", "service not found");
                return;
            }
            BluetoothGattCharacteristic characteristic = service.getCharacteristic(java.util.UUID.fromString(charUUID));
            if (characteristic == null) {
                promise.reject("no_char", "characteristic not found");
                return;
            }
            byte[] value = android.util.Base64.decode(base64Message, android.util.Base64.DEFAULT);
            characteristic.setValue(value);
            if (mGattServer != null) {
                for (BluetoothDevice device : mBluetoothDevices) {
                    mGattServer.notifyCharacteristicChanged(device, characteristic, false);
                }
            }
            promise.resolve("notified");
        } catch (Exception e) {
            promise.reject("error", e == null ? "unknown error" : e.getMessage());
        }
    }

    @ReactMethod
    public void setCharacteristicValue(String serviceUUID, String charUUID, String base64Value, Promise promise) {
        try {
            BluetoothGattService service; synchronized (lock) { service = servicesMap.get(serviceUUID); }
            if (service == null) {
                promise.reject("no_service", "service not found");
                return;
            }
            BluetoothGattCharacteristic characteristic = service.getCharacteristic(java.util.UUID.fromString(charUUID));
            if (characteristic == null) {
                promise.reject("no_char", "characteristic not found");
                return;
            }
            byte[] value = base64Value != null ? android.util.Base64.decode(base64Value, android.util.Base64.NO_WRAP) : new byte[0];
            characteristic.setValue(value);
            String key = serviceUUID + "|" + charUUID;
            characteristicValues.put(key, value);
            promise.resolve("ok");
        } catch (Exception e) {
            promise.reject("error", e == null ? "unknown error" : e.getMessage());
        }
    }

    @ReactMethod
    public void readCharacteristicValue(String serviceUUID, String charUUID, Promise promise) {
        try {
            BluetoothGattService service; synchronized (lock) { service = servicesMap.get(serviceUUID); }
            if (service == null) {
                promise.reject("no_service", "service not found");
                return;
            }
            BluetoothGattCharacteristic characteristic = service.getCharacteristic(java.util.UUID.fromString(charUUID));
            if (characteristic == null) {
                promise.reject("no_char", "characteristic not found");
                return;
            }
            String key = serviceUUID + "|" + charUUID;
            byte[] stored; synchronized (lock) { stored = characteristicValues.get(key); }
            if (stored == null) stored = characteristic.getValue();
            String base64 = android.util.Base64.encodeToString(stored != null ? stored : new byte[0], android.util.Base64.NO_WRAP);
            promise.resolve(base64);
        } catch (Exception e) {
            promise.reject("error", e == null ? "unknown error" : e.getMessage());
        }
    }

    // Helper to emit events to JS
    private void sendEvent(String eventName, WritableMap params) {
        try {
            reactContext.runOnUiQueueThread(() -> {
                try {
                    reactContext.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                        .emit(eventName, params);
                } catch (Exception inner) {
                    Log.w(TAG, "emit(inner) failed: " + inner);
                }
            });
        } catch (Exception e) {
            Log.w(TAG, "sendEvent failed: " + e.toString());
        }
    }

    // Debug helper to dump internal state (can be invoked via reflection or adding a JS method later)
    private void dumpState() {
        synchronized (lock) {
            Log.d(TAG, "STATE services=" + servicesMap.size() + " devices=" + mBluetoothDevices.size() + " charsValues=" + characteristicValues.size() + " callbacks=" + writeCallbacks.size());
        }
    }

}
