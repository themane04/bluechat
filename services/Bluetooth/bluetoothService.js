import { PermissionsAndroid, Platform, NativeModules, NativeEventEmitter, DeviceEventEmitter } from 'react-native';
import { BleManager } from 'react-native-ble-plx';

const perms = [
    PermissionsAndroid.PERMISSIONS.BLUETOOTH_ADVERTISE,
    PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
    PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
].filter(Boolean);


class BluetoothService {
    constructor() {
        this.serviceUuid = 'cb16b8ba-3e58-414a-a74e-5de844436ef0';
        this.usernameCharacteristicUuid = 'cb16b8ba-3e58-414a-a74e-5de844436ef1';
        this.receiveMessageCharacteristicUuid = 'cb16b8ba-3e58-414a-a74e-5de844436ef2';

        this.username = 'Unknown';

        this.connectedDevices = [];

        // map for custom read responses: key = serviceUUID|charUUID -> string
        this.readResponses = {};

        // Ble bluetooth client (server) event bridge
        // Wrap addListener to avoid unhandled exceptions bringing down the JS VM
        const nativeModule = NativeModules.CustomBluetooth || NativeModules.BluetoothClient;
        this.eventEmitter = new NativeEventEmitter(nativeModule);

        // Simple serialized read queue to prevent overlapping read requests (which can crash some stacks)
        this._readQueue = Promise.resolve();

        // Ble Plx (client)
        this.manager = null;
    }

    // simple UTF-8 -> base64 helper (works in React Native without Node Buffer)
    utf8ToBase64(str) {
        if (!str) return '';
        // convert to UTF-8 binary string
        const utf8binary = unescape(encodeURIComponent(str));
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
        let output = '';
        let i = 0;
        while (i < utf8binary.length) {
            const chr1 = utf8binary.charCodeAt(i++) & 0xff;
            const chr2 = utf8binary.charCodeAt(i++);
            const chr3 = utf8binary.charCodeAt(i++);
            const enc1 = chr1 >> 2;
            const enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
            let enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
            let enc4 = chr3 & 63;
            if (isNaN(chr2)) {
                enc3 = enc4 = 64;
            } else if (isNaN(chr3)) {
                enc4 = 64;
            }
            output += chars.charAt(enc1) + chars.charAt(enc2) + chars.charAt(enc3) + chars.charAt(enc4);
        }
        return output;
    }

    // base64 -> UTF-8 helper (includes a small atob polyfill)
    base64ToUtf8(b64) {
        if (!b64) return '';
        const atobPolyfill = (input) => {
            const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
            input = String(input).replace(/=+$/, '');
            if (input.length % 4 === 1) {
                throw new Error("'atob' failed: The string to be decoded is not correctly encoded.");
            }
            let output = '';
            let bc = 0, bs, buffer, idx = 0;
            for (; (buffer = chars.indexOf(input.charAt(idx++))) !== -1;) {
                bs = bc % 4 ? bs * 64 + buffer : buffer;
                if (bc++ % 4) {
                    output += String.fromCharCode(255 & (bs >> ((-2 * bc) & 6)));
                }
            }
            return output;
        };

        const binary = (typeof atob === 'function') ? atob(b64) : atobPolyfill(b64);
        try {
            // decode UTF-8 binary to string
            return decodeURIComponent(escape(binary));
        } catch (e) {
            return binary;
        }
    }

    async ensureAndroidPermissions() {
        if (Platform.OS !== 'android') return;

        const sdk = Platform.Version || 0;
        if (sdk >= 31) {
            

            const result = await PermissionsAndroid.requestMultiple(perms);
            for (const p of perms) {
                if (result[p] !== PermissionsAndroid.RESULTS.GRANTED) {
                    throw new Error(`Missing ${p}`);
                }
            }
        } else {
            const has = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION);
            if (!has) {
                const res = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION);
                if (res !== PermissionsAndroid.RESULTS.GRANTED) throw new Error('Missing ACCESS_FINE_LOCATION');
            }
        }
    }

    async StartAdvertising() {
        console.log("Start advertising called");
        try {
            if (Platform.OS === 'android') {
                await this.ensureAndroidPermissions();
            }
            var bt = NativeModules.CustomBluetooth;
            if (!bt) {
                console.error('Native module CustomBluetooth is not available. NativeModules keys:', Object.keys(NativeModules));
                throw new Error('Native module CustomBluetooth not found — rebuild the app or register the package in MainApplication.java');
            }

            await bt.addService(this.serviceUuid, true);
            await bt.addCharacteristicToService(this.serviceUuid,
                this.usernameCharacteristicUuid,
                1,
                2 | 16);
                // encode string base64 (avoid Node Buffer in RN JS runtime)
                const b64 = this.utf8ToBase64(this.username);

            // receiveMessage characteristic must be writable: permissions (READ|WRITE=1|16=17), properties (READ|WRITE|NOTIFY=2|8|16=26)
            await bt.addCharacteristicToService(this.serviceUuid, this.receiveMessageCharacteristicUuid, 1 | 16, 2 | 4 | 8 | 16);

            // Get message from write
            bt.onCharacteristicWriteRequest(this.serviceUuid, this.receiveMessageCharacteristicUuid, async (deviceId, value) => {
                try {
                    const msg = this.base64ToUtf8(value);
                    var msg2 = msg.split(":");
                    var data = { device: this.connectedDevices.find(x => x.username === msg2[0]), message: msg2[1] };
                    DeviceEventEmitter.emit('onConvertedData', data );
                    await this.RestartAdvertising();
                } catch (e) {
                    console.error('Error decoding message:', e);
                }
            });

            await bt.setCharacteristicValue(this.serviceUuid, this.usernameCharacteristicUuid, b64);
            await bt.setCharacteristicValue(this.serviceUuid, this.receiveMessageCharacteristicUuid, this.utf8ToBase64('')); // empty initial value
            // explicitly request includeDeviceName so the native module includes the device name in the advertisement
            await bt.startAdvertising(0, { includeDeviceName: false });
        } catch(err) {
            console.error('StartAdvertising error', err);
            throw err; // rethrow so caller can know
        }
    }

    async StopAdvertising() {
        try {
            if (Platform.OS === 'android') {
                await this.ensureAndroidPermissions();
            }
            var bt = NativeModules.CustomBluetooth;
            if (!bt) {
                console.error('Native module CustomBluetooth is not available. NativeModules keys:', Object.keys(NativeModules));
                throw new Error('Native module CustomBluetooth not found — rebuild the app or register the package in MainApplication.java');
            }
            await bt.stopAdvertising();
        } catch (e) {
            console.error('StopAdvertising error', e);
        }
    }

    async RestartAdvertising() {
        console.log("RestartAdvertising called");
        await this.StopAdvertising();
        await this.StartAdvertising();
    }

    setReadResponse(serviceUUID, charUUID, str) {
        if (!serviceUUID || !charUUID) return;
        const key = serviceUUID + '|' + charUUID;
        this.readResponses[key] = str;
        // also push this to native characteristic value so read requests return it
        try {
            const CustomBluetooth = NativeModules.CustomBluetooth;
            if (CustomBluetooth && typeof CustomBluetooth.setCharacteristicValue === 'function') {
                const b64 = this.utf8ToBase64(str || '');
                CustomBluetooth.setCharacteristicValue(serviceUUID, charUUID, b64)
                    .then(() => {})
                    .catch(e => console.error('setCharacteristicValue error', e));
            }
        } catch (e) {
            console.error('setReadResponse native update error', e);
        }
    }

    // enqueue function to serialize reads
    _enqueueRead(fn) {
        this._readQueue = this._readQueue.then(() => fn()).catch(() => {});
        return this._readQueue;
    }

    // Stable characteristic read helper: always connect & discover inside a serialized queue.
    async safeReadCharacteristicValue(device) {
        if (!device || !device.id || !device.rawScanRecord) return '';
        return this._enqueueRead(async () => {
            let connectedHere = false;
            try {
                // Quick pre-check
                const alreadyConnected = await this.manager.isDeviceConnected(device.id).catch(() => false);
                if (!alreadyConnected) {
                    device = await this.manager.connectToDevice(device.id, { timeout: 10000 });
                    connectedHere = true;
                }
                // Ensure services
                try { await device.discoverAllServicesAndCharacteristics(); } catch (e) { /* ignore, sometimes already discovered */ }
                const char = await this.manager.readCharacteristicForDevice(device.id, this.serviceUuid, this.usernameCharacteristicUuid);
                await this.manager.cancelDeviceConnection(device.id).catch(() => {});
                if (char && char.value) {
                    return this.base64ToUtf8(char.value);
                }
                return '';
            } catch (e) {
                console.error('[BluetoothService] safeReadCharacteristicValue failed', device.id, e && e.message);
                return '';
            } finally {
                if (connectedHere) {
                    // small delay to allow stack to settle before disconnect which can reduce race crashes
                    try { await sleep(50); } catch(_) {}
                    try { await this.manager.cancelDeviceConnection(device.id); } catch (_) { }
                }
            }
        });
    }

    startScan(filter = null) {
        if (this.manager == null) {
            this.manager = new BleManager();
        }
        console.log('Starting BLE scan with filter:', filter);
        // Defensive: stop any prior scan
        try { this.manager.stopDeviceScan(); } catch(_) {}
        this.manager.startDeviceScan([this.serviceUuid], null, async (error, device) => {
            if (error) {
                console.error('Scan error:', error);
                DeviceEventEmitter.emit('bleScanError', { error: error.message });
                return;
            }
            if (!device) return;
            // optionally filter by advertisement data or name
            // guard everything so no exception bubbles to native
            try {
                if (!filter || (device.name && device.name.includes(filter))) {
                    var find = this.connectedDevices.find(d => d.rawScanRecord === device.rawScanRecord)
                    if (find) {
                        find.id = device.id;
                        return;
                    }; // duplicate
                    this.connectedDevices.push(device);

                    // attempt to read username (safe)
                    let username = '';
                    try {
                        username = await this.safeReadCharacteristicValue(device);
                        this.connectedDevices.find(d => d.rawScanRecord === device.rawScanRecord).username = username;
                    } catch (e) {
                        console.error('safe read failed', e && (e.message || e));
                        username = 'Username read failed';
                    }

                    DeviceEventEmitter.emit('bleDeviceFound', { device: this.connectedDevices.find(d => d.rawScanRecord === device.rawScanRecord) });
                }
            } catch (e) {
                // swallow/log to avoid HostFunction crashes
                console.error('Scan callback caught error:', e && (e.message || e));
            }
        });

    }

    GetConnectedDevices() {
        return this.connectedDevices;
    }

    stopScan() {
    try { this.manager.stopDeviceScan(); } catch(e) { console.error('stopScan error', e); }
    }

    destroy() {
        this.manager.destroy();
    }

    SetName(name) {
        this.username = name;
    }

    async SendMessage(deviceId, message) {
        try {
            message = this.username + ":" + message;
            const device = this.connectedDevices.find(d => d.rawScanRecord === deviceId);
            if (!device) {
                console.error('Device not found:', deviceId, this.connectedDevices);
                return;
            }
            // ensure connection
            let connectedDev = device;
            try {
                if (!(await this.manager.isDeviceConnected(device.id))) {
                    connectedDev = await this.manager.connectToDevice(device.id, { timeout: 8000 });
                    await connectedDev.discoverAllServicesAndCharacteristics();
                }
            } catch (connErr) {
                console.error('Connection before write failed', connErr);
                return;
            }
            await this.manager.writeCharacteristicWithoutResponseForDevice(connectedDev.id, this.serviceUuid, this.receiveMessageCharacteristicUuid, this.utf8ToBase64(message));
            //await this.manager.cancelDeviceConnection(connectedDev.id).catch(() => {});
        } catch (e) {
            console.error('SendMessage error', e);
        }
    }
}

const sleep = (ms) => new Promise((res) => setTimeout(res, ms));

export default new BluetoothService();

