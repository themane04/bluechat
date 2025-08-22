import styles from './Chat.styles.ts';
import { Image, Pressable, Text, View } from 'react-native';
import React, { useEffect } from 'react';
import { Chat as ChatInterface } from '../../../interfaces/Chat/chat.ts';
import StorageService from '../../../services/LocalStorage/storage.ts';
import { User } from '../../../interfaces/User/user.ts';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../../interfaces/Shared/shared.ts';

type ChatProps = {
  chat: ChatInterface;
};
type Nav = NativeStackNavigationProp<RootStackParamList, 'Chats'>;

export default function Chat({ chat }: ChatProps) {
  const [initials, setInitials] = React.useState<string>('');
  const [username, setUsername] = React.useState<string | undefined>();
  const navigation = useNavigation<Nav>();

  useEffect(() => {
    StorageService.getItemById<User>('users', 'me')
      .then(user => {
        setUsername(user?.name);
        setInitials(
          (user?.name ?? 'Anonymous User')
            .split(' ')
            .map(n => n[0]?.toUpperCase())
            .join('')
            .slice(0, 2),
        );
      })
      .catch(error => {
        console.error('Error fetching user data:', error);
      });
  }, []);

  const selectChat = () => {
    navigation.navigate('PersonalChat', {
      chatId: chat.id,
      username: username ?? 'Unknown',
    });
  };

  return (
    <Pressable onPress={selectChat}>
      <View style={styles.chatContainer}>
        <Image style={styles.chatImage} />
        <Text style={styles.avatarText}>{initials}</Text>
        <View style={styles.chatTextContainer}>
          <Text style={styles.userNameText}>{username}</Text>
          <Text style={styles.statusText}>Online</Text>
        </View>
      </View>
    </Pressable>
  );
}
