import React from 'react';
import { Image, Text, View } from 'react-native';
import styles from './WelcomeScreen.styles';
import CustomButton from '../../components/shared/CustomButton/CustomButton.tsx';

export default function WelcomeScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.topBox}>
        <Image
          source={require('../../assets/Images/WelcomeScreen/people.png')}
          style={styles.image}
          resizeMode="contain"
          accessible
          accessibilityLabel="BlueChat Illustration"
        />
        <Text style={styles.headline}>
          Connect easily with everyone around you
        </Text>
      </View>

      <View style={styles.bottomBox}>
        <Text style={styles.terms}>Terms & Privacy Policy</Text>
        <CustomButton navigateTo={'Profile'}>Start messaging</CustomButton>
      </View>
    </View>
  );
}
