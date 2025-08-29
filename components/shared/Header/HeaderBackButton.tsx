import Icon from 'react-native-vector-icons/FontAwesome';
import React from 'react';
import { IHeaderBackButtonProps } from '../../../interfaces/Chat/personalChat.ts';
import styles from './HeaderBackButton.styles.ts';

export default function HeaderBackButton({ onPress }: IHeaderBackButtonProps) {
  return <Icon name="chevron-left" style={styles.backIcon} onPress={onPress} />;
}
