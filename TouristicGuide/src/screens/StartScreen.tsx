import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Dimensions,
  FlatList,
  Animated,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from "react-native";
import { useRef, useState } from "react";
import { LinearGradient } from "expo-linear-gradient";
import { colors, typography, spacing, radius } from "../theme/theme";

const { width, height } = Dimensions.get("window");

const SLIDES = [
  {
    key: "1",
    emoji: "🗺️",
    title: "Descubre\ntu ",
    titleAccent: "destino",
    subtitle: "Explora sitios turísticos, eventos y más,\ntodo desde un solo lugar.",
  },
  {
    key: "2",
    emoji: "📍",
    title: "Encuentra lo\nque está ",
    titleAccent: "cerca",
    subtitle: "Mapa interactivo con lugares y eventos en tiempo real. Filtra por categoría.",
  },
  {
    key: "3",
    emoji: "🧭",
    title: "Llega sin\n",
    titleAccent: "perderte",
    subtitle: "Traza rutas desde tu ubicación hasta cualquier destino con un solo toque.",
  },
];

export default function StartScreen({ navigation }: any) {
  const [activeIndex, setActiveIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);
  const scrollX = useRef(new Animated.Value(0)).current;

  const onScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { x: scrollX } } }],
    { useNativeDriver: false }
  );

  const onMomentumScrollEnd = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const index = Math.round(e.nativeEvent.contentOffset.x / width);
    setActiveIndex(index);
  };

  const handleNext = () => {
    if (activeIndex < SLIDES.length - 1) {
      flatListRef.current?.scrollToIndex({ index: activeIndex + 1, animated: true });
      setActiveIndex(activeIndex + 1);
    }
  };

  const isLastSlide = activeIndex === SLIDES.length - 1;

  const renderSlide = ({ item }: { item: typeof SLIDES[0] }) => (
    <View style={styles.slide}>
      {/* Ícono */}
      <View style={styles.iconWrapper}>
        <LinearGradient
          colors={[colors.primary, colors.primaryDark]}
          style={styles.iconGradient}
        >
          <Text style={styles.iconEmoji}>{item.emoji}</Text>
        </LinearGradient>
        <View style={styles.iconRing} />
      </View>

      {/* Marca */}
      <View style={styles.brandRow}>
        <Text style={styles.brandTuri}>Turi</Text>
        <Text style={styles.brandMap}>Map</Text>
      </View>

      {/* Título */}
      <Text style={styles.title}>
        {item.title}
        <Text style={styles.titleAccent}>{item.titleAccent}</Text>
      </Text>

      {/* Subtítulo */}
      <Text style={styles.subtitle}>{item.subtitle}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />

      {/* Fondo gradiente */}
      <LinearGradient
        colors={["#0A1628", "#0D1F2D", "#081320"]}
        locations={[0, 0.5, 1]}
        style={StyleSheet.absoluteFill}
      />

      {/* Círculos decorativos */}
      <View style={styles.decorCircleLarge} />
      <View style={styles.decorCircleSmall} />

      {/* Slides — solo el contenido hace scroll */}
      <Animated.FlatList
        ref={flatListRef}
        data={SLIDES}
        keyExtractor={(item) => item.key}
        renderItem={renderSlide}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={onScroll}
        onMomentumScrollEnd={onMomentumScrollEnd}
        scrollEventThrottle={16}
        style={styles.flatList}
      />

      {/* Footer fijo: dots + botones siempre visibles */}
      <View style={styles.footer}>

        {/* Dots animados */}
        <View style={styles.dotsRow}>
          {SLIDES.map((_, i) => {
            const inputRange = [(i - 1) * width, i * width, (i + 1) * width];
            const dotWidth = scrollX.interpolate({
              inputRange,
              outputRange: [8, 24, 8],
              extrapolate: "clamp",
            });
            const dotColor = scrollX.interpolate({
              inputRange,
              outputRange: [colors.border, colors.primary, colors.border],
              extrapolate: "clamp",
            });
            return (
              <Animated.View
                key={i}
                style={[styles.dot, { width: dotWidth, backgroundColor: dotColor }]}
              />
            );
          })}
        </View>

        {/* Botón principal — cambia de label pero siempre visible */}
        <TouchableOpacity
          style={styles.btnPrimary}
          onPress={() =>
            isLastSlide
              ? navigation.navigate("ExploreTabs")
              : handleNext()
          }
          activeOpacity={0.85}
        >
          <LinearGradient
            colors={[colors.primary, colors.primaryDark]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.btnPrimaryGradient}
          >
            <Text style={styles.btnPrimaryText}>
              {isLastSlide ? "Comenzar exploración" : "Siguiente →"}
            </Text>
          </LinearGradient>
        </TouchableOpacity>

        {/* Botón secundario — siempre visible */}
        <TouchableOpacity
          style={styles.btnSecondary}
          onPress={() => navigation.navigate("Login")}
          activeOpacity={0.8}
        >
          <Text style={styles.btnSecondaryText}>Iniciar sesión</Text>
        </TouchableOpacity>

        {/* Ghost link — siempre visible */}
        <TouchableOpacity
          onPress={() => navigation.navigate("Register")}
          activeOpacity={0.7}
        >
          <Text style={styles.btnGhostText}>
            ¿No tienes cuenta?{" "}
            <Text style={styles.btnGhostAccent}>Regístrate</Text>
          </Text>
        </TouchableOpacity>

      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  flatList: {
    flex: 1,
  },

  // Slide
  slide: {
    width,
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xxl,
  },

  // Decoración
  decorCircleLarge: {
    position: "absolute",
    width: width * 0.9,
    height: width * 0.9,
    borderRadius: width * 0.45,
    borderWidth: 1,
    borderColor: "rgba(0,229,192,0.07)",
    top: -width * 0.25,
    left: -width * 0.2,
  },
  decorCircleSmall: {
    position: "absolute",
    width: width * 0.5,
    height: width * 0.5,
    borderRadius: width * 0.25,
    borderWidth: 1,
    borderColor: "rgba(0,229,192,0.05)",
    bottom: height * 0.2,
    right: -width * 0.15,
  },

  // Ícono
  iconWrapper: {
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacing.lg,
  },
  iconGradient: {
    width: 90,
    height: 90,
    borderRadius: radius.xl,
    alignItems: "center",
    justifyContent: "center",
  },
  iconEmoji: {
    fontSize: 42,
  },
  iconRing: {
    position: "absolute",
    width: 108,
    height: 108,
    borderRadius: radius.xl + 8,
    borderWidth: 1.5,
    borderColor: "rgba(0,229,192,0.3)",
  },

  // Marca
  brandRow: {
    flexDirection: "row",
    marginBottom: spacing.lg,
  },
  brandTuri: {
    fontSize: typography.xl,
    fontWeight: typography.weight.bold,
    color: colors.textPrimary,
    letterSpacing: 0.5,
  },
  brandMap: {
    fontSize: typography.xl,
    fontWeight: typography.weight.bold,
    color: colors.primary,
    letterSpacing: 0.5,
  },

  // Título
  title: {
    fontSize: typography.xxl + 6,
    fontWeight: typography.weight.extrabold,
    color: colors.textPrimary,
    textAlign: "center",
    lineHeight: 48,
    marginBottom: spacing.md,
  },
  titleAccent: {
    color: colors.primary,
  },

  // Subtítulo
  subtitle: {
    fontSize: typography.md,
    color: colors.textSecondary,
    textAlign: "center",
    lineHeight: 22,
    paddingHorizontal: spacing.md,
  },

  // Footer fijo
  footer: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xxl,
    gap: spacing.md,
    alignItems: "center",
  },

  // Dots animados
  dotsRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: spacing.xs,
    marginBottom: spacing.lg,
  },
  dot: {
    height: 8,
    borderRadius: radius.full,
  },

  // Botones
  btnPrimary: {
    width: "100%",
    borderRadius: radius.lg,
    overflow: "hidden",
  },
  btnPrimaryGradient: {
    paddingVertical: spacing.md,
    alignItems: "center",
    justifyContent: "center",
  },
  btnPrimaryText: {
    color: colors.textOnPrimary,
    fontSize: typography.md,
    fontWeight: typography.weight.bold,
    letterSpacing: 0.3,
  },
  btnSecondary: {
    width: "100%",
    borderRadius: radius.lg,
    borderWidth: 1.5,
    borderColor: colors.primary,
    paddingVertical: spacing.md,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(0,229,192,0.05)",
  },
  btnSecondaryText: {
    color: colors.primary,
    fontSize: typography.md,
    fontWeight: typography.weight.semibold,
  },
  btnGhostText: {
    color: colors.textSecondary,
    fontSize: typography.sm,
  },
  btnGhostAccent: {
    color: colors.primary,
    fontWeight: typography.weight.semibold,
  },
});
