<div id="top">

<!-- HEADER STYLE: CLASSIC -->
<div align="center">

# BLUECHAT

<em>Connect Instantly, Communicate Limitlessly, Innovate Freely</em>

<!-- BADGES -->
<em>Built with the tools and technologies:</em>

<img src="https://img.shields.io/badge/JSON-000000.svg?style=flat&logo=JSON&logoColor=white" alt="JSON">
<img src="https://img.shields.io/badge/Markdown-000000.svg?style=flat&logo=Markdown&logoColor=white" alt="Markdown">
<img src="https://img.shields.io/badge/npm-CB3837.svg?style=flat&logo=npm&logoColor=white" alt="npm">
<img src="https://img.shields.io/badge/Swift-F05138.svg?style=flat&logo=Swift&logoColor=white" alt="Swift">
<img src="https://img.shields.io/badge/Prettier-F7B93E.svg?style=flat&logo=Prettier&logoColor=black" alt="Prettier">
<img src="https://img.shields.io/badge/JavaScript-F7DF1E.svg?style=flat&logo=JavaScript&logoColor=black" alt="JavaScript">
<img src="https://img.shields.io/badge/Gradle-02303A.svg?style=flat&logo=Gradle&logoColor=white" alt="Gradle">
<img src="https://img.shields.io/badge/React-61DAFB.svg?style=flat&logo=React&logoColor=black" alt="React">
<br>
<img src="https://img.shields.io/badge/XML-005FAD.svg?style=flat&logo=XML&logoColor=white" alt="XML">
<img src="https://img.shields.io/badge/TypeScript-3178C6.svg?style=flat&logo=TypeScript&logoColor=white" alt="TypeScript">
<img src="https://img.shields.io/badge/Facebook-0866FF.svg?style=flat&logo=Facebook&logoColor=white" alt="Facebook">
<img src="https://img.shields.io/badge/bat-31369E.svg?style=flat&logo=bat&logoColor=white" alt="bat">
<img src="https://img.shields.io/badge/ESLint-4B32C3.svg?style=flat&logo=ESLint&logoColor=white" alt="ESLint">
<img src="https://img.shields.io/badge/Kotlin-7F52FF.svg?style=flat&logo=Kotlin&logoColor=white" alt="Kotlin">
<img src="https://img.shields.io/badge/Podman-892CA0.svg?style=flat&logo=Podman&logoColor=white" alt="Podman">
<img src="https://img.shields.io/badge/Jest-C21325.svg?style=flat&logo=Jest&logoColor=white" alt="Jest">

</div>
<br>

---

## 📄 Table of Contents

- [Overview](#-overview)
- [Getting Started](#-getting-started)
    - [Prerequisites](#-prerequisites)
    - [Installation](#-installation)
    - [Usage](#-usage)
    - [Testing](#-testing)
- [Features](#-features)
- [Project Structure](#-project-structure)
- [Acknowledgment](#-acknowledgment)

---

## ✨ Overview

BlueChat is an open-source React Native framework for building Bluetooth-enabled messaging applications with a focus on modularity and scalability. It integrates custom Bluetooth functionalities, flexible UI components, and comprehensive configuration to streamline development.

**Why BlueChat?**

This project simplifies the creation of real-time, Bluetooth-based chat apps by providing:

- 🧩 **Modular Components:** Reusable UI elements like chat bubbles, headers, and input footers for rapid development.
- 🔧 **Custom Bluetooth Library:** Seamless device scanning, advertising, and communication across Android and iOS.
- 🎯 **Cross-Platform Native Integration:** Native modules and configurations ensure smooth performance on both platforms.
- 📦 **TypeScript Support:** Ensures type safety and maintainability across the codebase.
- 🚀 **Config-Driven Architecture:** Centralized configs for bundling, styling, and environment management.
- 🛠️ **Robust Testing Setup:** Mocks and unit tests to guarantee reliability and quality.

---

## 📌 Features

|      | Component       | Details                                                                                     |
| :--- | :-------------- | :------------------------------------------------------------------------------------------ |
| ⚙️  | **Architecture**  | <ul><li>Multi-platform mobile app using React Native</li><li>Native modules in Java, Kotlin, Swift</li><li>Shared codebase with TypeScript and JavaScript</li></ul> |
| 🔩 | **Code Quality**  | <ul><li>Uses ESLint, Prettier for code formatting and linting</li><li>TypeScript for type safety</li><li>Modular folder structure separating platform-specific and shared code</li></ul> |
| 📄 | **Documentation** | <ul><li>Podfile for iOS dependencies</li><li>README likely includes setup instructions</li><li>Comments and annotations in codebase</li></ul> |
| 🔌 | **Integrations**  | <ul><li>React Native ecosystem (react-native, react-navigation, react-native-ble-plx)</li><li>Build tools: Gradle, npm, bundler</li><li>Native SDKs via CocoaPods (Podfile)</li></ul> |
| 🧩 | **Modularity**    | <ul><li>Separate modules for Bluetooth, UI, and platform-specific code</li><li>Custom Bluetooth library in `custom-bluetooth-lib`</li><li>Configurable via package.json and build.gradle files</li></ul> |
| 🧪 | **Testing**       | <ul><li>Uses Jest, @testing-library/react-native, @testing-library/jest-native</li><li>Unit tests for components and logic</li><li>Test scripts configured in package.json</li></ul> |
| ⚡️  | **Performance**   | <ul><li>Uses ProGuard for code shrinking and obfuscation in Android</li><li>Native modules for performance-critical features like Bluetooth</li><li>Optimized build configurations with Gradle</li></ul> |
| 🛡️ | **Security**      | <ul><li>Includes privacy info via `privacyinfo.xcprivacy`</li><li>Keystore and debug keystore for signing Android apps</li><li>Potential use of secure storage (e.g., AsyncStorage with encryption)</li></ul> |
| 📦 | **Dependencies**  | <ul><li>Package managers: npm, bundler, Gradle, Gemfile</li><li>Core dependencies: React Native, react-navigation, react-native-ble-plx</li><li>Native dependencies via Podfile and build.gradle</li></ul> |

---

## 📁 Project Structure

```sh
└── bluechat/
    ├── App.styles.ts
    ├── App.tsx
    ├── Gemfile
    ├── README.md
    ├── __mocks__
    │   ├── @react-native-async-storage
    │   └── fileMock.js
    ├── __tests__
    │   ├── App.test.tsx
    │   ├── ChatSelectionScreen.test.tsx
    │   ├── ProfileScreen.test.tsx
    │   └── WelcomeScreen.test.tsx
    ├── android
    │   ├── app
    │   ├── build.gradle
    │   ├── gradle
    │   ├── gradle.properties
    │   ├── gradlew
    │   ├── gradlew.bat
    │   └── settings.gradle
    ├── app.json
    ├── babel.config.js
    ├── components
    │   ├── ChatSelectionScreen
    │   ├── PersonalChatScreen
    │   └── shared
    ├── custom-bluetooth-lib
    │   ├── README.md
    │   ├── android
    │   ├── index.js
    │   └── package.json
    ├── index.js
    ├── interfaces
    │   ├── Chat
    │   ├── Shared
    │   └── User
    ├── ios
    │   ├── .xcode.env
    │   ├── BlueChat
    │   ├── BlueChat.xcodeproj
    │   └── Podfile
    ├── jest.config.js
    ├── metro.config.js
    ├── navigation
    │   └── AppNavigator.tsx
    ├── package-lock.json
    ├── package.json
    ├── react-native.config.js
    ├── screens
    │   ├── ChatSelectionScreen
    │   ├── PersonalChat
    │   ├── ProfileScreen
    │   └── WelcomeScreen
    ├── services
    │   ├── Bluetooth
    │   └── LocalStorage
    ├── tsconfig.json
    └── utils
        ├── Styles
        └── Time
```

---

## 🚀 Getting Started

### 📋 Prerequisites

This project requires the following dependencies:

- **Programming Language:** TypeScript
- **Package Manager:** Bundler, Npm, Gradle
- **Container Runtime:** Podman

### ⚙️ Installation

Build bluechat from the source and install dependencies:

1. **Clone the repository:**

    ```sh
    ❯ git clone https://github.com/themane04/bluechat
    ```

2. **Navigate to the project directory:**

    ```sh
    ❯ cd bluechat
    ```

3. **Install the dependencies:**

**Using [bundler](https://www.ruby-lang.org/):**

```sh
❯ bundle install
```
**Using [npm](https://www.npmjs.com/):**

```sh
❯ npm install
```
**Using [gradle](https://gradle.org/):**

```sh
❯ gradle build
```

### 💻 Usage

Run the project with:

**Using [bundler](https://www.ruby-lang.org/):**

```sh
bundle exec ruby {entrypoint}
```
**Using [npm](https://www.npmjs.com/):**

```sh
npm start
```
**Using [gradle](https://gradle.org/):**

```sh
gradle run
```

### 🧪 Testing

Bluechat uses the **Jest** test framework. Run the test suite with:

**Using [bundler](https://www.ruby-lang.org/):**

```sh
bundle exec rspec
```
**Using [npm](https://www.npmjs.com/):**

```sh
npm test
```
**Using [gradle](https://gradle.org/):**

```sh
gradle test
```

---

## ✨ Acknowledgments

- Credit `contributors`, `inspiration`, `references`, etc.

<div align="left"><a href="#top">⬆ Return</a></div>

---
