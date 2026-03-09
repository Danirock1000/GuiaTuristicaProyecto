import { View, Text, StyleSheet } from "react-native";
import {colors, commonStyles, spacing, typography, radius} from "../../theme/theme"
import CustomEvent from "../CustomEvent";

export default function ProfileScreen(){
    return(

        <View style={styles.container}>
            <View style={styles.content}>
              <Text style={styles.title}>Este es tu perfil</Text>
                <View style={styles.iconCircle}>
                  <Text style={styles.iconEmoji}>👨🏽</Text>
                </View>
              <Text style={styles.username}>Tu nombre</Text>
                  <CustomEvent
                  title="Daniel Ramos"
                  location="Cortes"
                  email="daniel@email.com"
                  age="21 años"
                  />
            </View>
        </View>
    )
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
    padding: 25,
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
    padding: 15
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
  btnSecondaryText: {
    color: colors.primary,
    fontSize: typography.md,
    fontWeight: "600",
  },
    username: {
    fontSize: typography.xl,
    fontWeight: "800",
    color: colors.textPrimary,
    textAlign: "center",
    lineHeight: 44,
    padding: 15
  },
    userData: {
    fontSize: typography.md,
    fontWeight: "800",
    color: colors.textPrimary,
    textAlign: "center",
    lineHeight: 44,
    padding: 15
  },
});