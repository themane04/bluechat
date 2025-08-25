import {
  FlatList,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  View,
} from 'react-native';
import styles from './PersonalChatScreen.styles.ts';
import userChats from '../../assets/MockData/userChats.json';
import { INPUT_BAR_HEIGHT, STORAGE_KEY } from './temp.ts';
import { useEffect, useRef, useState } from 'react';
import StorageService from '../../services/LocalStorage/storage.ts';
import { useHeaderHeight } from '@react-navigation/elements';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import ChatFlatList from '../../components/PersonalChatScreen/ChatFlatList/ChatFlatList.tsx';
import PersonalChatInputFooter from '../../components/PersonalChatScreen/PersonalChatInputFooter/PersonalChatInputFooter.tsx';
import { useRoute } from '@react-navigation/core';
import bluetoothService from '../../services/Bluetooth/bluetoothService';

export default function PersonalChatScreen() {
  const [messages, setMessages] = useState<any[]>([]);
  const [text, setText] = useState('');
  const listRef = useRef<FlatList>(null);
  const headerHeight = useHeaderHeight();
  const insets = useSafeAreaInsets();
  const isIOS = Platform.OS === 'ios';
  const [kbHeight, setKbHeight] = useState(0);
  const route = useRoute();
  const { chatId } = route.params as {
    chatId: string;
  };

  useEffect(() => {
    (async () => {
      const stored = await StorageService.getItem<any[]>(STORAGE_KEY);
      if (stored && Array.isArray(stored)) {
        const chat = stored.find(c => c.id === chatId);
        setMessages(sortByTime(chat?.messages ?? []));
      } else {
        const initial = userChats.chats;
        await StorageService.setItem(STORAGE_KEY, initial);
        const chat = initial.find(c => c.id === chatId);
        setMessages(sortByTime(chat?.messages ?? []));
      }
    })();
  }, [chatId]);

  const sortByTime = (arr: any[]) =>
    [...arr].sort(
      (a, b) =>
        new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime(),
    );

  const genId = () => 'm' + Math.random().toString(36).slice(2, 9);

  const handleSend = async () => {
    const trimmed = text.trim();
    if (!trimmed) {
      return;
    }

    const newMsg = {
      id: genId(),
      from: 'me',
      text: trimmed,
      timestamp: new Date().toISOString(),
      status: 'sent',
    };

    setText('');

    await bluetoothService.SendMessage(chatId, trimmed);

    setMessages(prev => {
      return sortByTime([...prev, newMsg]);
    });

    const chats =
      (await StorageService.getItem<any[]>(STORAGE_KEY)) ?? userChats.chats;

    const idx = chats.findIndex(c => c.id === chatId);
    if (idx >= 0) {
      chats[idx] = {
        ...chats[idx],
        messages: [...chats[idx].messages, newMsg],
      };
    } else {
      chats.push({ id: chatId, userId: 'u1', messages: [newMsg] });
    }

    await StorageService.setItem(STORAGE_KEY, chats);

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        listRef.current?.scrollToEnd?.({ animated: true });
      });
    });
  };

  useEffect(() => {
    const s1 = Keyboard.addListener('keyboardDidShow', e =>
      setKbHeight(e.endCoordinates.height),
    );
    const s2 = Keyboard.addListener('keyboardDidHide', () => setKbHeight(0));
    return () => {
      s1.remove();
      s2.remove();
    };
  }, []);

  useEffect(() => {
    if (kbHeight > 0) {
      requestAnimationFrame(() =>
        listRef.current?.scrollToEnd?.({ animated: true }),
      );
    }
  }, [kbHeight]);

  const scrollToBottom = () => {
    requestAnimationFrame(() => {
      listRef.current?.scrollToEnd?.({ animated: false });
    });
  };

  useEffect(() => {
    if (messages.length) {
      const t = setTimeout(scrollToBottom, 0);
      return () => clearTimeout(t);
    }
  }, [messages]);

  const handleListLayout = () => {
    if (messages.length) scrollToBottom();
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={isIOS ? 'padding' : undefined}
      keyboardVerticalOffset={isIOS ? headerHeight : 0}
    >
      <View>
        <FlatList
          ref={listRef}
          data={messages}
          keyExtractor={i => i.id}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          /* eslint-disable-next-line react-native/no-inline-styles */
          contentContainerStyle={{
            paddingTop: 6,
            paddingBottom: INPUT_BAR_HEIGHT + insets.bottom,
          }}
          ListFooterComponent={
            <View style={{ height: Math.max(kbHeight - insets.bottom, 0) }} />
          }
          onLayout={handleListLayout}
          extraData={messages}
          renderItem={({ item, index }) => {
            return (
              <ChatFlatList item={item} index={index} messages={messages} />
            );
          }}
        />
        <PersonalChatInputFooter
          insets={insets}
          kbHeight={kbHeight}
          text={text}
          setText={setText}
          scrollToBottom={scrollToBottom}
          handleSend={handleSend}
        />
      </View>
    </KeyboardAvoidingView>
  );
}
