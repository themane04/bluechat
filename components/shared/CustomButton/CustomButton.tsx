import styles from './CustomButton.styles.ts';
import { Text, TouchableOpacity } from 'react-native';
import React from 'react';
import { useNavigation } from '@react-navigation/core';

export default function CustomButton({ navigateTo }: { navigateTo: string }) {
  const navigation = useNavigation();

  return (
    <TouchableOpacity
      style={styles.button}
      onPress={() => navigation.navigate(navigateTo as never)}
      activeOpacity={0.8}
    >
      <Text style={styles.buttonText}>Start Messaging</Text>
    </TouchableOpacity>
  );
}
