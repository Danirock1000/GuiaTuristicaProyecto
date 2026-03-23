import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet, StatusBar, ActivityIndicator } from "react-native";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { colors, typography, spacing, commonStyles } from "../theme/theme";

export default function LoginScreen({ navigation }: any) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const validateEmail = (value: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  };

  const handleOnLogin = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert("Error", "Todos los campos son obligatorios");
      return;
    }

    if (!validateEmail(email)) {
      Alert.alert("Error", "Ingresa un correo electrónico válido");
      return;
    }

    setLoading(true);
    try {
      await login(email, password);
    } catch (error: any) {
      
      // Handle specific Supabase error messages
      let errorMessage = "No se pudo iniciar sesión. Verifica tus credenciales.";
      
      if (error.message) {
        if (error.message.includes("Invalid login credentials")) {
          errorMessage = "Credenciales incorrectas. Verifica tu email y contraseña.";
        } else if (error.message.includes("Email not confirmed")) {
          errorMessage = "Por favor confirma tu email antes de iniciar sesión.";
        } else if (error.message.includes("Too many requests")) {
          errorMessage = "Demasiados intentos. Inténtalo de nuevo más tarde.";
        } else if (error.message.includes("User not found")) {
          errorMessage = "Usuario no encontrado. Verifica tu email.";
        } else {
          errorMessage = `Error: ${error.message}`;
        }
      }
      
      Alert.alert("Error", errorMessage);
    }
    setLoading(false);
    // RootNavigator cambia de stack automáticamente al detectar el usuario
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.background} />

      <View style={styles.header}>
        <Text style={styles.title}>Bienvenido</Text>
        <Text style={styles.subtitle}>Inicia sesión para continuar</Text>
      </View>

      <View style={styles.form}>
        <Text style={styles.label}>Correo electrónico</Text>
        <TextInput
          style={commonStyles.inputField}
          placeholder="correo@ejemplo.com"
          placeholderTextColor={colors.textSecondary}
          onChangeText={setEmail}
          value={email}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <Text style={styles.label}>Contraseña</Text>
        <TextInput
          style={commonStyles.inputField}
          placeholder="Tu contraseña"
          placeholderTextColor={colors.textSecondary}
          onChangeText={setPassword}
          value={password}
          secureTextEntry
        />

        <TouchableOpacity
          style={[commonStyles.btnPrimary, { marginTop: spacing.sm }]}
          onPress={handleOnLogin}
          activeOpacity={0.8}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color={colors.background} />
          ) : (
            <Text style={commonStyles.btnPrimaryText}>Iniciar sesión</Text>
          )}
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
    justifyContent: "center",
  },
  header: {
    marginBottom: spacing.xl,
  },
  title: {
    fontSize: typography.xxl,
    fontWeight: "800",
    color: colors.textPrimary,
  },
  subtitle: {
    fontSize: typography.md,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  form: {
    width: "100%",
  },
  label: {
    fontSize: typography.sm,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
});
