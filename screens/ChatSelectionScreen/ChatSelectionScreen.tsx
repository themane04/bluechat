import React from 'react';
import { View, DeviceEventEmitter, NativeEventEmitter, NativeModules } from 'react-native';
import chatSelectionScreenStyles from './ChatSelectionScreen.styles.ts';
import {Chat as ChatInterface} from "../../interfaces/Chat/chat.ts";
import Chat from '../../components/ChatSelectionScreen/ChatListRow/ChatListRow.tsx';
import bluetoothService from '../../services/Bluetooth/bluetoothService.js';
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

    const sortChats = React.useCallback((chats: ChatInterface[]) => {
        const now = Date.now();
        const ONE_MIN = 60 * 1000;
        // Separate into online (seen within last minute) and offline
        const online = chats.filter(c => now - (c.lastSeen || 0) <= ONE_MIN);
        const offline = chats.filter(c => now - (c.lastSeen || 0) > ONE_MIN);
        // Sort each group by most recently seen first
        online.sort((a,b) => (b.lastSeen||0) - (a.lastSeen||0));
        offline.sort((a,b) => (b.lastSeen||0) - (a.lastSeen||0));
        return [...online, ...offline];
    }, []);

    React.useEffect(() => {
        StorageService.getItem<ChatInterface[]>("chats").then(storedChats => {
            if (storedChats) {
                setChatList(sortChats(storedChats));
            }
        });

        const newDevice = DeviceEventEmitter.addListener('newDeviceFound', ({ devices }) => {
            setChatList(sortChats(devices));
        });

        return () => {
            newDevice.remove();
        };
    }, []);

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
