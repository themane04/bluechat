import React from 'react';
import { Text, View } from 'react-native';
import welcomeScreenStyles from './WelcomeScreen.styles.ts';
import appStyles from '../../App.styles.ts';

export default function WelcomeScreen() {
  return (
    <View style={welcomeScreenStyles.container}>
      <Text style={appStyles.text}>🚀 Willkommen bei BlueChat!</Text>
      <Text style={appStyles.text}>
        Verbinde dich mit Freunden über Bluetooth – ganz ohne Internet.
      </Text>
    </View>
  );
}
