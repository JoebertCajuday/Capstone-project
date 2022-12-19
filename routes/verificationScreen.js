import React, { useState } from 'react';
import { 
    StyleSheet, 
    Text, 
    View, 
    ActivityIndicator,  
    TextInput, 
    StatusBar, 
    TouchableOpacity
} from 'react-native';
import Modal from "react-native-modal";

import LoadingScreen from '../components/loading';


export default function VerifScreen({route}) {

    const cred = route.params.cred;
    
    const userCred = JSON.parse(cred);

    const [code, setCode] = useState('');
    //const [cred, setCred] = useState({});
    const [loading, setLoading] = useState(false);

    const verify = (code) => {
        setLoading(true);

        setTimeout(()=>{

            setLoading(false);
            console.log(code);
        }, 
        5000);
    }
  
  return (

    <View style={styles.container}>

        <LoadingScreen visible={loading}/>

        <View style={[styles.header, styles.center]}>

            <Text style={styles.headerText}>Enter Verification Code for </Text>
            <Text style={[styles.headerText, {color: "#000099"}]}>
                {userCred.mobileNumber}
            </Text>

            <TextInput style={styles.input} keyboardType="numeric"
                onChangeText={text => setCode(text) }   value={code}
            />

            <TouchableOpacity 
                style={[styles.button, styles.center, {backgroundColor: '#99ccff',}]}
                onPress={ () => verify(code) } >

                <Text style={styles.btnText}> CONTINUE </Text>
            </TouchableOpacity>


        </View>

    </View>  
  );
}

const styles = StyleSheet.create({

    center: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    
    container: {
        flex: 1, 
        paddingVertical: StatusBar.currentHeight,
        alignItems: 'center',
    },

    header: {
        width: '80%',
        marginTop: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },

    headerText: {
        fontSize: 25,
        fontWeight: 'bold',
        padding: 5,
        alignSelf: 'center',
    },

    input: {
        marginTop: 10,
        borderBottomWidth: 2,
        borderColor: '#999',
        width: 150,
        fontSize: 30,
        textAlign: 'center',
        letterSpacing: 5,
    },

    button: {
        marginTop: 50,
        width: '100%',
        padding: 10,
        borderWidth: 0.8,
        borderColor: '#999',
        borderRadius: 5,
    }, 

    btnText: {
        fontSize: 18
    },

});
