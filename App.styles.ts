import { StyleSheet } from 'react-native';
import { theme } from './utils/styles/theme.ts';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.neutralActive,
  },
  text: {
    fontFamily: 'Mulish-Regular',
    color: theme.colors.neutralOffWhite,
  },
});
