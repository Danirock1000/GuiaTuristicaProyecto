import { StyleSheet, Platform } from 'react-native';

// ─── COLORES ────────────────────────────────────────────────────────────────
export const colors = {
  // Fondos
  background:       '#080F1A',   // fondo principal (más profundo que antes)
  backgroundMid:    '#0D1825',   // fondo de cards y paneles
  card:             '#111E2E',   // superficie de tarjeta
  cardElevated:     '#162640',   // tarjeta con elevación (hover / activa)
  overlay:          'rgba(8,15,26,0.72)', // overlay oscuro sobre mapa/imagen

  // Bordes
  border:           '#1A2E42',
  borderSubtle:     '#0F1E2E',

  // Primario — verde teal del mockup
  primary:          '#00E5C0',
  primaryDark:      '#00B89A',
  primaryMuted:     'rgba(0,229,192,0.15)', // fondo de badge/chip verde

  // Accent — rosa/rojo del botón secundario (pantalla 3)
  accent:           '#FF4D6D',
  accentMuted:      'rgba(255,77,109,0.15)',

  // Textos
  textPrimary:      '#FFFFFF',
  textSecondary:    '#7A93AC',
  textMuted:        '#4A6278',
  textOnPrimary:    '#080F1A',   // texto sobre botón verde

  // Estados / utilidad
  danger:           '#FF6B6B',
  success:          '#00E5C0',
  warning:          '#FFD166',
  gold:             '#FFD166',   // rating stars
  goldMuted:        'rgba(255,209,102,0.15)',

  // Pin colors (mapa)
  pinMuseum:        '#00E5C0',
  pinEvent:         '#FF4D6D',
  pinNature:        '#4ADE80',
  pinMirador:       '#FFD166',
};

// ─── TIPOGRAFÍA ──────────────────────────────────────────────────────────────
export const typography = {
  // Tamaños
  xs:   11,
  sm:   13,
  md:   15,
  lg:   18,
  xl:   24,
  xxl:  32,
  xxxl: 40,

  // Pesos — "as const" para que TypeScript infiera el literal exacto y sea compatible con fontWeight
  weight: {
    regular:   '400' as const,
    medium:    '500' as const,
    semibold:  '600' as const,
    bold:      '700' as const,
    extrabold: '800' as const,
  },

  // Line heights
  lineHeight: {
    tight:   1.2,
    normal:  1.5,
    relaxed: 1.75,
  },
};

// ─── ESPACIADO ───────────────────────────────────────────────────────────────
export const spacing = {
  xxs:  2,
  xs:   4,
  sm:   8,
  md:   16,
  lg:   24,
  xl:   32,
  xxl:  48,
};

// ─── BORDER RADIUS ───────────────────────────────────────────────────────────
export const radius = {
  xs:   4,
  sm:   8,
  md:   12,
  lg:   20,
  xl:   28,
  full: 999,
};

// ─── SOMBRAS ─────────────────────────────────────────────────────────────────
export const shadows = {
  sm: Platform.select({
    ios: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.3,
      shadowRadius: 4,
    },
    android: { elevation: 3 },
  }),
  md: Platform.select({
    ios: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.4,
      shadowRadius: 8,
    },
    android: { elevation: 6 },
  }),
  lg: Platform.select({
    ios: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.5,
      shadowRadius: 16,
    },
    android: { elevation: 12 },
  }),
  primary: Platform.select({
    ios: {
      shadowColor: colors.primary,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.4,
      shadowRadius: 12,
    },
    android: { elevation: 8 },
  }),
};

// ─── OPACIDADES ──────────────────────────────────────────────────────────────
export const opacity = {
  disabled: 0.4,
  subtle:   0.6,
  medium:   0.8,
};

// ─── ESTILOS COMUNES ─────────────────────────────────────────────────────────
export const commonStyles = StyleSheet.create({

  // Contenedores
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingHorizontal: spacing.md,
    paddingTop: spacing.xl,
  },
  safeContainer: {
    flex: 1,
    backgroundColor: colors.background,
  },

  // Cards
  card: {
    backgroundColor: colors.card,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
  },
  cardElevated: {
    backgroundColor: colors.cardElevated,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    ...shadows.md,
  },

  // Inputs
  inputField: {
    backgroundColor: colors.card,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    color: colors.textPrimary,
    fontSize: typography.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm + spacing.xs,
    marginBottom: spacing.md,
  },
  inputFieldFocused: {
    borderColor: colors.primary,
  },

  // Botones
  btnPrimary: {
    backgroundColor: colors.primary,
    borderRadius: radius.lg,
    paddingVertical: spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.primary,
  },
  btnPrimaryText: {
    color: colors.textOnPrimary,
    fontSize: typography.md,
    fontWeight: typography.weight.bold,
    letterSpacing: 0.3,
  },
  btnSecondary: {
    backgroundColor: 'transparent',
    borderRadius: radius.lg,
    borderWidth: 1.5,
    borderColor: colors.primary,
    paddingVertical: spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnSecondaryText: {
    color: colors.primary,
    fontSize: typography.md,
    fontWeight: typography.weight.semibold,
  },
  btnAccent: {
    backgroundColor: colors.accent,
    borderRadius: radius.full,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.md,
  },
  btnAccentText: {
    color: colors.textPrimary,
    fontSize: typography.sm,
    fontWeight: typography.weight.bold,
  },

  // Badges / chips
  badge: {
    backgroundColor: colors.primaryMuted,
    borderRadius: radius.full,
    paddingVertical: spacing.xxs + 2,
    paddingHorizontal: spacing.sm,
    alignSelf: 'flex-start',
  },
  badgeText: {
    color: colors.primary,
    fontSize: typography.xs,
    fontWeight: typography.weight.semibold,
  },
  badgeGold: {
    backgroundColor: colors.goldMuted,
    borderRadius: radius.full,
    paddingVertical: spacing.xxs + 2,
    paddingHorizontal: spacing.sm,
    alignSelf: 'flex-start',
  },
  badgeGoldText: {
    color: colors.gold,
    fontSize: typography.xs,
    fontWeight: typography.weight.semibold,
  },

  // Chip de filtro (ej: Todos / Museos / Eventos)
  chip: {
    backgroundColor: colors.card,
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: colors.border,
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.md,
  },
  chipActive: {
    backgroundColor: colors.primary,
    borderRadius: radius.full,
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.md,
  },
  chipText: {
    color: colors.textSecondary,
    fontSize: typography.sm,
    fontWeight: typography.weight.medium,
  },
  chipTextActive: {
    color: colors.textOnPrimary,
    fontSize: typography.sm,
    fontWeight: typography.weight.bold,
  },

  // Info chip (Horario / Entrada / Contacto en pantalla de detalle)
  infoChip: {
    backgroundColor: colors.card,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.sm,
    alignItems: 'center',
    flex: 1,
  },
  infoChipLabel: {
    color: colors.textMuted,
    fontSize: typography.xs,
    marginTop: spacing.xxs,
  },
  infoChipValue: {
    color: colors.textPrimary,
    fontSize: typography.sm,
    fontWeight: typography.weight.semibold,
    marginTop: spacing.xxs,
  },

  // Barra de búsqueda
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    gap: spacing.sm,
  },
  searchBarText: {
    color: colors.textMuted,
    fontSize: typography.md,
    flex: 1,
  },

  // Separadores y helpers
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: spacing.md,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rowBetween: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  textPrimary: {
    color: colors.textPrimary,
    fontSize: typography.md,
  },
  textSecondary: {
    color: colors.textSecondary,
    fontSize: typography.sm,
  },
  textMuted: {
    color: colors.textMuted,
    fontSize: typography.xs,
  },
});
