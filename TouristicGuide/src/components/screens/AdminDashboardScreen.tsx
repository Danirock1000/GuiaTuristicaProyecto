import { View, Text, TouchableOpacity, StyleSheet, StatusBar } from "react-native";
import { useAuth } from "../../context/AuthContext";
import { colors, typography, spacing, commonStyles } from "../../theme/theme";

export default function AdminDashboardScreen() {
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    // RootNavigator cambia a AuthStack automáticamente
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.background} />

      <Text style={styles.title}>Panel de Admin</Text>
      <Text style={styles.subtitle}>Bienvenido, {user?.nombre}</Text>

      <View style={[commonStyles.card, { marginTop: spacing.lg }]}>
        <Text style={styles.cardTitle}>Rol: Administrador</Text>
        <Text style={styles.cardText}>{user?.email}</Text>
      </View>

      <TouchableOpacity
        style={[commonStyles.btnSecondary, { marginTop: spacing.xl }]}
        onPress={handleLogout}
        activeOpacity={0.8}
      >
        <Text style={{ color: colors.danger, fontSize: typography.md, fontWeight: "600" }}>
          Cerrar sesión
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xl + spacing.xl,
  },
  title: {
    fontSize: typography.xxl,
    fontWeight: "800",
    color: colors.textPrimary,
  },
  subtitle: {
    fontSize: typography.lg,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  cardTitle: {
    fontSize: typography.lg,
    fontWeight: "700",
    color: colors.primary,
  },
  cardText: {
    fontSize: typography.md,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
});
