import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useAuth } from "../context/AuthContext";
import { useAppSelector } from "../store/hook";
import { colors, typography, spacing, radius } from "../theme/theme";

const CATEGORY_ICONS: Record<string, keyof typeof Ionicons.glyphMap> = {
  gastronomia: "restaurant-outline",
  musica:      "musical-notes-outline",
  cultura:     "color-palette-outline",
  deportes:    "trophy-outline",
};

const CATEGORY_COLORS: Record<string, string> = {
  gastronomia: "#FF9F43",
  musica:      "#A29BFE",
  cultura:     "#FD79A8",
  deportes:    "#00E5C0",
};

export default function EventosScreen() {
  const navigation = useNavigation<any>();
  const { user } = useAuth();
  const isGuest = !user;
  const events = useAppSelector((state) => state.events.events);

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("es-HN", { day: "numeric", month: "short" });
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />

      <LinearGradient
        colors={["#0A1628", "#0D1F2D", "#081320"]}
        locations={[0, 0.5, 1]}
        style={StyleSheet.absoluteFill}
      />

      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Eventos</Text>
          <Text style={styles.headerSub}>Próximos en San Pedro Sula</Text>
        </View>

        {/* FAB nuevo evento — solo usuarios logueados */}
        {!isGuest && (
          <TouchableOpacity
            style={styles.fab}
            onPress={() => navigation.navigate("AddEvent")}
            activeOpacity={0.85}
          >
            <LinearGradient
              colors={[colors.primary, colors.primaryDark]}
              style={styles.fabGradient}
            >
              <Ionicons name="add" size={24} color={colors.textOnPrimary} />
            </LinearGradient>
          </TouchableOpacity>
        )}
      </View>

      {/* Lista de eventos */}
      <FlatList
        data={events}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyWrapper}>
            <Ionicons name="calendar-outline" size={48} color={colors.textMuted} />
            <Text style={styles.emptyText}>No hay eventos disponibles</Text>
          </View>
        }
        renderItem={({ item }) => {
          const catColor = CATEGORY_COLORS[item.category_id ?? ""] ?? colors.primary;
          const catIcon  = CATEGORY_ICONS[item.category_id ?? ""] ?? "calendar-outline";

          return (
            <View style={styles.card}>
              {/* Ícono categoría */}
              <View style={[styles.cardIcon, { backgroundColor: catColor + "22" }]}>
                <Ionicons name={catIcon} size={22} color={catColor} />
              </View>

              {/* Info */}
              <View style={styles.cardBody}>
                <Text style={styles.cardTitle} numberOfLines={1}>{item.title}</Text>
                <Text style={styles.cardDesc} numberOfLines={2}>{item.description}</Text>

                <View style={styles.cardMeta}>
                  {/* Fecha */}
                  <View style={styles.metaItem}>
                    <Ionicons name="calendar-outline" size={12} color={colors.textMuted} />
                    <Text style={styles.metaText}>
                      {formatDate(item.start_date)}
                      {item.start_date !== item.end_date ? ` — ${formatDate(item.end_date)}` : ""}
                    </Text>
                  </View>

                  {/* Entrada */}
                  <View style={[styles.badge, { backgroundColor: item.is_free ? colors.primaryMuted : colors.accentMuted }]}>
                    <Text style={[styles.badgeText, { color: item.is_free ? colors.primary : colors.accent }]}>
                      {item.is_free ? "Gratis" : "De pago"}
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          );
        }}
      />

      {/* Guest hint */}
      {isGuest && (
        <View style={styles.guestBanner}>
          <Ionicons name="information-circle-outline" size={16} color={colors.textSecondary} />
          <Text style={styles.guestText}>Inicia sesión para crear eventos</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xxl + spacing.lg,
    paddingBottom: spacing.md,
  },
  headerTitle: {
    fontSize: typography.xxl,
    fontWeight: typography.weight.extrabold,
    color: colors.textPrimary,
  },
  headerSub: {
    fontSize: typography.sm,
    color: colors.textSecondary,
    marginTop: 2,
  },
  fab: {
    borderRadius: radius.full,
    overflow: "hidden",
  },
  fabGradient: {
    width: 48,
    height: 48,
    borderRadius: radius.full,
    alignItems: "center",
    justifyContent: "center",
  },
  list: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xxl,
  },
  card: {
    flexDirection: "row",
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    marginBottom: spacing.sm,
    gap: spacing.md,
  },
  cardIcon: {
    width: 52,
    height: 52,
    borderRadius: radius.md,
    alignItems: "center",
    justifyContent: "center",
  },
  cardBody: {
    flex: 1,
  },
  cardTitle: {
    fontSize: typography.md,
    fontWeight: typography.weight.bold,
    color: colors.textPrimary,
    marginBottom: 4,
  },
  cardDesc: {
    fontSize: typography.xs,
    color: colors.textSecondary,
    lineHeight: 18,
    marginBottom: spacing.sm,
  },
  cardMeta: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  metaItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  metaText: {
    fontSize: typography.xs,
    color: colors.textMuted,
  },
  badge: {
    borderRadius: radius.full,
    paddingVertical: 2,
    paddingHorizontal: spacing.sm,
  },
  badgeText: {
    fontSize: typography.xs,
    fontWeight: typography.weight.semibold,
  },
  emptyWrapper: {
    alignItems: "center",
    justifyContent: "center",
    paddingTop: spacing.xxl * 2,
    gap: spacing.md,
  },
  emptyText: {
    fontSize: typography.md,
    color: colors.textMuted,
  },
  guestBanner: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.xs,
    paddingVertical: spacing.sm,
    backgroundColor: colors.card,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  guestText: {
    fontSize: typography.xs,
    color: colors.textSecondary,
  },
});
