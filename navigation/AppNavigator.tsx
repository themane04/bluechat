import React from 'react';
import WelcomeScreen from '../screens/WelcomeScreen/WelcomeScreen.tsx';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {NavigationContainer} from '@react-navigation/native';
import styles from '../App.styles';
import ProfileScreen from "../screens/ProfileScreen/ProfileScreen.tsx";

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
    return (
        <NavigationContainer>
            <Stack.Navigator
                initialRouteName="Welcome"
                screenOptions={{
                    headerShown: true,
                    contentStyle: styles.container,
                }}
            >
                <Stack.Screen name="Welcome" component={WelcomeScreen}/>
                <Stack.Screen name="Profile" component={ProfileScreen}/>
            </Stack.Navigator>
        </NavigationContainer>
    );
}
