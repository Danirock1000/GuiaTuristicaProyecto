import { Button, View, TextInput, Text, Alert } from "react-native";
import {useState} from "react";
import { useAuth } from "../../context/AuthContext";

export default function LoginScreen({navigation}: any){

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const {login, isAllowed} = useAuth();

    const handleOnLogin = () => {

    const allowed = login(email, password);
        if(allowed){
            navigation.navigate("Tabs", {screen: "Map"})
        } else {
            Alert.alert("Credenciales no validas")
        }
    }

    return(

        <View>
            <TextInput placeholder="Enter your email" onChangeText={setEmail} value={email}/>
            <TextInput placeholder="Enter your password" onChangeText={setPassword} value={password} secureTextEntry ></TextInput>
            <Button title="Login" onPress={handleOnLogin}/>
            <Button title="Exit"/>
        </View>
    );

}