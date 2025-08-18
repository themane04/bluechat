import { StyleSheet } from 'react-native';
import { theme } from '../../utils/styles/theme.ts';

export default StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 48,
    paddingBottom: 32,
    alignItems: 'center',
  },
  topBox: {
    flex: 1,
    paddingHorizontal: 24,
    paddingBottom: 24,
    alignItems: 'center',
  },
  image: {
    width: 260,
    height: 260,
    marginTop: 100,
  },
  headline: {
    ...theme.typography.heading2,
    color: theme.colors.neutralOffWhite,
    textAlign: 'center',
    lineHeight: 32,
    marginTop: 32,
  },
  bottomBox: {
    width: '100%',
  },
  terms: {
    ...theme.typography.bodyText1,
    color: theme.colors.neutralOffWhite,
    textAlign: 'center',
    marginTop: 8,
  }
});
