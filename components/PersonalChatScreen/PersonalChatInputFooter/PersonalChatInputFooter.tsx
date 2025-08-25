import styles from './PersonalChatInputFooter.styles.ts';
import { INPUT_BAR_HEIGHT } from '../../../screens/PersonalChat/temp.ts';
import { TextInput, TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { theme } from '../../../utils/Styles/theme.ts';
import { IPersonalChatInputFooterProps } from '../../../interfaces/Chat/personalChat.ts';

export default function PersonalChatInputFooter({
  insets,
  kbHeight,
  text,
  setText,
  scrollToBottom,
  handleSend,
}: IPersonalChatInputFooterProps) {
  return (
    <View
      style={[
        styles.inputBar,
        {
          height: INPUT_BAR_HEIGHT + insets.bottom,
          paddingBottom: 10 + insets.bottom,
          transform: [{ translateY: -kbHeight }],
        },
      ]}
    >
      <TouchableOpacity style={styles.plusBtn}>
        <Icon
          name="plus"
          size={theme.sizes.headerIconSize}
          color="rgba(255,255,255,0.6)"
        />
      </TouchableOpacity>
      <TextInput
        style={styles.input}
        placeholder="Message"
        placeholderTextColor="rgba(255,255,255,0.6)"
        value={text}
        onChangeText={setText}
        multiline
        onFocus={scrollToBottom}
      />
      <TouchableOpacity style={styles.sendBtn} onPress={handleSend}>
        <Icon
          name="paper-plane"
          size={theme.sizes.headerIconSize}
          color={theme.colors.brandColorDarkMode}
        />
      </TouchableOpacity>
    </View>
  );
}
