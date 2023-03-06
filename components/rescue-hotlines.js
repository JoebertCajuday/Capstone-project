import { StyleSheet, Text, View, Linking} from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { Ionicons } from '@expo/vector-icons';


export default function RescueHotlines ({ headerTitle, headerDescription, hotlineNum}) {

    const onCallPress = () => {
        if(hotlineNum) { Linking.openURL(`tel:${hotlineNum}`) }
        else return Alert.alert('Internal Error', 'Please try again later')
    }

  return(
    <View style={styles.container}>
        <View>
            <Text style={styles.header} >{headerTitle}</Text>
            <Text>{headerDescription}</Text>
        </View>

       
        <TouchableOpacity style={styles.callBtn} onPress={() => onCallPress()}>
            <Ionicons name="call" size={30} color="green" />
        </TouchableOpacity>
        
    </View>
  );
}


const styles = StyleSheet.create({

    container: {
        width: '100%',
        borderWidth: 1,
        padding: 10,
        borderColor: '#9999', 
        borderRadius: 5,
        marginVertical: 5, 
        flexDirection: 'row',
        justifyContent: 'space-between'
    }, 

    header: {
        fontSize: 18,
    },

    callBtn: {
        padding: 5,
    }
});