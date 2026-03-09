import { createNativeStackNavigator } from "@react-navigation/native-stack";
import AdminDashboardScreen from "../components/screens/AdminDashboardScreen";

export type AdminStackParamList = {
  AdminDashboard: undefined;
};

const Stack = createNativeStackNavigator<AdminStackParamList>();

export default function AdminStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="AdminDashboard" component={AdminDashboardScreen} />
    </Stack.Navigator>
  );
}
