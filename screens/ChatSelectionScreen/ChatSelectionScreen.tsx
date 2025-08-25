import React from 'react';
import { View, DeviceEventEmitter, NativeEventEmitter, NativeModules } from 'react-native';
import chatSelectionScreenStyles from './ChatSelectionScreen.styles.ts';
import { chats }  from '../../utils/MockData/chatsMock.ts';
import {Chat as ChatInterface} from "../../interfaces/Chat/chat.ts";
import Chat from '../../components/shared/Chat/Chat.tsx';
import bluetoothService from '../../services/bluetoothService.js';
import StorageService from '../../services/LocalStorage/storage.ts';

function mapDevice(device: any): ChatInterface {
    const mappedChat: ChatInterface = {
        id: device.rawScanRecord,
        username: device.username,
        lastSeen: Date.now(),
        messages: [],
        // Map other properties as needed
    };
    return mappedChat;
}

export default function ChatSelectionScreen() {
    var [chatList, setChatList] = React.useState<ChatInterface[]>([]);

    React.useEffect(() => {
        StorageService.getItem<ChatInterface[]>("chats").then(storedChats => {
            if (storedChats) {
                setChatList(storedChats);
            }
        });

        const bleSub = DeviceEventEmitter.addListener('bleDeviceFound', ({ device }) => {
            const mappedChat = mapDevice(device);
            if (chatList.find(c => c.id === mappedChat.id)) return; // already in list
            setChatList(prevChats => [...prevChats, mappedChat] );
        });

        return () => {
            bleSub.remove();
        };
    }, []);



    React.useEffect(() => {
        console.log("all service devices: ", bluetoothService.GetConnectedDevices())
        console.log('chatList updated:', chatList);
    }, [chatList]);

    return (
        <>
            <View style={chatSelectionScreenStyles.container}>
                {chatList.map((chat: ChatInterface) => (
                    <Chat key={chat.id} chat={chat}/>
                ))}
            </View>
        </>
    );
}
