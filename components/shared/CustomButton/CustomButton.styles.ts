import { StyleSheet } from 'react-native';
import { theme } from '../../../utils/styles/theme.ts';

export default StyleSheet.create({
  button: {
    backgroundColor: theme.colors.brandColorDarkMode,
    borderRadius: 30,
    paddingVertical: 14,
    paddingHorizontal: 22,
    alignSelf: 'stretch',
    marginTop: 16,
  },
  buttonText: {
    ...theme.typography.subheading2,
    color: theme.colors.neutralWhite,
    textAlign: 'center',
  },
});
