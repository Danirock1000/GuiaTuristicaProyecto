import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet, StatusBar, ActivityIndicator } from "react-native";
import { useState } from "react";
import { useAuth, findUser } from "../../context/AuthContext";
import { colors, typography, spacing, commonStyles } from "../../theme/theme";

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

    const found = findUser(email, password);

    if (!found) {
      Alert.alert("Error", "Credenciales incorrectas");
      return;
    }

    setLoading(true);
    await login({
      id: found.id,
      nombre: found.nombre,
      email: found.email,
      role: found.role,
    });
    setLoading(false);

    if (found.role === "admin") {
      navigation.reset({ index: 0, routes: [{ name: "AdminDashboard" }] });
    } else {
      navigation.reset({ index: 0, routes: [{ name: "Home" }] });
    }
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
