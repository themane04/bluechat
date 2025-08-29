import Icon from 'react-native-vector-icons/FontAwesome';
import { View } from 'react-native';
import React from 'react';
import styles from './ChatHeaderIcons.styles.ts';

export default function ChatHeaderIcons() {
  return (
    <View style={styles.container}>
      <Icon name="search" style={styles.searchIcon} />
      <Icon name="bars" style={styles.barsIcon} />
    </View>
  );
}
