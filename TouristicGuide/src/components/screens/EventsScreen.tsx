import { View, Text, StyleSheet } from "react-native";
import CustomEvent from "../CustomEvent";
import { typography, colors } from "../../theme/theme"

export default function EventsScreen(){
    return(
<View style={styles.container}>
        <View style={{backgroundColor: colors.background}}>
            <Text style={{fontSize: typography.lg, color: colors.primary, padding: 25, }}>Aqui estan tus eventos guardados</Text>
            <CustomEvent 
                title="Feria de Libros"
                location="Museo de Antropologia en Historia"
                date="15 de Abril del 2026"
            />
            <CustomEvent
                title="Orquesta Sinfonica"
                location="Teatro Francisco Saybe"
                date="Por determinar"
            />
        </View>
</View>

    )
}

const styles = StyleSheet.create({

container: {
backgroundColor: "#0D1F2D",
flex: 1
}

});