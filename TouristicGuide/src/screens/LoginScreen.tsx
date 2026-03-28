import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  StyleSheet,
  StatusBar,
  ActivityIndicator,
  Dimensions,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
} from "react-native";
import { useState } from "react";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "../context/AuthContext";
import { colors, typography, spacing, radius } from "../theme/theme";
import AppInput from "../components/AppInput";

const { width } = Dimensions.get("window");

export default function LoginScreen({ navigation }: any) {
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading]   = useState(false);
  const [errors, setErrors]     = useState<{ email?: string; password?: string }>({});

  const { login } = useAuth();

  const validate = () => {
    const e: typeof errors = {};
    if (!email.trim()) e.email = "El correo es obligatorio";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) e.email = "Correo inválido";
    if (!password.trim()) e.password = "La contraseña es obligatoria";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleLogin = async () => {
    if (!validate()) return;
    setLoading(true);
    try {
      await login(email, password);
    } catch (error: any) {
      let msg = "No se pudo iniciar sesión. Verifica tus credenciales.";
      if (error.message?.includes("Invalid login credentials"))
        msg = "Credenciales incorrectas. Verifica tu email y contraseña.";
      else if (error.message?.includes("Email not confirmed"))
        msg = "Por favor confirma tu email antes de iniciar sesión.";
      else if (error.message?.includes("Too many requests"))
        msg = "Demasiados intentos. Inténtalo más tarde.";
      else if (error.message?.includes("User not found"))
        msg = "Usuario no encontrado. Verifica tu email.";
      Alert.alert("Error", msg);
    }
    setLoading(false);
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 0}
    >
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />

      {/* Fondo gradiente */}
      <LinearGradient
        colors={["#0A1628", "#0D1F2D", "#081320"]}
        locations={[0, 0.5, 1]}
        style={StyleSheet.absoluteFill}
      />

      {/* Círculo decorativo */}
      <View style={styles.decorCircle} />

      {/* Botón atrás — fuera del scroll para que no se mueva */}
      <TouchableOpacity
        style={styles.backBtn}
        onPress={() => navigation.goBack()}
        activeOpacity={0.7}
      >
        <Ionicons name="arrow-back" size={22} color={colors.textPrimary} />
      </TouchableOpacity>

      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Ícono de la app */}
        <View style={styles.iconWrapper}>
          <LinearGradient
            colors={[colors.primary, colors.primaryDark]}
            style={styles.iconGradient}
          >
            <Text style={styles.iconEmoji}>🗺️</Text>
          </LinearGradient>
          <View style={styles.iconRing} />
        </View>

        {/* Título */}
        <Text style={styles.title}>Bienvenido de{"\n"}vuelta</Text>
        <Text style={styles.subtitle}>Inicia sesión para continuar explorando</Text>

        {/* Formulario */}
        <View style={styles.form}>
          <AppInput
            iconLeft="mail-outline"
            placeholder="correo@ejemplo.com"
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={(t) => { setEmail(t); setErrors((e) => ({ ...e, email: undefined })); }}
            error={errors.email}
          />

          <AppInput
            iconLeft="lock-closed-outline"
            placeholder="Tu contraseña"
            secureTextEntry
            value={password}
            onChangeText={(t) => { setPassword(t); setErrors((e) => ({ ...e, password: undefined })); }}
            error={errors.password}
          />

          <TouchableOpacity
            style={styles.btnPrimary}
            onPress={handleLogin}
            activeOpacity={0.85}
            disabled={loading}
          >
            <LinearGradient
              colors={loading
                ? [colors.primaryDark, colors.primaryDark]
                : [colors.primary, colors.primaryDark]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.btnGradient}
            >
              {loading
                ? <ActivityIndicator color={colors.textOnPrimary} />
                : <Text style={styles.btnPrimaryText}>Iniciar sesión</Text>
              }
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => navigation.navigate("Register")}
            activeOpacity={0.7}
            style={styles.registerLink}
          >
            <Text style={styles.registerText}>
              ¿No tienes cuenta?{" "}
              <Text style={styles.registerAccent}>Regístrate</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  decorCircle: {
    position: "absolute",
    width: width * 0.9,
    height: width * 0.9,
    borderRadius: width * 0.45,
    borderWidth: 1,
    borderColor: "rgba(0,229,192,0.06)",
    top: -width * 0.3,
    right: -width * 0.2,
  },
  backBtn: {
    position: "absolute",
    top: spacing.xxl + spacing.md,
    left: spacing.lg,
    zIndex: 10,
    width: 40,
    height: 40,
    borderRadius: radius.full,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: "center",
    justifyContent: "center",
  },
  scroll: {
    flexGrow: 1,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xxl + spacing.xxl,
    paddingBottom: spacing.xxl,
    justifyContent: "center",
  },
  iconWrapper: {
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacing.lg,
  },
  iconGradient: {
    width: 72,
    height: 72,
    borderRadius: radius.xl,
    alignItems: "center",
    justifyContent: "center",
  },
  iconEmoji: {
    fontSize: 34,
  },
  iconRing: {
    position: "absolute",
    width: 88,
    height: 88,
    borderRadius: radius.xl + 8,
    borderWidth: 1.5,
    borderColor: "rgba(0,229,192,0.25)",
  },
  title: {
    fontSize: typography.xxl + 4,
    fontWeight: typography.weight.extrabold,
    color: colors.textPrimary,
    textAlign: "center",
    lineHeight: 44,
    marginBottom: spacing.xs,
  },
  subtitle: {
    fontSize: typography.md,
    color: colors.textSecondary,
    textAlign: "center",
    marginBottom: spacing.xl,
  },
  form: {
    width: "100%",
  },
  btnPrimary: {
    borderRadius: radius.lg,
    overflow: "hidden",
    marginTop: spacing.sm,
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
    letterSpacing: 0.3,
  },
  registerLink: {
    alignItems: "center",
    marginTop: spacing.lg,
  },
  registerText: {
    color: colors.textSecondary,
    fontSize: typography.sm,
  },
  registerAccent: {
    color: colors.primary,
    fontWeight: typography.weight.semibold,
  },
});
