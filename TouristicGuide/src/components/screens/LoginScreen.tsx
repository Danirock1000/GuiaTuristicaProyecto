import { Button, View, TextInput } from "react-native";
import {useState} from "react";



export default function LoginScreen({navigation}: any){

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    return(

        <View>
            <TextInput placeholder="Enter your email" onChangeText={setEmail} value={email}/>
            <TextInput placeholder="Enter your password" onChangeText={setPassword} value={password}></TextInput>
            <Button title="Login"/>
            <Button title="Exit"/>
        </View>
    );

}