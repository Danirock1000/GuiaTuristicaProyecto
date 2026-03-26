import { View, Text, TouchableOpacity, StyleSheet, StatusBar, Alert, Animated } from "react-native";
import MapView, { Marker, Callout } from "react-native-maps";
import MapViewDirections from "react-native-maps-directions";
import { useNavigation } from "@react-navigation/native";
import { useEffect, useRef, useState } from "react";
import * as Location from "expo-location";
import Constants from "expo-constants";
import { colors, typography, spacing, radius, commonStyles } from "../theme/theme";
import { PLACES, SPS_REGION } from "../data/places";
import { useAuth } from "../context/AuthContext";
import { useAppSelector } from "../store/hook";
import { FlatList } from "react-native-gesture-handler";

const GOOGLE_MAPS_API_KEY = Constants.expoConfig?.extra?.googleMapsApiKey ?? "";

type SelectedPin = {
  latitude: number;
  longitude: number;
  title: string;
  subtitle?: string;
} | null;

export default function MapScreen() {
  const navigation = useNavigation<any>();
  const { user } = useAuth();
  const isGuest = !user;
  const events = useAppSelector((state) => state.events.events);

  const mapRef = useRef<MapView>(null);
  const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [destination, setDestination] = useState<SelectedPin>(null);
  const [selectedPin, setSelectedPin] = useState<SelectedPin>(null);
  const [routeInfo, setRouteInfo] = useState<{ distance: number; duration: number } | null>(null);
  const panelAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permiso denegado", "Necesitamos acceso a tu ubicación para mostrarte rutas.");
        return;
      }
      const loc = await Location.getCurrentPositionAsync({});
      setUserLocation({
        latitude: loc.coords.latitude,
        longitude: loc.coords.longitude,
      });
    })();
  }, []);

  const showPanel = (pin: SelectedPin) => {
    setSelectedPin(pin);
    Animated.spring(panelAnim, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  const hidePanel = () => {
    Animated.timing(panelAnim, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start(() => setSelectedPin(null));
  };

  const handleRoute = () => {
    if (isGuest) {
      Alert.alert(
        "Inicia sesión",
        "Para ver la ruta, tienes que iniciar sesión.",
        [
          { text: "Cancelar", style: "cancel" },
          { text: "Iniciar sesión", onPress: () => { hidePanel(); navigation.navigate("Login"); } }
        ]
      );
      return;
    }
    if (!userLocation || !selectedPin) {
      Alert.alert("Ubicación no disponible", "Espera a que se detecte tu ubicación.");
      return;
    }
    setDestination(selectedPin);
    hidePanel();
    mapRef.current?.animateToRegion({
      latitude: (userLocation.latitude + selectedPin.latitude) / 2,
      longitude: (userLocation.longitude + selectedPin.longitude) / 2,
      latitudeDelta: Math.abs(userLocation.latitude - selectedPin.latitude) * 2.5 + 0.02,
      longitudeDelta: Math.abs(userLocation.longitude - selectedPin.longitude) * 2.5 + 0.02,
    }, 800);
  };

  const panelTranslateY = panelAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [200, 0],
  });

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.background} />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>TuriMap</Text>
        {destination && (
          <TouchableOpacity style={styles.cancelBtn} onPress={() => { setDestination(null); setRouteInfo(null); }}>
            <Text style={styles.cancelText}>✕ Cancelar ruta</Text>
          </TouchableOpacity>
        )}
        {isGuest && !destination && (
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
      <View style={styles.mapContainer}>
        <MapView
          ref={mapRef}
          style={styles.map}
          initialRegion={SPS_REGION}
          showsUserLocation
          showsMyLocationButton
          onPress={() => selectedPin && hidePanel()}
        >
          {PLACES.map((place) => (
            <Marker
              key={`place-${place.id}`}
              coordinate={{ latitude: place.latitud, longitude: place.longitud }}
              title={place.nombre}
              description={place.categoria}
              onCalloutPress={() => navigation.navigate("PlaceDetail", { place })}
              onPress={() => showPanel({
                latitude: place.latitud,
                longitude: place.longitud,
                title: place.nombre,
                subtitle: place.categoria,
              })}
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

          {events.map((event) => (
            <Marker
              key={`event-${event.id}`}
              coordinate={{ latitude: event.latitude, longitude: event.longitude }}
              onPress={() => showPanel({
                latitude: event.latitude,
                longitude: event.longitude,
                title: event.title,
                subtitle: event.is_free ? "Gratuito" : "De pago",
              })}
            >
              <View style={styles.eventMarkerContainer}>
                <Text style={styles.markerEmoji}>🎉</Text>
              </View>
              <Callout tooltip>
                <View style={styles.callout}>
                  <Text style={styles.calloutTitle}>{event.title}</Text>
                  <Text style={styles.calloutCategory}>{event.is_free ? "Gratuito" : "De pago"}</Text>
                  <Text style={styles.calloutHint}>{event.start_date} → {event.end_date}</Text>
                </View>
              </Callout>
            </Marker>
          ))}

          {destination && userLocation && (
            <MapViewDirections
              origin={userLocation}
              destination={{ latitude: destination.latitude, longitude: destination.longitude }}
              apikey={GOOGLE_MAPS_API_KEY}
              strokeWidth={4}
              strokeColor={colors.primary}
              onReady={(result) => setRouteInfo({ distance: result.distance, duration: result.duration })}
              onError={() => Alert.alert("Error", "No se pudo trazar la ruta.")}
            />
          )}
        </MapView>
      </View>

      {/* Tab inferior */}
      <View style={styles.eventsContainer}>
        {routeInfo && destination && (
          <View style={styles.routeInfoCard}>
            <Text style={styles.routeInfoCardTitle} numberOfLines={1}>{destination.title}</Text>
            <View style={styles.routeInfoCardRow}>
              <Text style={styles.routeInfoCardText}>📍 {routeInfo.distance.toFixed(1)} km</Text>
              <Text style={styles.routeInfoCardDot}>·</Text>
              <Text style={styles.routeInfoCardText}>🕐 {Math.round(routeInfo.duration)} min</Text>
            </View>
          </View>
        )}
        <Text style={styles.infTitle}>Lugares disponibles</Text>
        <FlatList
          data={PLACES}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.list}
          showsHorizontalScrollIndicator={false}
          ItemSeparatorComponent={() => <View style={{ width: 8 }} />}
          horizontal={true}
          renderItem={({ item }) => (
            <View style={[commonStyles.card, styles.placeCard]}>
              <View style={styles.cardRow}>
                <View style={styles.emojiContainer}>
                  <Text style={styles.emoji}>{item.emoji}</Text>
                </View>
                <View style={styles.cardInfo}>
                  <Text style={styles.placeName} numberOfLines={1} ellipsizeMode="tail">{item.nombre}</Text>
                  <Text style={styles.placeCategory} numberOfLines={1} ellipsizeMode="tail">{item.categoria}</Text>
                  <Text style={styles.placeHorario} numberOfLines={1} ellipsizeMode="tail">{item.horario}</Text>
                  <Text style={styles.placeDesc} numberOfLines={2} ellipsizeMode="tail">{item.descripcion}</Text>
                </View>
              </View>
            </View>
          )}
        />
      </View>

      {/* Panel inferior al tocar pin */}
      {selectedPin && (
        <Animated.View style={[styles.panel, { transform: [{ translateY: panelTranslateY }] }]}>
          <View style={styles.panelHandle} />
          <Text style={styles.panelTitle}>{selectedPin.title}</Text>
          {selectedPin.subtitle && (
            <Text style={styles.panelSubtitle}>{selectedPin.subtitle}</Text>
          )}
          <TouchableOpacity style={styles.routeBtn} onPress={handleRoute} activeOpacity={0.8}>
            <Text style={styles.routeBtnText}>📍 Cómo llegar</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.closeBtn} onPress={hidePanel} activeOpacity={0.7}>
            <Text style={styles.closeBtnText}>Cerrar</Text>
          </TouchableOpacity>
        </Animated.View>
      )}

      {!isGuest && (
        <TouchableOpacity
          style={[styles.fab, selectedPin ? styles.fabHidden : null]}
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
  container: { flex: 1, backgroundColor: colors.background },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: spacing.md,
    paddingTop: spacing.xl + spacing.md,
    paddingBottom: spacing.sm,
    backgroundColor: colors.background,
  },
  headerTitle: { fontSize: typography.xl, fontWeight: "800", color: colors.primary },
  profileBtn: {
    width: 40, height: 40, borderRadius: radius.full,
    backgroundColor: colors.card, borderWidth: 1, borderColor: colors.border,
    alignItems: "center", justifyContent: "center",
  },
  profileIcon: { fontSize: 20 },
  cancelBtn: {
    paddingHorizontal: spacing.sm, paddingVertical: spacing.xs,
    backgroundColor: colors.card, borderRadius: radius.sm,
    borderWidth: 1, borderColor: colors.danger,
  },
  cancelText: { color: colors.danger, fontSize: typography.sm, fontWeight: "600" },
  map: { width: "100%", height: "100%" },
  mapContainer: { flex: 1 },
  eventsContainer: { height: 200, backgroundColor: colors.card, borderTopWidth: 1, borderTopColor: colors.border },
  routeInfoCard: {
    marginHorizontal: spacing.md, marginTop: spacing.sm,
    backgroundColor: colors.primary + "18", borderRadius: radius.sm,
    borderWidth: 1, borderColor: colors.primary + "40",
    paddingHorizontal: spacing.md, paddingVertical: spacing.xs,
    flexDirection: "row", alignItems: "center", justifyContent: "space-between",
  },
  routeInfoCardTitle: { fontSize: typography.sm, fontWeight: "700", color: colors.textPrimary, flex: 1, marginRight: spacing.sm },
  routeInfoCardRow: { flexDirection: "row", alignItems: "center", gap: 4 },
  routeInfoCardText: { fontSize: typography.xs, color: colors.primary, fontWeight: "600" },
  routeInfoCardDot: { color: colors.textSecondary, fontSize: typography.xs },
  markerContainer: {
    backgroundColor: colors.card, borderRadius: radius.full,
    borderWidth: 2, borderColor: colors.primary, width: 40, height: 40,
    alignItems: "center", justifyContent: "center",
  },
  eventMarkerContainer: {
    backgroundColor: colors.card, borderRadius: radius.full,
    borderWidth: 2, borderColor: colors.gold, width: 40, height: 40,
    alignItems: "center", justifyContent: "center",
  },
  markerEmoji: { fontSize: 20 },
  callout: {
    backgroundColor: colors.card, borderRadius: radius.sm,
    borderWidth: 1, borderColor: colors.border, padding: spacing.sm, minWidth: 180,
  },
  calloutTitle: { fontSize: typography.md, fontWeight: "700", color: colors.textPrimary },
  calloutCategory: { fontSize: typography.sm, color: colors.primary, marginTop: 2 },
  calloutHint: { fontSize: typography.xs, color: colors.textSecondary, marginTop: spacing.xs },
  panel: {
    position: "absolute", bottom: 0, left: 0, right: 0,
    backgroundColor: colors.card, borderTopLeftRadius: radius.lg, borderTopRightRadius: radius.lg,
    padding: spacing.lg, paddingBottom: spacing.xl,
    borderTopWidth: 1, borderColor: colors.border,
    elevation: 8, shadowColor: "#000", shadowOffset: { width: 0, height: -3 }, shadowOpacity: 0.2, shadowRadius: 6,
  },
  panelHandle: { width: 40, height: 4, backgroundColor: colors.border, borderRadius: 2, alignSelf: "center", marginBottom: spacing.md },
  panelTitle: { fontSize: typography.lg, fontWeight: "700", color: colors.textPrimary, marginBottom: spacing.xs },
  panelSubtitle: { fontSize: typography.sm, color: colors.primary, marginBottom: spacing.md },
  routeBtn: { backgroundColor: colors.primary, borderRadius: radius.md, paddingVertical: spacing.sm, alignItems: "center", marginBottom: spacing.sm },
  routeBtnText: { color: colors.background, fontSize: typography.md, fontWeight: "700" },
  closeBtn: { alignItems: "center", paddingVertical: spacing.xs },
  closeBtnText: { color: colors.textSecondary, fontSize: typography.sm },
  fab: {
    position: "absolute", bottom: spacing.xl, right: spacing.md,
    width: 56, height: 56, borderRadius: radius.full,
    backgroundColor: colors.primary, alignItems: "center", justifyContent: "center",
    elevation: 5, shadowColor: colors.primary, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.4, shadowRadius: 6,
  },
  fabHidden: { display: "none" },
  fabIcon: { fontSize: 28, fontWeight: "700", color: colors.background, lineHeight: 32 },
  list: { paddingHorizontal: spacing.md, paddingVertical: spacing.xs, alignItems: "center" },
  placeCard: { width: 220, height: 120, paddingHorizontal: spacing.md, paddingVertical: spacing.sm, justifyContent: "center", borderWidth: 1, borderColor: colors.primary + "40" },
  cardRow: { flexDirection: "row", alignItems: "center" },
  emojiContainer: { width: 40, height: 40, borderRadius: radius.full, backgroundColor: colors.background, alignItems: "center", justifyContent: "center", marginRight: spacing.sm },
  emoji: { fontSize: 20 },
  cardInfo: { flex: 1 },
  placeName: { fontSize: typography.sm, fontWeight: "700", color: colors.textPrimary },
  placeCategory: { fontSize: typography.xs, color: colors.primary, marginTop: 2 },
  placeHorario: { fontSize: typography.xs, color: colors.textSecondary, marginTop: 2 },
  placeDesc: { fontSize: typography.xs, color: colors.textSecondary, marginTop: 4, opacity: 0.7 },
  infTitle: { color: colors.primary, fontSize: typography.md, fontWeight: "bold", textAlign: "center", paddingTop: spacing.sm },
});
