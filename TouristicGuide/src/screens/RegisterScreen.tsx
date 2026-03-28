import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  StyleSheet,
  StatusBar,
  ActivityIndicator,
  Dimensions,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useState } from "react";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "../context/AuthContext";
import { colors, typography, spacing, radius } from "../theme/theme";
import AppInput from "../components/AppInput";

const { width } = Dimensions.get("window");

export default function RegisterScreen({ navigation }: any) {
  const [name, setName]         = useState("");
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm]   = useState("");
  const [loading, setLoading]   = useState(false);
  const [errors, setErrors]     = useState<{
    name?: string; email?: string; password?: string; confirm?: string;
  }>({});

  const { register } = useAuth();

  const validate = () => {
    const e: typeof errors = {};
    if (!name.trim()) e.name = "El nombre es obligatorio";
    if (!email.trim()) e.email = "El correo es obligatorio";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) e.email = "Correo inválido";
    if (!password.trim()) e.password = "La contraseña es obligatoria";
    else if (password.length < 6) e.password = "Mínimo 6 caracteres";
    if (!confirm.trim()) e.confirm = "Confirma tu contraseña";
    else if (confirm !== password) e.confirm = "Las contraseñas no coinciden";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleRegister = async () => {
    if (!validate()) return;
    setLoading(true);
    try {
      await register(email, password, name);
      Alert.alert(
        "¡Registro exitoso!",
        "Revisa tu email para confirmar la cuenta.",
        [{ text: "Ir a inicio de sesión", onPress: () => navigation.navigate("Login") }]
      );
    } catch (error: any) {
      Alert.alert("Error de registro", error?.message ?? "No se pudo crear el usuario");
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

      {/* Botón atrás */}
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
        {/* Ícono */}
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
        <Text style={styles.title}>Crea tu{"\n"}<Text style={styles.titleAccent}>cuenta</Text></Text>
        <Text style={styles.subtitle}>Únete y empieza a explorar San Pedro Sula</Text>

        {/* Formulario */}
        <View style={styles.form}>
          <AppInput
            iconLeft="person-outline"
            placeholder="Nombre completo"
            autoCapitalize="words"
            value={name}
            onChangeText={(t) => { setName(t); setErrors((e) => ({ ...e, name: undefined })); }}
            error={errors.name}
          />

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
            placeholder="Contraseña (mín. 6 caracteres)"
            secureTextEntry
            value={password}
            onChangeText={(t) => { setPassword(t); setErrors((e) => ({ ...e, password: undefined })); }}
            error={errors.password}
          />

          <AppInput
            iconLeft="shield-checkmark-outline"
            placeholder="Confirmar contraseña"
            secureTextEntry
            value={confirm}
            onChangeText={(t) => { setConfirm(t); setErrors((e) => ({ ...e, confirm: undefined })); }}
            error={errors.confirm}
          />

          {/* Botón principal */}
          <TouchableOpacity
            style={styles.btnPrimary}
            onPress={handleRegister}
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
              {loading ? (
                <ActivityIndicator color={colors.textOnPrimary} />
              ) : (
                <Text style={styles.btnPrimaryText}>Crear cuenta</Text>
              )}
            </LinearGradient>
          </TouchableOpacity>

          {/* Link a login */}
          <TouchableOpacity
            onPress={() => navigation.navigate("Login")}
            activeOpacity={0.7}
            style={styles.loginLink}
          >
            <Text style={styles.loginText}>
              ¿Ya tienes cuenta?{" "}
              <Text style={styles.loginAccent}>Inicia sesión</Text>
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
  titleAccent: {
    color: colors.primary,
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
  loginLink: {
    alignItems: "center",
    marginTop: spacing.lg,
  },
  loginText: {
    color: colors.textSecondary,
    fontSize: typography.sm,
  },
  loginAccent: {
    color: colors.primary,
    fontWeight: typography.weight.semibold,
  },
});
