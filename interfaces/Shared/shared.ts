export type RootStackParamList = {
  Welcome: undefined;
  Profile: undefined;
  Chats: undefined;
  PersonalChat: { chatId: string; username: string };
};

export interface ICustomButtonProps {
  active?: boolean;
  navigateTo: string;
  children?: string;
  submitFunc?: () => void;
}
