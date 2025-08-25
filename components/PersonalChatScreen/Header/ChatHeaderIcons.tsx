import Icon from 'react-native-vector-icons/FontAwesome';
import { View } from 'react-native';
import React from 'react';
import { theme } from '../../../utils/Styles/theme.ts';
import styles from './ChatHeaderIcons.styles.ts';

export default function ChatHeaderIcons() {
  return (
    <View style={styles.container}>
      <Icon name="search" size={theme.sizes.headerIconSize} color="#fff" />
      <Icon name="bars" size={theme.sizes.headerIconSize} color="#fff" />
    </View>
  );
}
