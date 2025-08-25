import React from 'react';
import { TextInput, ToastAndroid, View } from 'react-native';
import profileScreenStyles from './ProfileScreen.styles.ts';
import CustomButton from '../../components/shared/CustomButton/CustomButton.tsx';
import StorageService from '../../services/LocalStorage/storage.ts';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../interfaces/Shared/shared.ts';
import bluetoothService from '../../services/Bluetooth/bluetoothService';

export default function ProfileScreen() {
  const [text, setText] = React.useState('');
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList, 'Profile'>>();
  const handleSaveUsername = () => {
    StorageService.setItem<String>('username', text)
      .then(() => {
        bluetoothService.SetName(text);
        bluetoothService.RestartAdvertising().then();
        ToastAndroid.show('User updated successfully', ToastAndroid.SHORT);
      })
      .catch(() => {
        ToastAndroid.show('Error updating user', ToastAndroid.SHORT);
      });
  };

  React.useEffect(() => {
    StorageService.getItem<string>('username').then(username => {
      if (username) {
        bluetoothService.SetName(username);
        navigation.navigate('Chats');
      }
    });
  }, [navigation]);

  return (
    <>
      <View style={profileScreenStyles.container}>
        <TextInput
          style={profileScreenStyles.input}
          placeholder="Username (required)"
          value={text}
          onChangeText={setText}
          placeholderTextColor={'white'}
          maxLength={8}
        />
      </View>
      <View style={profileScreenStyles.buttonContainer}>
        <CustomButton
          active={text.length > 0}
          navigateTo={'Chats'}
          submitFunc={handleSaveUsername}
        >
          Save
        </CustomButton>
      </View>
    </>
  );
}
