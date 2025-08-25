import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import AppNavigator from './navigation/AppNavigator';
import { DeviceEventEmitter } from 'react-native';
import { Chat as ChatInterface, Message } from './interfaces/Chat/chat.ts';
import StorageService from './services/LocalStorage/storage.ts';
import BluetoothService from './services/Bluetooth/bluetoothService';

function mapDevice(device: any): ChatInterface {
  return {
    id: device.rawScanRecord,
    username: device.username,
    lastSeen: device.lastSeen,
    messages: [],
  };
}

export default function App() {
  React.useEffect(() => {
    StorageService.getItem<string>('username').then(username => {
      if (username) {
        BluetoothService.SetName(username);
      }
    });

    BluetoothService.startScan();
    BluetoothService.StartAdvertising().then();

    const ble = DeviceEventEmitter.addListener(
      'bleDeviceFound',
      ({ device }) => {
        device.lastSeen = Date.now();
        const mappedChat = mapDevice(device);
        StorageService.setItem('chats', (prevChats: ChatInterface[]) => {
          if (!prevChats.find(chat => chat.id === mappedChat.id)) {
            return [...prevChats, mappedChat];
          } else {
            return prevChats.map(chat =>
              chat.id === mappedChat.id ? mappedChat : chat,
            );
          }
        }).then();
      },
    );

    const messageReceived = DeviceEventEmitter.addListener(
      'onConvertedData',
      data => {
        StorageService.setItem('chats', (prevChats: ChatInterface[]) => {
          const chat = prevChats.find(
            ch => ch.id === data.device.rawScanRecord,
          );
          if (chat) {
            const message: Message = {
              from: data.device.rawScanRecord,
              text: data.message,
              timestamp: Date.now(),
            };
            chat.messages.push(message);
          }
          return prevChats;
        }).then();
      },
    );

    return () => {
      ble.remove();
      messageReceived.remove();
    };
  }, []);

  return (
    <SafeAreaProvider>
      <AppNavigator />
    </SafeAreaProvider>
  );
}
