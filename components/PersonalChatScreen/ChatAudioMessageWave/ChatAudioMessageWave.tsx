import { View } from 'react-native';
import styles from './ChatAudioMessageWave.styles.ts';
import { audioMessageWaves } from '../../../screens/PersonalChat/temp.ts';

export default function ChatAudioMessageWave() {
  return (
    <View style={styles.waveContainer}>
      {audioMessageWaves.map((h, i) => (
        <View key={i} style={[styles.waveBar, { height: h }]} />
      ))}
    </View>
  );
}
