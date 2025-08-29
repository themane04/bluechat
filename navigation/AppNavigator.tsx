import React from 'react';
import WelcomeScreen from '../screens/WelcomeScreen/WelcomeScreen.tsx';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import styles from '../App.styles';
import ProfileScreen from '../screens/ProfileScreen/ProfileScreen.tsx';
import { theme } from '../utils/Styles/theme.ts';
import PersonalChatScreen from '../screens/PersonalChat/PersonalChatScreen.tsx';
import HeaderBackButton from '../components/shared/Header/HeaderBackButton.tsx';
import ChatHeaderIcons from '../components/PersonalChatScreen/Header/ChatHeaderIcons.tsx';
import ChatSelectionScreen from '../screens/ChatSelectionScreen/ChatSelectionScreen.tsx';
import { RootStackParamList } from '../interfaces/Shared/shared.ts';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Welcome"
        screenOptions={({ navigation }) => ({
          headerShown: true,
          contentStyle: styles.container,
          headerStyle: {
            backgroundColor: theme.colors.neutralActive,
            fontSize: theme.typography.subheading1,
          },
          headerTintColor: theme.colors.neutralWhite,
          headerShadowVisible: false,
          headerBackTitleVisible: false,
          // eslint-disable-next-line react/no-unstable-nested-components
          headerLeft: ({ canGoBack }) =>
            canGoBack ? (
              <HeaderBackButton onPress={() => navigation.goBack()} />
            ) : null,
        })}
      >
        <Stack.Screen
          name="Welcome"
          options={{ headerShown: false }}
          component={WelcomeScreen}
        />
        <Stack.Screen name="Profile" component={ProfileScreen} />
        <Stack.Screen name="Chats" component={ChatSelectionScreen} />
        <Stack.Screen
          name={'PersonalChat'}
          component={PersonalChatScreen}
          options={({ route }) => ({
            title: route.params?.username ?? 'Chat',
            // eslint-disable-next-line react/no-unstable-nested-components
            headerRight: () => <ChatHeaderIcons />
          })}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
