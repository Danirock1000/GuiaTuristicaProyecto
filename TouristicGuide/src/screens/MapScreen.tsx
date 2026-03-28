import { View, Text, TouchableOpacity, StyleSheet, StatusBar, Alert, Animated, TextInput, ScrollView, Keyboard } from "react-native";
import MapView, { Marker, Callout } from "react-native-maps";
import MapViewDirections from "react-native-maps-directions";
import { useNavigation } from "@react-navigation/native";
import React, { useEffect, useRef, useState, useCallback, memo } from "react";
import * as Location from "expo-location";
import Constants from "expo-constants";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { colors, typography, spacing, radius } from "../theme/theme";
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

const markerStyles = StyleSheet.create({
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
});

type PlaceMarkerProps = {
  place: typeof PLACES[0];
  onPress: (pin: NonNullable<SelectedPin>) => void;
  onNavigate: (place: typeof PLACES[0]) => void;
};

const PlaceMarker = memo(({ place, onPress, onNavigate }: PlaceMarkerProps) => {
  const [ready, setReady] = React.useState(false);
  return (
  <Marker
    key={`place-${place.id}`}
    coordinate={{ latitude: place.latitud, longitude: place.longitud }}
    title={place.nombre}
    description={place.categoria}
    onCalloutPress={() => onNavigate(place)}
    onPress={() => onPress({ latitude: place.latitud, longitude: place.longitud, title: place.nombre, subtitle: place.categoria })}
    tracksViewChanges={!ready}
  >
    <View style={markerStyles.markerContainer} onLayout={() => setReady(true)}>
      <Text style={markerStyles.markerEmoji}>{place.emoji}</Text>
    </View>
    <Callout tooltip>
      <View style={markerStyles.callout}>
        <Text style={markerStyles.calloutTitle}>{place.nombre}</Text>
        <Text style={markerStyles.calloutCategory}>{place.categoria}</Text>
        <Text style={markerStyles.calloutHint}>Toca para ver más →</Text>
      </View>
    </Callout>
  </Marker>
  );
});

type EventMarkerProps = {
  event: { id: string; latitude: number; longitude: number; title: string; is_free: boolean; start_date: string; end_date: string };
  onPress: (pin: NonNullable<SelectedPin>) => void;
};

const EventMarker = memo(({ event, onPress }: EventMarkerProps) => {
  const [ready, setReady] = React.useState(false);
  return (
  <Marker
    key={`event-${event.id}`}
    coordinate={{ latitude: event.latitude, longitude: event.longitude }}
    onPress={() => onPress({ latitude: event.latitude, longitude: event.longitude, title: event.title, subtitle: event.is_free ? "Gratuito" : "De pago" })}
    tracksViewChanges={!ready}
  >
    <View style={markerStyles.eventMarkerContainer} onLayout={() => setReady(true)}>
      <Text style={markerStyles.markerEmoji}>🎉</Text>
    </View>
    <Callout tooltip>
      <View style={markerStyles.callout}>
        <Text style={markerStyles.calloutTitle}>{event.title}</Text>
        <Text style={markerStyles.calloutCategory}>{event.is_free ? "Gratuito" : "De pago"}</Text>
        <Text style={markerStyles.calloutHint}>{event.start_date} → {event.end_date}</Text>
      </View>
    </Callout>
  </Marker>
  );
});

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

  const [searchQuery, setSearchQuery] = useState("");
  const [searchFocused, setSearchFocused] = useState(false);
  const searchRef = useRef<TextInput>(null);
  const [activeTab, setActiveTab] = useState<"lugares" | "eventos">("lugares");

  const searchResults = searchQuery.trim().length > 0
    ? [
        ...PLACES
          .filter((p) => p.nombre.toLowerCase().includes(searchQuery.toLowerCase()) || p.categoria.toLowerCase().includes(searchQuery.toLowerCase()))
          .map((p) => ({ id: `place-${p.id}`, label: p.nombre, sublabel: p.categoria, emoji: p.emoji, latitude: p.latitud, longitude: p.longitud })),
        ...events
          .filter((e) => e.title.toLowerCase().includes(searchQuery.toLowerCase()))
          .map((e) => ({ id: `event-${e.id}`, label: e.title, sublabel: e.is_free ? "Gratuito" : "De pago", emoji: "🎉", latitude: e.latitude, longitude: e.longitude })),
      ]
    : [];

  const handleSearchSelect = (item: typeof searchResults[0]) => {
    Keyboard.dismiss();
    setSearchQuery("");
    setSearchFocused(false);
    mapRef.current?.animateToRegion({
      latitude: item.latitude,
      longitude: item.longitude,
      latitudeDelta: 0.01,
      longitudeDelta: 0.01,
    }, 600);
    showPanel({
      latitude: item.latitude,
      longitude: item.longitude,
      title: item.label,
      subtitle: item.sublabel,
    });
  };

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

  const showPanel = useCallback((pin: SelectedPin) => {
    setSelectedPin(pin);
    Animated.spring(panelAnim, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  }, [panelAnim]);

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
        <View style={styles.headerLeft}>
          <Text style={styles.headerGreeting}>
            {isGuest ? "¡Hola, viajero!" : `¡Hola, ${user?.name?.split(" ")[0] || "explorador"}!`}
          </Text>
          <Text style={styles.headerSubtitle}>Explora San Pedro Sula</Text>
        </View>

        {/* Avatar / botón login */}
        {isGuest ? (
          <TouchableOpacity
            style={styles.avatarBtn}
            onPress={() => navigation.navigate("Login")}
            activeOpacity={0.8}
          >
            <Ionicons name="person-outline" size={20} color={colors.textSecondary} />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={styles.avatarBtn}
            onPress={() => {}}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={[colors.primary, colors.primaryDark]}
              style={styles.avatarGradient}
            >
              <Text style={styles.avatarInitials}>
                {user?.name
                  ? user.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
                  : "?"}
              </Text>
            </LinearGradient>
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
            <PlaceMarker
              key={`place-${place.id}`}
              place={place}
              onPress={showPanel}
              onNavigate={(p) => navigation.navigate("PlaceDetail", { place: p })}
            />
          ))}

          {events.map((event) => (
            <EventMarker
              key={`event-${event.id}`}
              event={event}
              onPress={showPanel}
            />
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
        {/* Buscador flotante */}
        <View style={styles.searchFloatingWrapper}>
          <View style={[styles.searchFloatingBar, searchFocused && styles.searchFloatingBarFocused]}>
            <Ionicons name="search-outline" size={16} color={searchFocused ? colors.primary : colors.textMuted} />
            <TextInput
              ref={searchRef}
              style={styles.searchInput}
              placeholder="Buscar lugares, eventos..."
              placeholderTextColor={colors.textMuted}
              value={searchQuery}
              onChangeText={setSearchQuery}
              onFocus={() => setSearchFocused(true)}
              onBlur={() => { if (!searchQuery.trim()) setSearchFocused(false); }}
              returnKeyType="search"
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => { setSearchQuery(""); setSearchFocused(false); Keyboard.dismiss(); }}>
                <Ionicons name="close-circle" size={18} color={colors.textMuted} />
              </TouchableOpacity>
            )}
          </View>

          {searchFocused && searchResults.length > 0 && (
            <ScrollView style={styles.searchDropdown} keyboardShouldPersistTaps="handled">
              {searchResults.map((item) => (
                <TouchableOpacity
                  key={item.id}
                  style={styles.searchResultItem}
                  onPress={() => handleSearchSelect(item)}
                  activeOpacity={0.7}
                >
                  <Text style={styles.searchResultEmoji}>{item.emoji}</Text>
                  <View style={styles.searchResultInfo}>
                    <Text style={styles.searchResultLabel}>{item.label}</Text>
                    <Text style={styles.searchResultSublabel}>{item.sublabel}</Text>
                  </View>
                  <Ionicons name="chevron-forward-outline" size={14} color={colors.textMuted} />
                </TouchableOpacity>
              ))}
            </ScrollView>
          )}

          {searchFocused && searchQuery.trim().length > 0 && searchResults.length === 0 && (
            <View style={styles.searchEmpty}>
              <Text style={styles.searchEmptyText}>Sin resultados para "{searchQuery}"</Text>
            </View>
          )}
        </View>
      </View>

      {/* Card inferior — se oculta cuando el buscador está activo */}
      {!searchFocused && (
        <View style={styles.bottomCard}>

          {/* Ruta activa */}
          {routeInfo && destination && (
            <View style={styles.routeInfoCard}>
              <Ionicons name="navigate" size={14} color={colors.primary} />
              <Text style={styles.routeInfoCardTitle} numberOfLines={1}>{destination.title}</Text>
              <View style={styles.routeInfoCardRow}>
                <Text style={styles.routeInfoCardText}>{routeInfo.distance.toFixed(1)} km</Text>
                <Text style={styles.routeInfoCardDot}>·</Text>
                <Text style={styles.routeInfoCardText}>{Math.round(routeInfo.duration)} min</Text>
              </View>
              <TouchableOpacity onPress={() => { setDestination(null); setRouteInfo(null); }} style={styles.cancelRouteBtn}>
                <Ionicons name="close-circle" size={18} color={colors.accent} />
              </TouchableOpacity>
            </View>
          )}

          {/* Tabs */}
          <View style={styles.tabsRow}>
            <TouchableOpacity
              style={[styles.tabBtn, activeTab === "lugares" && styles.tabBtnActive]}
              onPress={() => setActiveTab("lugares")}
              activeOpacity={0.8}
            >
              <Ionicons name="location" size={13} color={activeTab === "lugares" ? colors.primary : colors.textMuted} />
              <Text style={[styles.tabBtnText, activeTab === "lugares" && styles.tabBtnTextActive]}>Lugares</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.tabBtn, activeTab === "eventos" && styles.tabBtnActive]}
              onPress={() => setActiveTab("eventos")}
              activeOpacity={0.8}
            >
              <Ionicons name="calendar" size={13} color={activeTab === "eventos" ? colors.primary : colors.textMuted} />
              <Text style={[styles.tabBtnText, activeTab === "eventos" && styles.tabBtnTextActive]}>Eventos</Text>
            </TouchableOpacity>
          </View>

          {/* Lista lugares */}
          {activeTab === "lugares" && (
            <FlatList
              data={PLACES}
              keyExtractor={(item) => item.id.toString()}
              contentContainerStyle={styles.list}
              showsHorizontalScrollIndicator={false}
              ItemSeparatorComponent={() => <View style={{ width: 10 }} />}
              horizontal
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.placeCard}
                  activeOpacity={0.85}
                  onPress={() => {
                    mapRef.current?.animateToRegion({ latitude: item.latitud, longitude: item.longitud, latitudeDelta: 0.01, longitudeDelta: 0.01 }, 600);
                    showPanel({ latitude: item.latitud, longitude: item.longitud, title: item.nombre, subtitle: item.categoria });
                  }}
                >
                  <View style={styles.placeCardEmoji}>
                    <Text style={styles.emoji}>{item.emoji}</Text>
                  </View>
                  <View style={styles.placeCardInfo}>
                    <Text style={styles.placeName} numberOfLines={1}>{item.nombre}</Text>
                    <View style={styles.placeCategoryRow}>
                      <Ionicons name="pricetag-outline" size={10} color={colors.primary} />
                      <Text style={styles.placeCategory} numberOfLines={1}>{item.categoria}</Text>
                    </View>
                    <View style={styles.placeCategoryRow}>
                      <Ionicons name="time-outline" size={10} color={colors.textMuted} />
                      <Text style={styles.placeHorario} numberOfLines={1}>{item.horario}</Text>
                    </View>
                  </View>
                  <View style={styles.placeCardArrow}>
                    <Ionicons name="chevron-forward" size={14} color={colors.primary} />
                  </View>
                </TouchableOpacity>
              )}
            />
          )}

          {/* Lista eventos */}
          {activeTab === "eventos" && (
            <FlatList
              data={events}
              keyExtractor={(item) => item.id}
              contentContainerStyle={styles.list}
              showsHorizontalScrollIndicator={false}
              ItemSeparatorComponent={() => <View style={{ width: 10 }} />}
              horizontal
              ListEmptyComponent={
                <View style={styles.emptyEvents}>
                  <Ionicons name="calendar-outline" size={24} color={colors.textMuted} />
                  <Text style={styles.emptyEventsText}>Sin eventos activos</Text>
                </View>
              }
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.eventCard}
                  activeOpacity={0.85}
                  onPress={() => {
                    mapRef.current?.animateToRegion({ latitude: item.latitude, longitude: item.longitude, latitudeDelta: 0.01, longitudeDelta: 0.01 }, 600);
                    showPanel({ latitude: item.latitude, longitude: item.longitude, title: item.title, subtitle: item.is_free ? "Gratuito" : "De pago" });
                  }}
                >
                  <View style={styles.eventCardHeader}>
                    <Text style={styles.eventEmoji}>🎉</Text>
                    <View style={[styles.eventBadge, item.is_free ? styles.eventBadgeFree : styles.eventBadgePaid]}>
                      <Text style={styles.eventBadgeText}>{item.is_free ? "Gratis" : "De pago"}</Text>
                    </View>
                  </View>
                  <Text style={styles.eventTitle} numberOfLines={2}>{item.title}</Text>
                  <View style={styles.placeCategoryRow}>
                    <Ionicons name="calendar-outline" size={10} color={colors.textMuted} />
                    <Text style={styles.placeHorario} numberOfLines={1}>{item.start_date}</Text>
                  </View>
                </TouchableOpacity>
              )}
            />
          )}

        </View>
      )}

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

    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xxl + spacing.sm,
    paddingBottom: spacing.sm,
    backgroundColor: colors.background,
  },
  headerLeft: {
    flex: 1,
  },
  headerGreeting: {
    fontSize: typography.sm,
    color: colors.textSecondary,
    fontWeight: typography.weight.medium,
  },
  headerSubtitle: {
    fontSize: typography.xl,
    fontWeight: typography.weight.extrabold,
    color: colors.textPrimary,
    marginTop: 2,
  },
  avatarBtn: {
    width: 44,
    height: 44,
    borderRadius: radius.full,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  avatarGradient: {
    width: 44,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarInitials: {
    fontSize: typography.sm,
    fontWeight: typography.weight.bold,
    color: colors.textOnPrimary,
  },
  searchFloatingWrapper: {
    position: "absolute",
    top: spacing.md,
    left: spacing.md,
    right: spacing.md,
    zIndex: 10,
  },
  searchFloatingBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.card,
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    gap: spacing.sm,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
  },
  searchFloatingBarFocused: {
    borderColor: colors.primary,
  },
  searchInput: {
    flex: 1,
    fontSize: typography.sm,
    color: colors.textPrimary,
    paddingVertical: 0,
  },
  searchDropdown: {
    backgroundColor: colors.card,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    marginTop: spacing.xs,
    maxHeight: 240,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
  },
  searchResultItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderSubtle,
    gap: spacing.sm,
  },
  searchResultEmoji: { fontSize: 20, width: 28, textAlign: "center" },
  searchResultInfo: { flex: 1 },
  searchResultLabel: { fontSize: typography.sm, fontWeight: typography.weight.semibold, color: colors.textPrimary },
  searchResultSublabel: { fontSize: typography.xs, color: colors.primary, marginTop: 1 },
  searchEmpty: {
    backgroundColor: colors.card,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    marginTop: spacing.xs,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    elevation: 4,
  },
  searchEmptyText: { fontSize: typography.sm, color: colors.textMuted, textAlign: "center" },
  map: { width: "100%", height: "100%" },
  mapContainer: { flex: 1 },
  bottomCard: {
    backgroundColor: colors.card,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: spacing.sm,
    height: 210,
  },
  routeInfoCard: {
    marginHorizontal: spacing.md,
    marginBottom: spacing.xs,
    backgroundColor: colors.primary + "18",
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: colors.primary + "40",
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
  },
  routeInfoCardTitle: { fontSize: typography.xs, fontWeight: "700", color: colors.textPrimary, flex: 1 },
  routeInfoCardRow: { flexDirection: "row", alignItems: "center", gap: 4 },
  routeInfoCardText: { fontSize: typography.xs, color: colors.primary, fontWeight: "600" },
  routeInfoCardDot: { color: colors.textSecondary, fontSize: typography.xs },
  cancelRouteBtn: { padding: 2 },
  tabsRow: {
    flexDirection: "row",
    paddingHorizontal: spacing.md,
    marginBottom: spacing.xs,
    gap: spacing.sm,
  },
  tabBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.background,
  },
  tabBtnActive: {
    borderColor: colors.primary,
    backgroundColor: colors.primary + "18",
  },
  tabBtnText: { fontSize: typography.xs, color: colors.textMuted, fontWeight: typography.weight.medium },
  tabBtnTextActive: { color: colors.primary, fontWeight: typography.weight.semibold },
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
  list: { paddingHorizontal: spacing.md, paddingBottom: spacing.xs, alignItems: "center" },
  // Tarjeta lugar
  placeCard: {
    width: 200,
    height: 100,
    backgroundColor: colors.cardElevated,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.primary + "30",
    padding: spacing.sm,
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },
  placeCardEmoji: {
    width: 42, height: 42, borderRadius: radius.full,
    backgroundColor: colors.primary + "18",
    alignItems: "center", justifyContent: "center",
  },
  placeCardInfo: { flex: 1 },
  placeCardArrow: { paddingLeft: spacing.xs },
  emoji: { fontSize: 22 },
  placeName: { fontSize: typography.sm, fontWeight: typography.weight.bold, color: colors.textPrimary, marginBottom: 3 },
  placeCategoryRow: { flexDirection: "row", alignItems: "center", gap: 3, marginTop: 2 },
  placeCategory: { fontSize: typography.xs, color: colors.primary },
  placeHorario: { fontSize: typography.xs, color: colors.textMuted },
  // Tarjeta evento
  eventCard: {
    width: 170,
    height: 110,
    backgroundColor: colors.cardElevated,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.gold + "40",
    padding: spacing.sm,
  },
  eventCardHeader: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: spacing.xs },
  eventEmoji: { fontSize: 20 },
  eventBadge: { borderRadius: radius.full, paddingHorizontal: spacing.xs, paddingVertical: 2 },
  eventBadgeFree: { backgroundColor: colors.primary + "25" },
  eventBadgePaid: { backgroundColor: colors.accent + "25" },
  eventBadgeText: { fontSize: 9, fontWeight: typography.weight.bold, color: colors.textPrimary },
  eventTitle: { fontSize: typography.xs, fontWeight: typography.weight.semibold, color: colors.textPrimary, marginBottom: spacing.xs },
  emptyEvents: { width: 200, alignItems: "center", justifyContent: "center", gap: spacing.xs, paddingVertical: spacing.md },
  emptyEventsText: { fontSize: typography.xs, color: colors.textMuted },
});
