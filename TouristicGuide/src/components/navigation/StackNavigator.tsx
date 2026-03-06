import {createNativeStackNavigator} from "@react-navigation/native-stack";
import LoginScreen from "../screens/LoginScreen";

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
            </Stack.Navigator>
    );
}