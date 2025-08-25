import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import AppNavigator from './navigation/AppNavigator';
import BluetoothService from "./services/bluetoothService.js";
import { NativeModules, DeviceEventEmitter, NativeEventEmitter } from 'react-native';
import {Chat as ChatInterface, Message} from "./interfaces/Chat/chat.ts";
import StorageService from './services/LocalStorage/storage.ts';

const BluetoothClientModule = NativeModules.BluetoothClient;
const eventEmitter = new NativeEventEmitter(BluetoothClientModule);

function mapDevice(device: any): ChatInterface {
    const mappedChat: ChatInterface = {
        id: device.rawScanRecord,
        username: device.username,
        lastSeen: device.lastSeen,
        messages: [],
    };
    return mappedChat;
}

export default function App() {
  React.useEffect(() => {
    StorageService.getItem<string>("username").then(username => {
      if (username) {
        BluetoothService.SetName(username);
        // Navigate automatically to chat list when a username already exists
      }
    });

    console.log('BleClientManager?', Object.keys(NativeModules).filter(k=>k.includes('Ble'))); console.log('BleClientManager raw:', NativeModules.BleClientManager);
    BluetoothService.startScan();
    BluetoothService.StartAdvertising();

    const ble = DeviceEventEmitter.addListener('bleDeviceFound', ({ device }) => {
      device.lastSeen = Date.now();
      const mappedChat = mapDevice(device);
      StorageService.setItem("chats", (prevChats : ChatInterface[]) => {
        if (!prevChats.find(chat => chat.id === mappedChat.id)) {
          console.log("Saving chats: ", [...prevChats, mappedChat]);
          return [...prevChats, mappedChat];
        } else {
          console.log("Updating chat: ", mappedChat);
          return prevChats.map(chat => chat.id === mappedChat.id ? mappedChat : chat);
        }
      });
      console.log('Device found:', device);
    });

    const messageReceived = DeviceEventEmitter.addListener('onConvertedData', (data) => {
      console.log('Message received:', data);
      StorageService.setItem("chats", (prevChats : ChatInterface[]) => {
        const chat = prevChats.find(chat => chat.id === data.device.rawScanRecord);
        if (chat) {
          var message : Message = {
            from: data.device.rawScanRecord,
            text: data.message,
            timestamp: Date.now()
          }
          chat.messages.push(message);
        }
        console.log('Updated chats:', prevChats);
        return prevChats;
      });
    });

    return () => {
      ble.remove();
      messageReceived.remove();
    }
  }, []);

  return (
    <SafeAreaProvider>
      <AppNavigator />
    </SafeAreaProvider>
  );
}
