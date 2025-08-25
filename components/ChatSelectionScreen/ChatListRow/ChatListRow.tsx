import styles from './ChatListRow.styles.ts';
import { Image, Pressable, Text, View } from 'react-native';
import React, { useEffect } from 'react';
import { ChatProps } from '../../../interfaces/Chat/chat.ts';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../../interfaces/Shared/shared.ts';

type Nav = NativeStackNavigationProp<RootStackParamList, 'Chats'>;

export default function ChatListRow({ chat }: ChatProps) {
  const [initials, setInitials] = React.useState<string>('');
  const navigation = useNavigation<Nav>();

  useEffect(() => {
    setInitials(
      (chat?.username ?? 'Anonymous User')
        .split(' ')
        .map(n => n[0]?.toUpperCase())
        .join('')
        .slice(0, 2),
    );
  }, [chat?.username]);

  const selectChat = () => {
    navigation.navigate('PersonalChat', {
      chatId: chat.id,
      username: chat.username ?? 'Unknown',
    });
  };

  return (
    <Pressable onPress={selectChat}>
      <View style={styles.chatContainer}>
        <Image style={styles.chatImage} />
        <Text style={styles.avatarText}>{initials}</Text>
        <View style={styles.chatTextContainer}>
          <Text style={styles.userNameText}>{chat.username}</Text>
          <Text style={styles.statusText}>
            {chat.lastSeen >= Date.now() - 60 * 1000 ? 'Online' : 'Offline'}
          </Text>
        </View>
      </View>
    </Pressable>
  );
}
