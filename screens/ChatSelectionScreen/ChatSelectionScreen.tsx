import React from 'react';
import { View } from 'react-native';
import chatSelectionScreenStyles from './ChatSelectionScreen.styles.ts';
import { chats }  from '../../utils/MockData/chatsMock.ts';
import {Chat as ChatInterface} from "../../interfaces/Chat/chat.ts";
import ChatListRow from '../../components/ChatSelectionScreen/ChatListRow/ChatListRow.tsx';

export default function ChatSelectionScreen() {
    return (
        <>
            <View style={chatSelectionScreenStyles.container}>
                {chats.map((chat: ChatInterface) => (
                    <ChatListRow key={chat.id} chat={chat} />
                ))}
            </View>
        </>
    );
}
