import { View, Text, TouchableOpacity, StyleSheet, StatusBar } from "react-native";
import MapView, { Marker, Callout } from "react-native-maps";
import { useNavigation } from "@react-navigation/native";
import { colors, typography, spacing, radius } from "../../theme/theme";
import { PLACES, SPS_REGION } from "../../data/places";
import { useAuth } from "../../context/AuthContext";
import { useAppSelector } from "../../store/hook";

export default function MapScreen() {
  const navigation = useNavigation<any>();
  const { user } = useAuth();
  const isGuest = !user;
  const events = useAppSelector((state) => state.events.events);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.background} />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>TuriMap</Text>
        {isGuest && (
          <TouchableOpacity
            style={styles.profileBtn}
            onPress={() => navigation.navigate("Login")}
            activeOpacity={0.7}
          >
            <Text style={styles.profileIcon}>👤</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Mapa */}
      <MapView style={styles.map} initialRegion={SPS_REGION}>
        {/* Lugares fijos */}
        {PLACES.map((place) => (
          <Marker
            key={`place-${place.id}`}
            coordinate={{ latitude: place.latitud, longitude: place.longitud }}
            title={place.nombre}
            description={place.categoria}
            onCalloutPress={() => navigation.navigate("PlaceDetail", { place })}
          >
            <View style={styles.markerContainer}>
              <Text style={styles.markerEmoji}>{place.emoji}</Text>
            </View>
            <Callout tooltip>
              <View style={styles.callout}>
                <Text style={styles.calloutTitle}>{place.nombre}</Text>
                <Text style={styles.calloutCategory}>{place.categoria}</Text>
                <Text style={styles.calloutHint}>Toca para ver más →</Text>
              </View>
            </Callout>
          </Marker>
        ))}

        {/* Eventos del store */}
        {events.map((event) => (
          <Marker
            key={`event-${event.id}`}
            coordinate={{ latitude: event.latitude, longitude: event.longitude }}
          >
            <View style={styles.eventMarkerContainer}>
              <Text style={styles.markerEmoji}>🎉</Text>
            </View>
            <Callout tooltip>
              <View style={styles.callout}>
                <Text style={styles.calloutTitle}>{event.title}</Text>
                <Text style={styles.calloutCategory}>
                  {event.is_free ? "Gratuito" : "De pago"}
                </Text>
                <Text style={styles.calloutHint}>
                  {event.start_date} → {event.end_date}
                </Text>
              </View>
            </Callout>
          </Marker>
        ))}
      </MapView>

      {/* FAB: solo para usuarios logueados */}
      {!isGuest && (
        <TouchableOpacity
          style={styles.fab}
          onPress={() => navigation.navigate("AddEvent")}
          activeOpacity={0.8}
        >
          <Text style={styles.fabIcon}>+</Text>
        </TouchableOpacity>
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
    paddingHorizontal: spacing.md,
    paddingTop: spacing.xl + spacing.md,
    paddingBottom: spacing.sm,
    backgroundColor: colors.background,
  },
  headerTitle: {
    fontSize: typography.xl,
    fontWeight: "800",
    color: colors.primary,
  },
  profileBtn: {
    width: 40,
    height: 40,
    borderRadius: radius.full,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: "center",
    justifyContent: "center",
  },
  profileIcon: {
    fontSize: 20,
  },
  map: {
    flex: 1,
  },
  markerContainer: {
    backgroundColor: colors.card,
    borderRadius: radius.full,
    borderWidth: 2,
    borderColor: colors.primary,
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  eventMarkerContainer: {
    backgroundColor: colors.card,
    borderRadius: radius.full,
    borderWidth: 2,
    borderColor: colors.gold,
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  markerEmoji: {
    fontSize: 20,
  },
  callout: {
    backgroundColor: colors.card,
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.sm,
    minWidth: 180,
  },
  calloutTitle: {
    fontSize: typography.md,
    fontWeight: "700",
    color: colors.textPrimary,
  },
  calloutCategory: {
    fontSize: typography.sm,
    color: colors.primary,
    marginTop: 2,
  },
  calloutHint: {
    fontSize: typography.xs,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  fab: {
    position: "absolute",
    bottom: spacing.xl,
    right: spacing.md,
    width: 56,
    height: 56,
    borderRadius: radius.full,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
    elevation: 5,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 6,
  },
  fabIcon: {
    fontSize: 28,
    fontWeight: "700",
    color: colors.background,
    lineHeight: 32,
  },
});
