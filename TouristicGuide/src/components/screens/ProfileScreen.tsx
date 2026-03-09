import { View, Text, TouchableOpacity, StyleSheet, StatusBar } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { colors, typography, spacing, radius, commonStyles } from "../../theme/theme";
import { useAuth } from "../../context/AuthContext";

export default function ProfileScreen() {
  const navigation = useNavigation<any>();
  const { user } = useAuth();
  const isGuest = !user;

  if (isGuest) {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor={colors.background} />

        <View style={styles.centered}>
          <View style={styles.iconCircle}>
            <Text style={styles.iconEmoji}>👤</Text>
          </View>

          <Text style={styles.guestTitle}>
            Si quieres ver tu perfil, inicia sesión
          </Text>

          <TouchableOpacity
            style={[commonStyles.btnPrimary, styles.loginBtn]}
            onPress={() => navigation.navigate("Login")}
            activeOpacity={0.8}
          >
            <Text style={commonStyles.btnPrimaryText}>Iniciar sesión</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  // Versión logueada (placeholder por ahora)
  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.background} />
      <Text style={styles.title}>Mi Perfil</Text>
      <Text style={styles.subtitle}>{user?.nombre}</Text>
      <Text style={styles.email}>{user?.email}</Text>
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
  centered: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingBottom: spacing.xl * 2,
  },
  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: radius.full,
    backgroundColor: colors.card,
    borderWidth: 2,
    borderColor: colors.border,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacing.lg,
  },
  iconEmoji: {
    fontSize: 36,
  },
  guestTitle: {
    fontSize: typography.lg,
    fontWeight: "600",
    color: colors.textSecondary,
    textAlign: "center",
    marginBottom: spacing.lg,
    paddingHorizontal: spacing.md,
  },
  loginBtn: {
    width: "100%",
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
  email: {
    fontSize: typography.md,
    color: colors.primary,
    marginTop: spacing.xs,
  },
});
