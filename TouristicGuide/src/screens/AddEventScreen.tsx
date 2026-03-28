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
  Platform,
} from "react-native";
import DateTimePicker, { type DateTimePickerEvent } from "@react-native-community/datetimepicker";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { colors, typography, spacing, commonStyles } from "../theme/theme";
import { useAuth } from "../context/AuthContext";
import { useAppDispatch } from "../store/hook";
import { addEvent } from "../store/slices/eventsSlice";
import { supabase } from "../services/supabaseClient";

const EVENTS_TABLE = "events";

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
  const [activeDateField, setActiveDateField] = useState<"start" | "end" | null>(null);
  const [isFree, setIsFree] = useState(true);
  const [saving, setSaving] = useState(false);

  const formatDateInput = (date: Date) => {
    const year = date.getFullYear();
    const month = `${date.getMonth() + 1}`.padStart(2, "0");
    const day = `${date.getDate()}`.padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const parseDateInput = (value: string) => {
    const [year, month, day] = value.split("-").map(Number);
    if (!year || !month || !day) {
      return null;
    }

    const parsedDate = new Date(year, month - 1, day);
    return Number.isNaN(parsedDate.getTime()) ? null : parsedDate;
  };

  const getPickerDate = () => {
    const currentValue = activeDateField === "end" ? endDate : startDate;
    return parseDateInput(currentValue) ?? new Date();
  };

  const openDatePicker = (field: "start" | "end") => {
    setActiveDateField(field);
  };

  const handleDateChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    if (event.type === "dismissed") {
      setActiveDateField(null);
      return;
    }

    if (!selectedDate || !activeDateField) {
      return;
    }

    const formattedDate = formatDateInput(selectedDate);

    if (activeDateField === "start") {
      setStartDate(formattedDate);
    } else {
      setEndDate(formattedDate);
    }

    if (Platform.OS !== "ios") {
      setActiveDateField(null);
    }
  };

  const toTimestamp = (dateText: string, endOfDay = false) => {
    const suffix = endOfDay ? "T23:59:59.000Z" : "T00:00:00.000Z";
    const parsedDate = new Date(`${dateText}${suffix}`);
    return Number.isNaN(parsedDate.getTime()) ? null : parsedDate.toISOString();
  };

  const handleSave = async () => {
    const normalizedTitle = title.trim();
    const normalizedDescription = description.trim();

    if (!normalizedTitle || !latitude.trim() || !longitude.trim() || !startDate.trim() || !endDate.trim()) {
      Alert.alert("Campos requeridos", "Por favor completa título, coordenadas y fechas.");
      return;
    }

    if (!normalizedDescription) {
      Alert.alert("Descripción requerida", "La descripción no puede estar vacía.");
      return;
    }

    if (normalizedDescription.length < 10) {
      Alert.alert("Descripción muy corta", "La descripción debe tener al menos 10 caracteres.");
      return;
    }

    if (!user?.id) {
      Alert.alert("Sesión requerida", "Debes iniciar sesión para crear eventos.");
      return;
    }

    const {
      data: { user: authUser },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !authUser) {
      Alert.alert("Sesión inválida", "Tu sesión expiró. Inicia sesión nuevamente para crear eventos.");
      return;
    }

    const lat = parseFloat(latitude);
    const lng = parseFloat(longitude);

    if (isNaN(lat) || isNaN(lng)) {
      Alert.alert("Coordenadas inválidas", "Ingresa valores numéricos válidos para latitud y longitud.");
      return;
    }

    const startTimestamp = toTimestamp(startDate.trim());
    const endTimestamp = toTimestamp(endDate.trim(), true);

    if (!startTimestamp || !endTimestamp) {
      Alert.alert("Fechas inválidas", "Usa el formato YYYY-MM-DD para las fechas.");
      return;
    }

    if (new Date(endTimestamp) < new Date(startTimestamp)) {
      Alert.alert("Rango inválido", "La fecha de fin no puede ser menor que la fecha de inicio.");
      return;
    }

    setSaving(true);

    try {
      const payload = {
        title: normalizedTitle,
        description: normalizedDescription,
        place_id: null,
        latitude: lat,
        longitude: lng,
        category_id: null,
        start_date: startTimestamp,
        end_date: endTimestamp,
        is_free: isFree,
        created_by: authUser.id,
      };

      const { data, error } = await supabase
        .from(EVENTS_TABLE)
        .insert(payload)
        .select("id, title, description, place_id, latitude, longitude, category_id, start_date, end_date, is_free, created_by, created_at")
        .single();

      if (error) {
        const extra = [
          `code: ${error.code ?? "N/A"}`,
          `details: ${error.details ?? "N/A"}`,
          `hint: ${error.hint ?? "N/A"}`,
          `uid: ${authUser.id}`,
        ].join("\n");
        Alert.alert("Error al guardar", `${error.message}\n\n${extra}`);
        return;
      }

      if (!data) {
        Alert.alert("Error al guardar", "No se recibió el evento creado desde la base de datos.");
        return;
      }

      dispatch(
        addEvent({
          id: String(data.id),
          title: data.title,
          description: data.description ?? "",
          place_id: data.place_id ?? undefined,
          latitude: Number(data.latitude),
          longitude: Number(data.longitude),
          category_id: data.category_id ?? undefined,
          start_date: (data.start_date ?? "").slice(0, 10),
          end_date:   (data.end_date   ?? "").slice(0, 10),
          is_free: data.is_free,
          created_by: String(data.created_by),
          created_at: data.created_at,
        })
      );

      Alert.alert("Evento creado", "Ahora puedes visualizar tu evento en el mapa.", [
        { text: "OK", onPress: () => navigation.goBack() },
      ]);
    } finally {
      setSaving(false);
    }
  };

{/* Form visible al usuario */}

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

        <Text style={styles.label}>Descripción *</Text>
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

        <Text style={styles.label}>Fecha inicio *</Text>
        <TouchableOpacity
          style={[commonStyles.inputField, styles.dateField]}
          onPress={() => openDatePicker("start")}
          activeOpacity={0.8}
        >
          <Text style={startDate ? styles.dateValue : styles.datePlaceholder}>
            {startDate || "Selecciona la fecha de inicio"}
          </Text>
          <Ionicons name="calendar-outline" size={18} color={colors.textMuted} />
        </TouchableOpacity>

        <Text style={styles.label}>Fecha fin *</Text>
        <TouchableOpacity
          style={[commonStyles.inputField, styles.dateField]}
          onPress={() => openDatePicker("end")}
          activeOpacity={0.8}
        >
          <Text style={endDate ? styles.dateValue : styles.datePlaceholder}>
            {endDate || "Selecciona la fecha de fin"}
          </Text>
          <Ionicons name="calendar-outline" size={18} color={colors.textMuted} />
        </TouchableOpacity>

        {activeDateField && (
          <View style={styles.datePickerCard}>
            <DateTimePicker
              value={getPickerDate()}
              mode="date"
              display={Platform.OS === "ios" ? "inline" : "default"}
              design={Platform.OS === "android" ? "material" : undefined}
              themeVariant="dark"
              accentColor={colors.primary}
              title={Platform.OS === "android" ? (activeDateField === "start" ? "Selecciona fecha de inicio" : "Selecciona fecha de fin") : undefined}
              initialInputMode={Platform.OS === "android" ? "default" : undefined}
              positiveButton={Platform.OS === "android" ? { label: "Aceptar", textColor: colors.primary } : undefined}
              negativeButton={Platform.OS === "android" ? { label: "Cancelar", textColor: colors.textSecondary } : undefined}
              minimumDate={new Date(2024, 0, 1)}
              onChange={handleDateChange}
            />
            {Platform.OS === "ios" && (
              <TouchableOpacity style={styles.datePickerDoneBtn} onPress={() => setActiveDateField(null)} activeOpacity={0.8}>
                <Text style={styles.datePickerDoneText}>Listo</Text>
              </TouchableOpacity>
            )}
          </View>
        )}

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
          disabled={saving}
        >
          <Text style={commonStyles.btnPrimaryText}>{saving ? "Guardando..." : "Guardar evento"}</Text>
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
  dateField: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  dateValue: {
    color: colors.textPrimary,
    fontSize: typography.md,
  },
  datePlaceholder: {
    color: colors.textSecondary,
    fontSize: typography.md,
  },
  datePickerCard: {
    backgroundColor: colors.card,
    borderRadius: spacing.md,
    padding: spacing.sm,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  datePickerDoneBtn: {
    alignSelf: "flex-end",
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
  },
  datePickerDoneText: {
    color: colors.primary,
    fontSize: typography.sm,
    fontWeight: "700",
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
