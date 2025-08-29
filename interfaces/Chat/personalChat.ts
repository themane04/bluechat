export interface IPersonalChatInputFooterProps {
  insets: any;
  kbHeight: number;
  text: string;
  setText: (text: string) => void;
  scrollToBottom: () => void;
  handleSend: () => void;
}

export interface IChatFlatListProps {
  item: any;
  index: number;
  messages: any[];
}

export interface IHeaderBackButtonProps {
  onPress: () => void;
}
