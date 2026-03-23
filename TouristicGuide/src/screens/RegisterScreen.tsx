import {useState} from "react"
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  StatusBar
} from "react-native";
import { useAuth } from "../context/AuthContext";
import {commonStyles, typography, colors, spacing} from "../theme/theme"

export default function RegisterScreen({navigation}: any) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  const {register} = useAuth();

  const handleRegister = async () => {
    if (!email || !password || !name) {
      Alert.alert("Campos requeridos", "Ingrese todos los campos del formulario");
      return;
    }
    
    try {
      await register(email, password, name);
      Alert.alert("Registro exitoso", "Usuario registrado correctamente. Revisa tu email para confirmar la cuenta.");
      navigation.navigate("Login");
    } catch (error: any) {
      console.error("Registration error:", error);
      Alert.alert("Error de Registro", error?.message ?? "No se pudo crear el usuario");
    }
  };

  return (
  <View style={styles.container}>
    <StatusBar barStyle="light-content" backgroundColor={colors.background} />
      <View style={styles.header}>
        <Text style={styles.title}>Bienvenido</Text>
        <Text style={styles.subtitle}>Registrate</Text>
      </View>

      <View>
        <Text style={styles.label}>Nombre y Apellido</Text>
        <TextInput
        style={commonStyles.inputField}
        placeholder="John Smith"
        placeholderTextColor={colors.textSecondary}
        onChangeText={setName}
        value={name}
        keyboardType="default"
        />
      </View>
    {/* Email Input */}
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
    </View>
        {/* Password Input */}
    <View>
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
                    onPress={handleRegister}
                    activeOpacity={0.8}>
                      <Text style={commonStyles.btnPrimaryText}>Registrarse</Text>
          </TouchableOpacity>
    </View>
  </View>
  
)

};

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


