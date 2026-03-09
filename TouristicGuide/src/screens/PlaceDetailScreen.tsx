import { View, Text, TouchableOpacity, ScrollView, StyleSheet, StatusBar } from "react-native";
import { colors, typography, spacing, radius, commonStyles } from "../theme/theme";
import type { Place } from "../data/places";

export default function PlaceDetailScreen({ route, navigation }: any) {
  const place: Place = route.params.place;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.background} />

      {/* Header con botón de regreso */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} activeOpacity={0.7}>
          <Text style={styles.backBtn}>← Volver al mapa</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollContent}
        contentContainerStyle={styles.scrollInner}
        showsVerticalScrollIndicator={false}
      >
        {/* Foto placeholder */}
        <View style={styles.photoPlaceholder}>
          <Text style={styles.photoEmoji}>{place.emoji}</Text>
        </View>

        {/* Categoría */}
        <View style={styles.categoryBadge}>
          <Text style={styles.categoryText}>{place.categoria}</Text>
        </View>

        {/* Nombre */}
        <Text style={styles.title}>{place.nombre}</Text>

        {/* Descripción */}
        <Text style={styles.description}>{place.descripcion}</Text>

        {/* Horario */}
        <View style={[commonStyles.card, { marginTop: spacing.md }]}>
          <Text style={styles.infoLabel}>🕐 Horario</Text>
          <Text style={styles.infoValue}>{place.horario}</Text>
        </View>

        {/* Botones deshabilitados */}
        <View style={styles.actionsSection}>
          <TouchableOpacity
            style={[styles.disabledBtn]}
            disabled
            activeOpacity={1}
          >
            <Text style={styles.disabledBtnText}>🧭 Navegar hasta aquí</Text>
          </TouchableOpacity>
          <Text style={styles.loginHint}>Inicia sesión para navegar</Text>

          <TouchableOpacity
            style={[styles.disabledBtn, { marginTop: spacing.md }]}
            disabled
            activeOpacity={1}
          >
            <Text style={styles.disabledBtnText}>❤️ Guardar</Text>
          </TouchableOpacity>
          <Text style={styles.loginHint}>Inicia sesión para guardar</Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    paddingHorizontal: spacing.md,
    paddingTop: spacing.xl + spacing.md,
    paddingBottom: spacing.sm,
    backgroundColor: colors.background,
  },
  backBtn: {
    fontSize: typography.md,
    color: colors.primary,
    fontWeight: "600",
  },
  scrollContent: {
    flex: 1,
  },
  scrollInner: {
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.xl,
  },
  photoPlaceholder: {
    width: "100%",
    height: 200,
    backgroundColor: colors.card,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacing.md,
  },
  photoEmoji: {
    fontSize: 72,
  },
  categoryBadge: {
    alignSelf: "flex-start",
    backgroundColor: colors.primary + "20",
    borderRadius: radius.full,
    paddingHorizontal: spacing.sm + spacing.xs,
    paddingVertical: spacing.xs,
    marginBottom: spacing.sm,
  },
  categoryText: {
    fontSize: typography.sm,
    color: colors.primary,
    fontWeight: "600",
  },
  title: {
    fontSize: typography.xl,
    fontWeight: "800",
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  description: {
    fontSize: typography.md,
    color: colors.textSecondary,
    lineHeight: 22,
  },
  infoLabel: {
    fontSize: typography.md,
    fontWeight: "700",
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  infoValue: {
    fontSize: typography.sm,
    color: colors.textSecondary,
  },
  actionsSection: {
    marginTop: spacing.lg,
  },
  disabledBtn: {
    backgroundColor: colors.card,
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: colors.border,
    paddingVertical: spacing.sm + spacing.xs,
    alignItems: "center",
    justifyContent: "center",
    opacity: 0.5,
  },
  disabledBtnText: {
    fontSize: typography.md,
    color: colors.textSecondary,
    fontWeight: "600",
  },
  loginHint: {
    fontSize: typography.xs,
    color: colors.textSecondary,
    textAlign: "center",
    marginTop: spacing.xs,
  },
});
