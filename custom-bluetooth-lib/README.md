Minimal custom Bluetooth library scaffold for React Native.

Usage:
- Import with relative path in your app: `import CustomBluetooth from '../custom-bluetooth-lib';`
- Implement native module `CustomBluetooth` on Android/iOS to provide the methods used in `index.js`.

Provided JS API:
- addService(uuid, primary)
- addCharacteristic(serviceUuid, charUuid, permissions, properties)
- startAdvertising(options)
- stopAdvertising()
- startScan(filters)
- stopScan()
- sendNotification(serviceUuid, charUuid, base64Message)
- on(event, handler) — subscribes to native events

Notes:
- Keep implementation minimal: native module should expose same method names.
- Use Base64 for binary data interchange on the JS<->native boundary.
