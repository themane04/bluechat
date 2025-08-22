import { StyleSheet } from 'react-native';
import { theme } from '../../../utils/styles/theme.ts';

export default StyleSheet.create({
  container: {
    padding: 10,
  },
  dateSeparator: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 12,
  },
  dateLine: {
    flex: 1,
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.3)',
  },
  dateText: {
    marginHorizontal: 10,
    fontSize: 12,
    color: theme.colors.neutralOffWhite,
    opacity: 0.8,
  },
  messageWrapper: {
    marginVertical: 5,
  },
  messageBubble: {
    maxWidth: '70%',
    padding: 10,
    borderRadius: 16,
    fontSize: theme.typography.bodyText2.fontSize,
    fontFamily: theme.typography.bodyText2.fontFamily,
  },
  myMessage: {
    backgroundColor: theme.colors.brandColorDarkMode,
    alignSelf: 'flex-end',
    borderBottomRightRadius: 0,
  },
  theirMessage: {
    backgroundColor: theme.colors.neutralActive,
    alignSelf: 'flex-start',
    borderBottomLeftRadius: 0,
  },
  mediaBubble: {
    padding: 8,
  },
  messageImage: {
    width: 'auto',
    height: 180,
    borderRadius: 12,
    marginBottom: 6,
  },
  messageText: {
    color: theme.colors.neutralOffWhite,
  },
  audioCard: {
    backgroundColor: 'rgba(255,255,255,0.18)',
    padding: 8,
    borderRadius: 4,
  },
  audioRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    width: 180,
  },
  audioPlay: {
    width: 26,
    height: 26,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
  },
  audioDuration: {
    color: theme.colors.neutralOffWhite,
    fontSize: 12,
    minWidth: 36,
  },
  audioWave: {
    flex: 1,
    height: 28,
    borderRadius: 8,
    backgroundColor: 'rgba(255,255,255,0.25)',
  },
  videoContainer: {
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 6,
  },
  videoThumb: {
    width: 260,
    height: 160,
    justifyContent: 'center',
    alignItems: 'center',
  },
  videoThumbImage: {
    borderRadius: 12,
  },
  videoPlayOverlay: {
    position: 'absolute',
    inset: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.15)',
  },
  videoPlayBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  time: {
    fontSize: 12,
    opacity: 0.7,
    marginTop: 4,
    color: theme.colors.neutralOffWhite,
  },
  timeRight: {
    alignSelf: 'flex-end',
  },
  timeLeft: {
    alignSelf: 'flex-start',
  },
});
