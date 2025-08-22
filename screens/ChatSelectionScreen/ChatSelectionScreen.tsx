import React from 'react';
import { View } from 'react-native';
import chatSelectionScreenStyles from './ChatSelectionScreen.styles.ts';
import { chats }  from '../../utils/mockData/chatsMock.ts';
import {Chat as ChatInterface} from "../../interfaces/Chat/chat.ts";
import Chat from '../../components/shared/Chat/Chat.tsx';

export default function ChatSelectionScreen() {

    return (
        <>
            <View style={chatSelectionScreenStyles.container}>
                {chats.map((chat: ChatInterface) => (
                    <Chat key={chat.id} chat={chat} />
                ))}
            </View>
        </>
    );
}
