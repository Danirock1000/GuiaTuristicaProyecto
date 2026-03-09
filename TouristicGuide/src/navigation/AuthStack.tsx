import { createNativeStackNavigator } from "@react-navigation/native-stack";
import StartScreen from "../screens/StartScreen";
import TabsNavigator from "../components/navigation/TabsNavigator";
import PlaceDetailScreen from "../screens/PlaceDetailScreen";
import LoginScreen from "../components/screens/LoginScreen";
import type { Place } from "../data/places";

export type AuthStackParamList = {
  Start: undefined;
  ExploreTabs: undefined;
  PlaceDetail: { place: Place };
  Login: undefined;
};

const Stack = createNativeStackNavigator<AuthStackParamList>();

export default function AuthStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Start" component={StartScreen} />
      <Stack.Screen name="ExploreTabs" component={TabsNavigator} />
      <Stack.Screen name="PlaceDetail" component={PlaceDetailScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
    </Stack.Navigator>
  );
}
