# Weather App

A beautiful React Native weather application that allows users to search for weather information for any location.

## Features

- 🌤️ Search weather by city name
- 📱 Beautiful gradient UI design
- 📊 Detailed weather information (temperature, humidity, wind speed, etc.)
- 🔄 Recent searches functionality
- 📍 Location-based weather data
- 🌍 Support for any location worldwide

## Screenshots

The app features a modern gradient design with:
- Search functionality
- Current weather display
- Detailed weather metrics
- Recent searches
- Responsive design

## Prerequisites

Before running this app, make sure you have the following installed:

- Node.js (v18 or higher)
- React Native CLI
- Android Studio (for Android development)
- Android SDK
- A physical Android device or emulator

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd ChatbotWeather
```

2. Install dependencies:
```bash
npm install
```

3. For Android development, make sure you have:
   - Android Studio installed
   - Android SDK configured
   - ANDROID_HOME environment variable set
   - A physical Android device connected via USB with USB debugging enabled

## Running the App

### For Android (Physical Device)

1. Connect your Android device via USB
2. Enable USB debugging on your device
3. Make sure your device is detected:
```bash
adb devices
```

4. Start the Metro bundler:
```bash
npm start
```

5. In a new terminal, run the Android app:
```bash
npm run android
```

### For Android (Emulator)

1. Start your Android emulator
2. Run the app:
```bash
npm run android
```

## API Configuration

This app currently uses a mock weather service for demonstration purposes. To use real weather data:

1. Sign up for a free API key at [WeatherAPI.com](https://www.weatherapi.com/)
2. Replace `YOUR_API_KEY` in `src/services/weatherService.ts` with your actual API key
3. Uncomment the real API calls and comment out the mock service

## Project Structure

```
src/
├── components/
│   └── WeatherScreen.tsx    # Main weather screen component
├── services/
│   └── weatherService.ts    # Weather API service
└── types/
    └── weather.ts          # TypeScript type definitions
```

## Dependencies

- `react-native-linear-gradient`: For beautiful gradient backgrounds
- `react-native-vector-icons`: For weather icons
- `axios`: For HTTP requests
- `@react-native-async-storage/async-storage`: For storing recent searches
- `react-native-safe-area-context`: For safe area handling

## Troubleshooting

### Common Issues

1. **Metro bundler issues**: Clear cache with `npx react-native start --reset-cache`
2. **Android build issues**: Clean and rebuild with `cd android && ./gradlew clean`
3. **Device not detected**: Check USB debugging and try different USB cables

### Android Device Setup

1. Enable Developer Options on your Android device
2. Enable USB Debugging
3. Connect device via USB
4. Allow USB debugging when prompted on device
5. Verify connection with `adb devices`

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

If you encounter any issues, please:
1. Check the troubleshooting section
2. Search existing issues
3. Create a new issue with detailed information
