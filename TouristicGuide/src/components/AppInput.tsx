import { useState } from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Text,
  TextInputProps,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors, typography, spacing, radius } from "../theme/theme";

type AppInputProps = TextInputProps & {
  iconLeft?: keyof typeof Ionicons.glyphMap;
  iconRight?: keyof typeof Ionicons.glyphMap;
  onPressIconRight?: () => void;
  error?: string;
};

export default function AppInput({
  iconLeft,
  iconRight,
  onPressIconRight,
  error,
  secureTextEntry,
  style,
  ...rest
}: AppInputProps) {
  const [isSecure, setIsSecure] = useState(secureTextEntry ?? false);
  const [isFocused, setIsFocused] = useState(false);

  const isPassword = secureTextEntry === true;

  // Ícono derecho: si es password usa el ojo, si no usa el iconRight que le pasen
  const rightIcon = isPassword
    ? isSecure
      ? "eye-off-outline"
      : "eye-outline"
    : iconRight;

  const handleRightPress = () => {
    if (isPassword) {
      setIsSecure((prev) => !prev);
    } else {
      onPressIconRight?.();
    }
  };

  return (
    <View style={styles.wrapper}>
      <View
        style={[
          styles.container,
          isFocused && styles.containerFocused,
          !!error && styles.containerError,
        ]}
      >
        {/* Ícono izquierdo */}
        {iconLeft && (
          <Ionicons
            name={iconLeft}
            size={18}
            color={isFocused ? colors.primary : colors.textMuted}
            style={styles.iconLeft}
          />
        )}

        {/* Input */}
        <TextInput
          style={[styles.input, style]}
          placeholderTextColor={colors.textMuted}
          secureTextEntry={isSecure}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          {...rest}
        />

        {/* Ícono derecho */}
        {rightIcon && (
          <TouchableOpacity onPress={handleRightPress} activeOpacity={0.7} style={styles.iconRight}>
            <Ionicons
              name={rightIcon}
              size={18}
              color={isFocused ? colors.primary : colors.textMuted}
            />
          </TouchableOpacity>
        )}
      </View>

      {/* Mensaje de error */}
      {!!error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: spacing.md,
  },
  container: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.card,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.md,
    height: 52,
  },
  containerFocused: {
    borderColor: colors.primary,
    backgroundColor: colors.cardElevated,
  },
  containerError: {
    borderColor: colors.danger,
  },
  iconLeft: {
    marginRight: spacing.sm,
  },
  iconRight: {
    marginLeft: spacing.sm,
    padding: spacing.xs,
  },
  input: {
    flex: 1,
    color: colors.textPrimary,
    fontSize: typography.md,
  },
  errorText: {
    color: colors.danger,
    fontSize: typography.xs,
    marginTop: spacing.xs,
    marginLeft: spacing.xs,
  },
});
