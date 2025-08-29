import { StyleSheet } from 'react-native';
import { theme } from '../../../utils/Styles/theme.ts';

export default StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: 5,
    marginRight: 10,
  },
  searchIcon: {
    fontSize: theme.sizes.headerIconSize,
    color: theme.colors.neutralOffWhite,
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  barsIcon: {
    fontSize: theme.sizes.headerIconSize,
    color: theme.colors.neutralOffWhite,
    paddingHorizontal: 12,
    paddingVertical: 12,
  }
});
