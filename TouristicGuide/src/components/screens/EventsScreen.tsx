import { View, Text, FlatList, StyleSheet, StatusBar } from "react-native";
import { colors, typography, spacing, radius, commonStyles } from "../../theme/theme";
import { PLACES } from "../../data/places";
import { useAuth } from "../../context/AuthContext";

export default function EventsScreen() {
  const { user } = useAuth();
  const isGuest = !user;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.background} />

      <Text style={styles.title}>Lugares destacados</Text>
      {isGuest && (
        <Text style={styles.guestHint}>Solo lectura — inicia sesión para guardar</Text>
      )}

      <FlatList
        data={PLACES}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <View style={[commonStyles.card, styles.placeCard]}>
            <View style={styles.cardRow}>
              <View style={styles.emojiContainer}>
                <Text style={styles.emoji}>{item.emoji}</Text>
              </View>
              <View style={styles.cardInfo}>
                <Text style={styles.placeName}>{item.nombre}</Text>
                <Text style={styles.placeCategory}>{item.categoria}</Text>
                <Text style={styles.placeHorario}>{item.horario}</Text>
              </View>
            </View>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingHorizontal: spacing.md,
    paddingTop: spacing.xl + spacing.md,
  },
  title: {
    fontSize: typography.xl,
    fontWeight: "800",
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  guestHint: {
    fontSize: typography.sm,
    color: colors.textSecondary,
    marginBottom: spacing.md,
  },
  list: {
    paddingBottom: spacing.xl,
  },
  placeCard: {
    marginBottom: spacing.sm,
  },
  cardRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  emojiContainer: {
    width: 48,
    height: 48,
    borderRadius: radius.full,
    backgroundColor: colors.background,
    alignItems: "center",
    justifyContent: "center",
    marginRight: spacing.sm,
  },
  emoji: {
    fontSize: 24,
  },
  cardInfo: {
    flex: 1,
  },
  placeName: {
    fontSize: typography.md,
    fontWeight: "700",
    color: colors.textPrimary,
  },
  placeCategory: {
    fontSize: typography.sm,
    color: colors.primary,
    marginTop: 2,
  },
  placeHorario: {
    fontSize: typography.xs,
    color: colors.textSecondary,
    marginTop: 2,
  },
});
