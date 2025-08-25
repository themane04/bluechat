import { StyleSheet } from 'react-native';
import { theme } from '../../../utils/Styles/theme.ts';

export default StyleSheet.create({
  inputBar: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 10,
    paddingVertical: 10,
    backgroundColor: theme.colors.neutralActive,
    gap: 10,
  },
  plusBtn: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    backgroundColor: theme.colors.neutralDarkSecondary,
    color: theme.colors.neutralOffWhite,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 4,
    fontSize: 16,
    maxWidth: 279,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendBtn: {
    marginLeft: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
