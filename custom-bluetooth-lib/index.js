// Minimal JS facade for a custom Bluetooth implementation
// Implementations can add native modules under android/ios later.

import { NativeModules, NativeEventEmitter, DeviceEventEmitter, Platform } from 'react-native';

const LINKING_ERROR = `The package '@local/custom-bluetooth-lib' doesn't seem to be linked. Make sure you
- Rebuilt the app after installing the package
- You are not using Expo Go
`;

const NativeImpl = NativeModules.CustomBluetooth || new Proxy({}, {
  get() { throw new Error(LINKING_ERROR); }
});

const nativeEmitter = NativeImpl ? new NativeEventEmitter(NativeImpl) : null;

class CustomBluetooth {
  // thin wrappers for expected ops
  async addService(uuid, primary = true) { return NativeImpl.addService(uuid, primary); }
  async addCharacteristic(serviceUuid, charUuid, permissions, properties) { return NativeImpl.addCharacteristicToService(serviceUuid, charUuid, permissions, properties); }
  async startAdvertising(options = {}) { return NativeImpl.startAdvertising(0, options); }
  async stopAdvertising() { return NativeImpl.stopAdvertising(); }
  async startScan(filters = []) { return NativeImpl.startScan(filters); }
  async stopScan() { return NativeImpl.stopScan(); }
  async sendNotification(serviceUuid, charUuid, base64Message) { return NativeImpl.sendNotificationToDevice(serviceUuid, charUuid, base64Message); }
  async setCharacteristicValue(serviceUuid, charUuid, base64Value) { return NativeImpl.setCharacteristicValue(serviceUuid, charUuid, base64Value); }
  async readCharacteristicValue(serviceUuid, charUuid) { return NativeImpl.readCharacteristicValue(serviceUuid, charUuid); }

  on(event, handler) {
    if (nativeEmitter) return nativeEmitter.addListener(event, handler);
    return () => {};
  }
}

export default new CustomBluetooth();
