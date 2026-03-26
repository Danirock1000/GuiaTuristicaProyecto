import { createNativeStackNavigator } from "@react-navigation/native-stack";
import StartScreen from "../screens/StartScreen";
import TabsNavigator from "./TabsNavigator";
import PlaceDetailScreen from "../screens/PlaceDetailScreen";
import LoginScreen from "../screens/LoginScreen";
import RegisterScreen from "../screens/RegisterScreen";
import type { Place } from "../data/places";

export type AuthStackParamList = {
  Start: undefined;
  ExploreTabs: undefined;
  PlaceDetail: { place: Place };
  Login: undefined;
  Register: undefined;
};

const Stack = createNativeStackNavigator<AuthStackParamList>();

export default function AuthStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Start" component={StartScreen} />
      <Stack.Screen name="ExploreTabs" component={TabsNavigator} />
      <Stack.Screen name="PlaceDetail" component={PlaceDetailScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen}/>
    </Stack.Navigator>
  );
}
