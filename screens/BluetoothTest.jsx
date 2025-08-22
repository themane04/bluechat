import { Button, Text, View, NativeEventEmitter, NativeModules, DeviceEventEmitter } from "react-native";
import React, { useState, useEffect } from "react";
import BluetoothService from "../services/bluetoothService";

const BluetoothClientModule = NativeModules.BluetoothClient;
const eventEmitter = new NativeEventEmitter(BluetoothClientModule);

export default function BluetoothTest() {
    const [messages, setMessages] = useState([]);
    const [devices, setDevices] = useState([]);
    const [selectedDevice, setSelectedDevice] = useState(null);

    console.log(devices.filter(x => x.name === 'BlueChat'));

    useEffect(() => {
        const subscription = DeviceEventEmitter.addListener('onConvertedData', (event) => {
            setMessages(prev => [...prev, event.data]);
        });
        const bleSub = DeviceEventEmitter.addListener('bleDeviceFound', ({ device }) => {
            if (device.serviceUUIDs != null) {
                console.log('Found device:', device);
                //if (devices.find(d => d.id === device.id)) return; // Avoid duplicates
                console.log("new device list: ", BluetoothService.GetConnectedDevices());
                setDevices(prev => BluetoothService.GetConnectedDevices());
            }
            
        });

        // Cleanup on unmount
        return () => {
            subscription.remove();
            bleSub.remove();
        };
    }, []);

    return <View style={{ padding: 20, paddingTop: 100 }}>
        <Button title="Start broadcasting" onPress={() => {BluetoothService.StartAdvertising()}} />
        <Button title="Start scanning" onPress={() => {BluetoothService.startScan()}} />
        <Text>Selected device: {selectedDevice ? selectedDevice.name : 'None'}</Text>
        <Text>Received messages: </Text>
        {messages.map((msg, index) => (
            <Text key={index}>{msg}</Text>
        ))}
        <Text>Discovered devices: </Text>
        {devices.map((device, index) => (
            <View key={index}>
                <Text>{device.id} {device.username}</Text>
                <Button title="Send Message" onPress={() => BluetoothService.SendMessage(device.rawScanRecord, 'Hello from client!')} />
            </View>
        ))}
    </View>
}