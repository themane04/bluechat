# BlueChat

BlueChat is a React Native mobile application that enables direct, peer-to-peer messaging over Bluetooth Low Energy (BLE). It operates entirely offline, allowing users to discover and communicate with others nearby without needing an internet connection or cellular data.

The application features a custom native Android module for BLE advertising and GATT server functionalities, combined with a cross-platform client for scanning, connecting, and exchanging messages.

## Table of Contents

- [Features](#features)
- [How It Works](#how-it-works)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Running the App](#running-the-app)
- [Running Tests](#running-tests)

## Features

- **Offline Peer-to-Peer Messaging:** Communicate directly with nearby devices using Bluetooth Low Energy.
- **Cross-Platform:** Built with React Native for both Android and iOS.
- **Custom BLE Server (Android):** A native Android module implements a GATT server to advertise user profiles and handle incoming message data.
- **Device Discovery:** Scans for and displays nearby BlueChat users.
- **User Profiles:** Set a username that is advertised to other users.
- **Persistent Chat History:** Chat messages are saved locally on your device using `@react-native-async-storage/async-storage`.
- **Modern UI:** A clean, component-based interface built with React Navigation and custom-styled components.
- **Type-Safe Codebase:** Developed with TypeScript for enhanced code quality and maintainability.

## How It Works

BlueChat leverages Bluetooth Low Energy for communication. Each device acts as both a BLE server (peripheral) and a client (central).

1.  **Advertising (Server):** The application uses a custom Android native module (`custom-bluetooth-lib`) to act as a **GATT Server**. It advertises a specific service UUID. A characteristic within this service exposes the user's chosen username.
2.  **Scanning (Client):** The app uses `react-native-ble-plx` to scan for other devices advertising the same service UUID. When a device is found, it connects and reads the username characteristic to identify the user.
3.  **Messaging:** To send a message, the client writes data to a specific `receiveMessageCharacteristicUuid` on the recipient's device. The recipient's app, listening for write requests on its GATT server, receives the data, decodes it, and displays it in the chat UI.

This dual-role architecture allows for decentralized, two-way communication between any two devices running the app.

## Project Structure

The codebase is organized into a modular structure, separating concerns for UI, services, navigation, and native code.

```
.
├── android/              # Android native project
├── ios/                  # iOS native project
├── custom-bluetooth-lib/ # Custom native module for BLE server functionality
│   └── android/
├── components/           # Reusable React components (Buttons, Chat Rows)
├── navigation/           # App navigation stack (React Navigation)
├── screens/              # Top-level screen components
│   ├── WelcomeScreen/
│   ├── ProfileScreen/
│   ├── ChatSelectionScreen/
│   └── PersonalChat/
├── services/             # Application services (Bluetooth, Local Storage)
├── utils/                # Shared utilities (styles, formatting)
└── App.tsx               # Main application entry point
```

## Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing.

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or newer)
- [npm](https://www.npmjs.com/) or [Yarn](https://yarnpkg.com/)
- [React Native development environment](https://reactnative.dev/docs/environment-setup) for your target platform (Android/iOS).
  - For Android: Android Studio, JDK
  - For iOS: Xcode, CocoaPods
- Ruby and Bundler (for iOS dependency management).

### Installation

1.  **Clone the repository:**
    ```sh
    git clone https://github.com/themane04/bluechat.git
    cd bluechat
    ```

2.  **Install JavaScript dependencies:**
    ```sh
    npm install
    ```

3.  **Install iOS dependencies:**
    ```sh
    cd ios
    pod install
    ```

### Running the App

Make sure you have an emulator/simulator running or a physical device connected. The application is best tested on physical devices to use Bluetooth features.

**For Android:**

```sh
npm run android
```

**For iOS:**

```sh
npm run ios
```

## Running Tests

The project includes a suite of unit and component tests built with Jest and React Testing Library.

To run the tests, execute the following command:

```sh
npm test
