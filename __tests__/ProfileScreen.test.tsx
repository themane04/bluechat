const mockNavigate = jest.fn();

// Mock navigation
jest.mock('@react-navigation/native', () => ({
  ...jest.requireActual('@react-navigation/native'),
  useNavigation: () => ({ navigate: mockNavigate }),
}));
jest.mock('@react-navigation/core', () => ({
  ...jest.requireActual('@react-navigation/core'),
  useNavigation: () => ({ navigate: mockNavigate }),
}));

// Mock StorageService
jest.mock('../services/LocalStorage/storage', () => ({
  setItem: jest.fn(() => Promise.resolve()),
}));

import React from 'react';
import { fireEvent, render, waitFor } from '@testing-library/react-native';
import ProfileScreen from '../screens/ProfileScreen/ProfileScreen';
import StorageService from '../services/LocalStorage/storage';
import { ToastAndroid } from 'react-native';

// Spy on ToastAndroid
beforeAll(() => {
  jest.spyOn(ToastAndroid, 'show').mockImplementation(() => {});
});

describe('ProfileScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockNavigate.mockClear();
  });

  it('renders input with placeholder', () => {
    const { getByPlaceholderText } = render(<ProfileScreen />);
    expect(getByPlaceholderText('Username (required)')).toBeTruthy();
  });

  it("does not call storage when 'Save' is pressed with empty input", () => {
    const { getByText } = render(<ProfileScreen />);
    fireEvent.press(getByText('Save'));
    expect(StorageService.setItem).not.toHaveBeenCalled();
  });

  it('calls storage with correct data when username is entered', async () => {
    const { getByPlaceholderText, getByText } = render(<ProfileScreen />);
    fireEvent.changeText(getByPlaceholderText('Username (required)'), 'Marjan');
    fireEvent(getByText('Save'), 'pressIn');

    await waitFor(() => {
      expect(StorageService.setItem).toHaveBeenCalledWith('user', {
        id: 'me',
        name: 'Marjan',
      });
    });
  });

  it("navigates to 'Chats' after saving", async () => {
    const { getByPlaceholderText, getByText } = render(<ProfileScreen />);
    fireEvent.changeText(getByPlaceholderText('Username (required)'), 'Patrik');
    fireEvent.press(getByText('Save'));

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('Chats');
    });
  });

  it('shows success toast', async () => {
    const { getByPlaceholderText, getByText } = render(<ProfileScreen />);
    fireEvent.changeText(getByPlaceholderText('Username (required)'), 'Damian');

    // simulate onPressIn (submitFunc)
    fireEvent(getByText('Save'), 'pressIn');

    await waitFor(() => {
      expect(ToastAndroid.show).toHaveBeenCalledWith(
        'User updated successfully',
        ToastAndroid.SHORT,
      );
    });
  });
});
