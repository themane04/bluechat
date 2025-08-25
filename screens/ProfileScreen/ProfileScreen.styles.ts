import { StyleSheet } from 'react-native';
import { theme } from '../../utils/Styles/theme.ts';

export default StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  input: {
    ...theme.typography.bodyText2,
    height: 40,
    color: 'white',
    backgroundColor: theme.colors.neutralDarkSecondary,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginTop: 100,
    width: '80%',
  },
  buttonContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    padding: 20,
  },
});
