import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  ScrollView,
  Switch,
  Alert,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { colors, typography, spacing, commonStyles } from "../theme/theme";
import { useAuth } from "../context/AuthContext";
import { useAppDispatch } from "../store/hook";
import { addEvent } from "../store/slices/eventsSlice";
const generateId = () => `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;

export default function AddEventScreen() {
  const navigation = useNavigation<any>();
  const { user } = useAuth();
  const dispatch = useAppDispatch();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [isFree, setIsFree] = useState(true);

  const handleSave = () => {
    if (!title.trim() || !latitude.trim() || !longitude.trim() || !startDate.trim() || !endDate.trim()) {
      Alert.alert("Campos requeridos", "Por favor completa título, coordenadas y fechas.");
      return;
    }

    const lat = parseFloat(latitude);
    const lng = parseFloat(longitude);

    if (isNaN(lat) || isNaN(lng)) {
      Alert.alert("Coordenadas inválidas", "Ingresa valores numéricos válidos para latitud y longitud.");
      return;
    }

    dispatch(
      addEvent({
        id: generateId(),
        title: title.trim(),
        description: description.trim(),
        latitude: lat,
        longitude: lng,
        start_date: startDate.trim(),
        end_date: endDate.trim(),
        is_free: isFree,
        status: "pending",
        created_by: user!.id,
        created_at: new Date().toISOString(),
      })
    );

    Alert.alert("Evento creado", "Ahora puedes visualizar tu evento en el mapa.", [
      { text: "OK", onPress: () => navigation.goBack() },
    ]);
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.background} />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} activeOpacity={0.7}>
          <Text style={styles.backBtn}>← Volver</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Nuevo Evento</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.form}>
        <Text style={styles.label}>Título *</Text>
        <TextInput
          style={commonStyles.inputField}
          placeholder="Nombre del evento"
          placeholderTextColor={colors.textSecondary}
          value={title}
          onChangeText={setTitle}
        />

        <Text style={styles.label}>Descripción</Text>
        <TextInput
          style={[commonStyles.inputField, styles.textArea]}
          placeholder="Describe el evento"
          placeholderTextColor={colors.textSecondary}
          value={description}
          onChangeText={setDescription}
          multiline
          numberOfLines={3}
        />

        <Text style={styles.label}>Latitud *</Text>
        <TextInput
          style={commonStyles.inputField}
          placeholder="Ej: 15.5049"
          placeholderTextColor={colors.textSecondary}
          value={latitude}
          onChangeText={setLatitude}
          keyboardType="numeric"
        />

        <Text style={styles.label}>Longitud *</Text>
        <TextInput
          style={commonStyles.inputField}
          placeholder="Ej: -88.0254"
          placeholderTextColor={colors.textSecondary}
          value={longitude}
          onChangeText={setLongitude}
          keyboardType="numeric"
        />

        <Text style={styles.label}>Fecha inicio * (YYYY-MM-DD)</Text>
        <TextInput
          style={commonStyles.inputField}
          placeholder="Ej: 2026-04-01"
          placeholderTextColor={colors.textSecondary}
          value={startDate}
          onChangeText={setStartDate}
        />

        <Text style={styles.label}>Fecha fin * (YYYY-MM-DD)</Text>
        <TextInput
          style={commonStyles.inputField}
          placeholder="Ej: 2026-04-02"
          placeholderTextColor={colors.textSecondary}
          value={endDate}
          onChangeText={setEndDate}
        />

        <View style={styles.switchRow}>
          <Text style={styles.label}>Evento gratuito</Text>
          <Switch
            value={isFree}
            onValueChange={setIsFree}
            trackColor={{ false: colors.border, true: colors.primary }}
            thumbColor={colors.textPrimary}
          />
        </View>

        <TouchableOpacity
          style={[commonStyles.btnPrimary, styles.saveBtn]}
          onPress={handleSave}
          activeOpacity={0.8}
        >
          <Text style={commonStyles.btnPrimaryText}>Guardar evento</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    paddingHorizontal: spacing.md,
    paddingTop: spacing.xl + spacing.md,
    paddingBottom: spacing.sm,
  },
  backBtn: {
    color: colors.primary,
    fontSize: typography.md,
    marginBottom: spacing.sm,
  },
  title: {
    fontSize: typography.xl,
    fontWeight: "800",
    color: colors.textPrimary,
  },
  form: {
    paddingHorizontal: spacing.md,
    paddingTop: spacing.md,
    paddingBottom: spacing.xl * 2,
  },
  label: {
    fontSize: typography.sm,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  textArea: {
    height: 90,
    textAlignVertical: "top",
  },
  switchRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: spacing.lg,
  },
  saveBtn: {
    marginTop: spacing.sm,
  },
});
