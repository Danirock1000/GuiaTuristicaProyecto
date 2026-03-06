import { Button, View, TextInput, Text } from "react-native";
import {useState} from "react";

export default function LoginScreen({navigation}: any){

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [counter, setCounter] = useState<number>(0);

    const handleOnLogin = () => {
        
        setCounter(counter + 1);
        navigation.navigate("Tabs", {screen: "Map"})


    }

    return(

        <View>
            <TextInput placeholder="Enter your email" onChangeText={setEmail} value={email}/>
            <TextInput placeholder="Enter your password" onChangeText={setPassword} value={password}></TextInput>
            <Button title="Login" onPress={handleOnLogin}/>
            <Button title="Exit"/>
            <Text>{counter}</Text>
        </View>
    );

}