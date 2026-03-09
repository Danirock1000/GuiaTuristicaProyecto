import { ActivityIndicator, View } from "react-native";
import { useAuth } from "../context/AuthContext";
import { colors } from "../theme/theme";
import AuthStack from "./AuthStack";
import UserStack from "./UserStack";
import AdminStack from "./AdminStack";

export default function RootNavigator() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.background, alignItems: "center", justifyContent: "center" }}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (!user) return <AuthStack />;
  if (user.role === "admin") return <AdminStack />;
  return <UserStack />;
}
