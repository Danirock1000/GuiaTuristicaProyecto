import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import MapScreen from "../screens/MapScreen"
import TabsScreen from 'react-native-screens/lib/typescript/components/tabs/TabsScreen';
import EventsScreen from '../screens/EventsScreen';
import ProfileScreen from '../screens/ProfileScreen';

export type TabsParamList = {

    Map: undefined,
    Events: undefined,
    Profile: undefined

}

const Tab = createBottomTabNavigator<TabsParamList>();

export default function TabsNavigator(){
    return(
        <Tab.Navigator>
            <Tab.Screen
                name="Map"
                component={MapScreen}
            />
            <Tab.Screen
                name="Events"
                component={EventsScreen}
                />
            <Tab.Screen
                name="Profile"
                component={ProfileScreen}
            />
        </Tab.Navigator>
    );
}