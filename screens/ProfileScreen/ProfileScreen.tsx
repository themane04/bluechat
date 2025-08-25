import React from 'react';
import { TextInput, ToastAndroid, View } from 'react-native';
import profileScreenStyles from './ProfileScreen.styles.ts';
import CustomButton from '../../components/shared/CustomButton/CustomButton.tsx';
import StorageService from '../../services/LocalStorage/storage.ts';
import { User } from '../../interfaces/User/user.ts';

export default function ProfileScreen() {
  const [text, setText] = React.useState('');

  const handleSaveUsername = () => {
    StorageService.setItem<User>('user', { id: 'me', name: text })
      .then(() => {
        ToastAndroid.show('User updated successfully', ToastAndroid.SHORT);
      })
      .catch(() => {
        ToastAndroid.show('Error updating user', ToastAndroid.SHORT);
      });
  };

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
