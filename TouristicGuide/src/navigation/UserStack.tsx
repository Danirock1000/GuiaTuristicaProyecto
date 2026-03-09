import { createNativeStackNavigator } from "@react-navigation/native-stack";
import TabsNavigator from "../components/navigation/TabsNavigator";

export type UserStackParamList = {
  Tabs: undefined;
};

const Stack = createNativeStackNavigator<UserStackParamList>();

export default function UserStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Tabs" component={TabsNavigator} />
    </Stack.Navigator>
  );
}
