import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import MapScreen from "../screens/MapScreen"
import EventsScreen from '../screens/EventsScreen';
import ProfileScreen from '../screens/ProfileScreen';
import {Ionicons} from "@expo/vector-icons"

export type TabsParamList = {

    Map: undefined,
    Events: undefined,
    Profile: undefined

}

const Tab = createBottomTabNavigator<TabsParamList>();

export default function TabsNavigator(){
    return(
        <Tab.Navigator screenOptions={{headerShown: false, tabBarActiveTintColor: 'blue', tabBarInactiveTintColor: 'gray'}}>
            <Tab.Screen
                name="Map"
                component={MapScreen}
                options={{
                    tabBarIcon: ({ color, size }) => {
                        return <Ionicons name="map-outline" color={color} size={size} />;
                    },
                }}
                
                
            />
            <Tab.Screen
                name="Events"
                component={EventsScreen}
                options={{
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="calendar-outline" color={color} size={size} />
                    ),
                }}
                
                />
            <Tab.Screen
                name="Profile"
                component={ProfileScreen}
                options={{
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="person-outline" color={color} size={size} />
                    ),
                }}
                
            />
        </Tab.Navigator>
    );
}