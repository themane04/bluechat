import { StyleSheet } from 'react-native';
import { theme } from '../../../utils/Styles/theme.ts';

export default StyleSheet.create({
  audioCard: {
    backgroundColor: 'rgba(255,255,255,0.18)',
    padding: 8,
    borderRadius: 12,
  },
  audioRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  audioPlay: {
    width: 26,
    height: 26,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.25)',
  },
  audioDuration: {
    color: theme.colors.neutralOffWhite,
    fontSize: 12,
    minWidth: 36,
  },
  waveContainer: {
    flex: 1,
    height: 28,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  waveBar: {
    width: 3,
    borderRadius: 2,
    backgroundColor: 'rgba(255,255,255,0.9)',
  },
});
