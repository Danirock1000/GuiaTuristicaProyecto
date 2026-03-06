import {createNativeStackNavigator} from "@react-navigation/native-stack";
import LoginScreen from "../screens/LoginScreen";
import TabsNavigator from "./TabsNavigator";

export type RootStackParamList = {
    Login: undefined;
    Tabs: {email: string};
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function StackNavigator() {
    return(

            <Stack.Navigator >
                <Stack.Screen
                name={"Login"} 
                component={LoginScreen}/>

                <Stack.Screen
                name="Tabs"
                component={TabsNavigator}
                />
            </Stack.Navigator>
    );
}