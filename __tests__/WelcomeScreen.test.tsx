const mockNavigate = jest.fn();

jest.mock('@react-navigation/native', () => ({
  ...jest.requireActual('@react-navigation/native'),
  useNavigation: () => ({
    navigate: mockNavigate,
  }),
}));

import React from 'react';
import { fireEvent, render } from '@testing-library/react-native';
import WelcomeScreen from '../screens/WelcomeScreen/WelcomeScreen';

describe('WelcomeScreen', () => {
  beforeEach(() => {
    mockNavigate.mockClear();
  });

  it("shows the button 'Start messaging'", () => {
    const { getByText } = render(<WelcomeScreen />);
    expect(getByText('Start messaging')).toBeTruthy();
  });

  it("navigates when 'Start messaging' is pressed", () => {
    const { getByText } = render(<WelcomeScreen />);
    fireEvent.press(getByText('Start messaging'));
    expect(mockNavigate).toHaveBeenCalledWith('Profile');
  });
});
