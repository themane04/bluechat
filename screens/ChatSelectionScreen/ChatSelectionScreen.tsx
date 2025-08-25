import React from 'react';
import { DeviceEventEmitter, View } from 'react-native';
import chatSelectionScreenStyles from './ChatSelectionScreen.styles.ts';
import { Chat as ChatInterface } from '../../interfaces/Chat/chat.ts';
import StorageService from '../../services/LocalStorage/storage.ts';
import ChatListRow from '../../components/ChatSelectionScreen/ChatListRow/ChatListRow.tsx';

function mapDevice(device: any): ChatInterface {
  return {
    id: device.rawScanRecord,
    username: device.username,
    lastSeen: Date.now(),
    messages: [],
  };
}

export default function ChatSelectionScreen() {
  const [chatList, setChatList] = React.useState<ChatInterface[]>([]);

  React.useEffect(() => {
    StorageService.getItem<ChatInterface[]>('chats').then(storedChats => {
      if (storedChats) {
        setChatList(storedChats);
      }
    });

    const bleSub = DeviceEventEmitter.addListener(
      'bleDeviceFound',
      ({ device }) => {
        const mappedChat = mapDevice(device);
        if (chatList.find(c => c.id === mappedChat.id)) return; // already in list
        setChatList(prevChats => [...prevChats, mappedChat]);
      },
    );

    return () => {
      bleSub.remove();
    };
  }, [chatList]);

  return (
    <>
      <View style={chatSelectionScreenStyles.container}>
        {chatList.map((chat: ChatInterface) => (
          <ChatListRow key={chat.id} chat={chat} />
        ))}
      </View>
    </>
  );
}
