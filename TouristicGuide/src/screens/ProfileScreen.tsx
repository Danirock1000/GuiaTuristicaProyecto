import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  ScrollView,
  Image,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { colors, typography, spacing, radius } from "../theme/theme";
import { useAuth } from "../context/AuthContext";

export default function ProfileScreen() {
  const navigation = useNavigation<any>();
  const { user, logout } = useAuth();
  const isGuest = !user;

  // ── GUEST VIEW ────────────────────────────────────────────────────────────
  if (isGuest) {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
        <LinearGradient
          colors={["#0A1628", "#0D1F2D", "#081320"]}
          locations={[0, 0.5, 1]}
          style={StyleSheet.absoluteFill}
        />
        <View style={styles.guestWrapper}>
          <View style={styles.guestIconCircle}>
            <Ionicons name="person-outline" size={48} color={colors.textMuted} />
          </View>
          <Text style={styles.guestTitle}>Sin sesión activa</Text>
          <Text style={styles.guestSubtitle}>
            Inicia sesión para ver tu perfil, historial y más.
          </Text>
          <TouchableOpacity
            style={styles.btnPrimary}
            onPress={() => navigation.navigate("Login")}
            activeOpacity={0.85}
          >
            <LinearGradient
              colors={[colors.primary, colors.primaryDark]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.btnGradient}
            >
              <Text style={styles.btnPrimaryText}>Iniciar sesión</Text>
            </LinearGradient>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => navigation.navigate("Register")}
            activeOpacity={0.7}
            style={{ marginTop: spacing.md }}
          >
            <Text style={styles.guestLink}>
              ¿No tienes cuenta?{" "}
              <Text style={styles.guestLinkAccent}>Regístrate</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  // ── USER VIEW ─────────────────────────────────────────────────────────────
  const initials = user.name
    ? user.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : "?";

  const joinedDate = user.createdAt
    ? new Date(user.createdAt).toLocaleDateString("es-HN", { month: "long", year: "numeric" })
    : null;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      <LinearGradient
        colors={["#0A1628", "#0D1F2D", "#081320"]}
        locations={[0, 0.5, 1]}
        style={StyleSheet.absoluteFill}
      />

      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        {/* Avatar + info principal */}
        <View style={styles.avatarSection}>
          {/* Wrapper que contiene avatar + ring juntos */}
          <View style={styles.avatarWrapper}>
            {user.avatarUrl ? (
              <Image source={{ uri: user.avatarUrl }} style={styles.avatar} />
            ) : (
              <LinearGradient
                colors={[colors.primary, colors.primaryDark]}
                style={styles.avatarPlaceholder}
              >
                <Text style={styles.avatarInitials}>{initials}</Text>
              </LinearGradient>
            )}
            <View style={styles.avatarRing} />
          </View>

          <Text style={styles.userName}>{user.name || "Usuario"}</Text>
          <Text style={styles.userEmail}>{user.email}</Text>

          {/* Badge de rol */}
          <View style={[styles.roleBadge, user.role === "admin" && styles.roleBadgeAdmin]}>
            <Ionicons
              name={user.role === "admin" ? "shield-checkmark-outline" : "person-outline"}
              size={12}
              color={user.role === "admin" ? colors.gold : colors.primary}
            />
            <Text style={[styles.roleBadgeText, user.role === "admin" && styles.roleBadgeTextAdmin]}>
              {user.role === "admin" ? "Administrador" : "Viajero"}
            </Text>
          </View>
        </View>

        {/* Tarjeta de info */}
        <View style={styles.infoCard}>
          <Text style={styles.sectionTitle}>Información de cuenta</Text>

          <View style={styles.infoRow}>
            <View style={styles.infoIconWrap}>
              <Ionicons name="mail-outline" size={16} color={colors.primary} />
            </View>
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Correo electrónico</Text>
              <Text style={styles.infoValue}>{user.email}</Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.infoRow}>
            <View style={styles.infoIconWrap}>
              <Ionicons name="person-outline" size={16} color={colors.primary} />
            </View>
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Nombre</Text>
              <Text style={styles.infoValue}>{user.name || "—"}</Text>
            </View>
          </View>

          {joinedDate && (
            <>
              <View style={styles.divider} />
              <View style={styles.infoRow}>
                <View style={styles.infoIconWrap}>
                  <Ionicons name="calendar-outline" size={16} color={colors.primary} />
                </View>
                <View style={styles.infoContent}>
                  <Text style={styles.infoLabel}>Miembro desde</Text>
                  <Text style={styles.infoValue}>{joinedDate}</Text>
                </View>
              </View>
            </>
          )}

          <View style={styles.divider} />

          <View style={styles.infoRow}>
            <View style={styles.infoIconWrap}>
              <Ionicons name="shield-outline" size={16} color={colors.primary} />
            </View>
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Estado de cuenta</Text>
              <View style={styles.statusRow}>
                <View style={[styles.statusDot, { backgroundColor: user.isActive ? colors.primary : colors.danger }]} />
                <Text style={styles.infoValue}>{user.isActive ? "Activa" : "Inactiva"}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Botón cerrar sesión */}
        <TouchableOpacity
          style={styles.btnLogout}
          onPress={logout}
          activeOpacity={0.8}
        >
          <Ionicons name="log-out-outline" size={18} color={colors.danger} />
          <Text style={styles.btnLogoutText}>Cerrar sesión</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scroll: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xxl + spacing.lg,
    paddingBottom: spacing.xxl,
  },

  // Guest
  guestWrapper: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xxl,
  },
  guestIconCircle: {
    width: 100,
    height: 100,
    borderRadius: radius.full,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacing.lg,
  },
  guestTitle: {
    fontSize: typography.xl,
    fontWeight: typography.weight.bold,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  guestSubtitle: {
    fontSize: typography.md,
    color: colors.textSecondary,
    textAlign: "center",
    marginBottom: spacing.xl,
    lineHeight: 22,
  },
  guestLink: {
    fontSize: typography.sm,
    color: colors.textSecondary,
  },
  guestLinkAccent: {
    color: colors.primary,
    fontWeight: typography.weight.semibold,
  },

  // Avatar
  avatarSection: {
    alignItems: "center",
    marginBottom: spacing.xl,
  },
  avatarWrapper: {
    width: 116,
    height: 116,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacing.lg,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: radius.full,
  },
  avatarPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: radius.full,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarInitials: {
    fontSize: typography.xxl,
    fontWeight: typography.weight.bold,
    color: colors.textOnPrimary,
  },
  avatarRing: {
    position: "absolute",
    width: 116,
    height: 116,
    borderRadius: radius.full,
    borderWidth: 1.5,
    borderColor: "rgba(0,229,192,0.3)",
  },
  userName: {
    fontSize: typography.xl,
    fontWeight: typography.weight.extrabold,
    color: colors.textPrimary,
    marginTop: spacing.lg,
    marginBottom: spacing.xs,
  },
  userEmail: {
    fontSize: typography.sm,
    color: colors.textSecondary,
    marginBottom: spacing.sm,
  },
  roleBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
    backgroundColor: colors.primaryMuted,
    borderRadius: radius.full,
    paddingVertical: spacing.xxs + 2,
    paddingHorizontal: spacing.md,
  },
  roleBadgeAdmin: {
    backgroundColor: colors.goldMuted,
  },
  roleBadgeText: {
    fontSize: typography.xs,
    fontWeight: typography.weight.semibold,
    color: colors.primary,
  },
  roleBadgeTextAdmin: {
    color: colors.gold,
  },

  // Info card
  infoCard: {
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    fontSize: typography.sm,
    fontWeight: typography.weight.semibold,
    color: colors.textMuted,
    textTransform: "uppercase",
    letterSpacing: 0.8,
    marginBottom: spacing.md,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    paddingVertical: spacing.sm,
  },
  infoIconWrap: {
    width: 36,
    height: 36,
    borderRadius: radius.sm,
    backgroundColor: colors.primaryMuted,
    alignItems: "center",
    justifyContent: "center",
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    fontSize: typography.xs,
    color: colors.textMuted,
    marginBottom: 2,
  },
  infoValue: {
    fontSize: typography.md,
    color: colors.textPrimary,
    fontWeight: typography.weight.medium,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
  },
  statusRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: radius.full,
  },

  // Botones
  btnPrimary: {
    width: "100%",
    borderRadius: radius.lg,
    overflow: "hidden",
  },
  btnGradient: {
    paddingVertical: spacing.md,
    alignItems: "center",
    justifyContent: "center",
  },
  btnPrimaryText: {
    color: colors.textOnPrimary,
    fontSize: typography.md,
    fontWeight: typography.weight.bold,
  },
  btnLogout: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.sm,
    borderWidth: 1.5,
    borderColor: colors.danger,
    borderRadius: radius.lg,
    paddingVertical: spacing.md,
    backgroundColor: "rgba(255,107,107,0.05)",
  },
  btnLogoutText: {
    color: colors.danger,
    fontSize: typography.md,
    fontWeight: typography.weight.semibold,
  },
});
