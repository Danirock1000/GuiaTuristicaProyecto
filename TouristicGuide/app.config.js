import "dotenv/config";

export default {
  expo: {
    name: "TouristicGuide",
    slug: "TouristicGuide",
    version: "1.0.0",
    orientation: "portrait",
    plugins: ["@react-native-community/datetimepicker"],
    icon: "./assets/icon.png",
    userInterfaceStyle: "light",
    splash: {
      image: "./assets/splash-icon.png",
      resizeMode: "contain",
      backgroundColor: "#ffffff",
    },
    ios: {
      supportsTablet: true,
    },
    android: {
      adaptiveIcon: {
        backgroundColor: "#E6F4FE",
        foregroundImage: "./assets/android-icon-foreground.png",
        backgroundImage: "./assets/android-icon-background.png",
        monochromeImage: "./assets/android-icon-monochrome.png",
      },
      predictiveBackGestureEnabled: false,
    },
    web: {
      favicon: "./assets/favicon.png",
    },
    extra: {
      googleMapsApiKey: process.env.GOOGLE_MAPS_API_KEY,
    },
  },
};
