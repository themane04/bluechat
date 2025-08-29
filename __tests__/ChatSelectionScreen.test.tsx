import React from 'react';
import { fireEvent, render, waitFor } from '@testing-library/react-native';
import ChatSelectionScreen from '../screens/ChatSelectionScreen/ChatSelectionScreen';

// Mock StorageService
jest.mock('../services/LocalStorage/storage', () => ({
  getItemById: jest.fn(() =>
    Promise.resolve({ id: 'me', name: 'Marjan Tester' }),
  ),
}));

// Mock navigation
const mockNavigate = jest.fn();
jest.mock('@react-navigation/native', () => ({
  ...jest.requireActual('@react-navigation/native'),
  useNavigation: () => ({ navigate: mockNavigate }),
}));
jest.mock('@react-navigation/core', () => ({
  ...jest.requireActual('@react-navigation/core'),
  useNavigation: () => ({ navigate: mockNavigate }),
}));

describe('ChatSelectionScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockNavigate.mockClear();
  });

  it('renders chats', async () => {
    const { getAllByText } = render(<ChatSelectionScreen />);
    await waitFor(() => {
      expect(getAllByText('Online').length).toBeGreaterThan(0);
    });
  });

  it('loads username initials from storage', async () => {
    const { getAllByText } = render(<ChatSelectionScreen />);
    await waitFor(() => {
      expect(getAllByText('MT').length).toBeGreaterThan(0);
      expect(getAllByText('Marjan Tester').length).toBeGreaterThan(0);
    });
  });

  it('navigates to PersonalChat when a chat is pressed', async () => {
    const { getAllByText } = render(<ChatSelectionScreen />);

    // wait until username is loaded
    await waitFor(() => {
      expect(getAllByText('Marjan Tester').length).toBeGreaterThan(0);
    });

    fireEvent.press(getAllByText('Online')[0]);

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('PersonalChat', {
        chatId: expect.any(String),
        username: 'Marjan Tester',
      });
    });
  });
});
