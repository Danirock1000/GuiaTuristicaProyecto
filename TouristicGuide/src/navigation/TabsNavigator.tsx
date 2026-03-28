import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, StyleSheet, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import MapScreen from "../screens/MapScreen";
import EventsScreen from '../screens/EventsScreen';
import EventosScreen from '../screens/EventosScreen';
import ProfileScreen from '../screens/ProfileScreen';
import { colors, typography, spacing, radius } from '../theme/theme';

export type TabsParamList = {
  Map:     undefined;
  Explore: undefined;
  Eventos: undefined;
  Profile: undefined;
};

const Tab = createBottomTabNavigator<TabsParamList>();

export default function TabsNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarLabelStyle: styles.tabLabel,
        tabBarItemStyle: styles.tabItem,
      }}
    >
      <Tab.Screen
        name="Map"
        component={MapScreen}
        options={{
          tabBarLabel: "Mapa",
          tabBarIcon: ({ color, focused }) => (
            <TabIcon name="map-outline" focusedName="map" color={color} focused={focused} />
          ),
        }}
      />
      <Tab.Screen
        name="Explore"
        component={EventsScreen}
        options={{
          tabBarLabel: "Explorar",
          tabBarIcon: ({ color, focused }) => (
            <TabIcon name="compass-outline" focusedName="compass" color={color} focused={focused} />
          ),
        }}
      />
      <Tab.Screen
        name="Eventos"
        component={EventosScreen}
        options={{
          tabBarLabel: "Eventos",
          tabBarIcon: ({ color, focused }) => (
            <TabIcon name="calendar-outline" focusedName="calendar" color={color} focused={focused} />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarLabel: "Perfil",
          tabBarIcon: ({ color, focused }) => (
            <TabIcon name="person-outline" focusedName="person" color={color} focused={focused} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

// Ícono con pill de fondo cuando está activo
function TabIcon({
  name,
  focusedName,
  color,
  focused,
}: {
  name: keyof typeof Ionicons.glyphMap;
  focusedName: keyof typeof Ionicons.glyphMap;
  color: string;
  focused: boolean;
}) {
  return (
    <View style={[styles.iconWrapper, focused && styles.iconWrapperActive]}>
      <Ionicons name={focused ? focusedName : name} size={22} color={color} />
    </View>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: colors.card,
    borderTopColor: colors.border,
    borderTopWidth: 1,
    height: Platform.OS === "ios" ? 84 : 64,
    paddingBottom: Platform.OS === "ios" ? 24 : spacing.sm,
    paddingTop: spacing.sm,
  },
  tabLabel: {
    fontSize: typography.xs,
    fontWeight: typography.weight.medium,
  },
  tabItem: {
    paddingTop: spacing.xs,
  },
  iconWrapper: {
    width: 40,
    height: 28,
    borderRadius: radius.full,
    alignItems: "center",
    justifyContent: "center",
  },
  iconWrapperActive: {
    backgroundColor: colors.primaryMuted,
  },
});
