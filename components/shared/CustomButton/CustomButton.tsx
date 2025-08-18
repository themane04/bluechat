import styles from './CustomButton.styles.ts';
import {Text, TouchableOpacity} from 'react-native';
import React from 'react';
import {useNavigation} from '@react-navigation/core';

export default function CustomButton({active = true, navigateTo, children, submitFunc}: {
    active?: boolean,
    navigateTo: string,
    children?: string,
    submitFunc?: () => void
}) {
    const navigation = useNavigation();

    return (
        <TouchableOpacity
            style={[styles.button, !active && styles.buttonDisabled]}
            onPress={() => navigation.navigate(navigateTo as never)}
            activeOpacity={0.8}
            disabled={!active}
            onPressIn={submitFunc}
        >
            <Text style={styles.buttonText}>{children ?? ''}</Text>
        </TouchableOpacity>
    );
}
