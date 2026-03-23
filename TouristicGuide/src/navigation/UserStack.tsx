import { createNativeStackNavigator } from "@react-navigation/native-stack";
import TabsNavigator from "../components/navigation/TabsNavigator";
import AddEventScreen from "../screens/AddEventScreen";

export type UserStackParamList = {
  Tabs: undefined;
  AddEvent: undefined;
};

const Stack = createNativeStackNavigator<UserStackParamList>();

export default function UserStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Tabs" component={TabsNavigator} />
      <Stack.Screen name="AddEvent" component={AddEventScreen} />
    </Stack.Navigator>
  );
}
