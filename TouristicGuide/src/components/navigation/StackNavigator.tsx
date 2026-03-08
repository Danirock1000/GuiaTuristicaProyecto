import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { ActivityIndicator, View } from "react-native";
import { useAuth } from "../../context/AuthContext";
import { colors } from "../../theme/theme";

import SplashScreen from "../screens/SplashScreen";
import LoginScreen from "../screens/LoginScreen";
import TabsNavigator from "./TabsNavigator";
import AdminDashboardScreen from "../screens/AdminDashboardScreen";

export type RootStackParamList = {
  Splash: undefined;
  Login: undefined;
  Home: undefined;
  AdminDashboard: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function StackNavigator() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.background, alignItems: "center", justifyContent: "center" }}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {user ? (
        // Usuario autenticado
        user.role === "admin" ? (
          <Stack.Screen name="AdminDashboard" component={AdminDashboardScreen} />
        ) : (
          <Stack.Screen name="Home" component={TabsNavigator} />
        )
      ) : (
        // Usuario no autenticado
        <>
          <Stack.Screen name="Splash" component={SplashScreen} />
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Home" component={TabsNavigator} />
          <Stack.Screen name="AdminDashboard" component={AdminDashboardScreen} />
        </>
      )}
    </Stack.Navigator>
  );
}
