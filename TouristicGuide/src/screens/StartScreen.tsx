import { View, Text, TouchableOpacity, StyleSheet, StatusBar } from "react-native";
import { colors, typography, spacing, radius, commonStyles } from "../theme/theme";

export default function StartScreen({ navigation }: any) {
  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.background} />

      <View style={styles.content}>
        {/* Ícono de la app */}
        <View style={styles.iconWrapper}>
          <View style={styles.iconCircle}>
            <Text style={styles.iconEmoji}>🗺️</Text>
          </View>
        </View>

        {/* Título */}
        <Text style={styles.title}>
          Descubre tu{"\n"}
          <Text style={styles.titleAccent}>destino</Text>
        </Text>

        {/* Subtítulo */}
        <Text style={styles.subtitle}>
          Explora los mejores lugares turísticos cerca de ti
        </Text>
      </View>

      {/* Botones */}
      <View style={styles.buttonsWrapper}>
        <TouchableOpacity
          style={commonStyles.btnPrimary}
          onPress={() => navigation.navigate("ExploreTabs")}
          activeOpacity={0.8}
        >
          <Text style={commonStyles.btnPrimaryText}>Comenzar exploración</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[commonStyles.btnSecondary, { marginTop: spacing.md }]}
          onPress={() => navigation.navigate("Login")}
          activeOpacity={0.8}
        >
          <Text style={commonStyles.btnSecondaryText}>Iniciar sesión</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xl + spacing.md,
    justifyContent: "space-between",
  },
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  iconWrapper: {
    marginBottom: spacing.xl,
  },
  iconCircle: {
    width: 100,
    height: 100,
    borderRadius: radius.full,
    backgroundColor: colors.card,
    borderWidth: 2,
    borderColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  iconEmoji: {
    fontSize: 44,
  },
  title: {
    fontSize: typography.xxl + 4,
    fontWeight: "800",
    color: colors.textPrimary,
    textAlign: "center",
    lineHeight: 44,
  },
  titleAccent: {
    color: colors.primary,
  },
  subtitle: {
    fontSize: typography.md,
    color: colors.textSecondary,
    textAlign: "center",
    marginTop: spacing.sm,
    paddingHorizontal: spacing.lg,
  },
  buttonsWrapper: {
    width: "100%",
  },
});
