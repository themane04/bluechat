import Icon from 'react-native-vector-icons/FontAwesome';
import React from 'react';
import { theme } from '../../../utils/styles/theme.ts';
import { IHeaderBackButtonProps } from '../../../interfaces/Chat/personalChat.ts';
import styles from './HeaderBackButton.styles.ts';

export default function HeaderBackButton({ onPress }: IHeaderBackButtonProps) {
  return (
    <Icon
      name="chevron-left"
      size={theme.sizes.headerIconSize}
      color="#fff"
      style={styles.container}
      onPress={onPress}
    />
  );
}
