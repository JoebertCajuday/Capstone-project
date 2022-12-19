import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { globalStyles } from './globalstyle';



export default function CustomInput (
  { 
    label, 
    icon, 
    error, 
    password, 
    mobileNumber,
    onFocus = () => {}, 
    ...props 
  }) 
{

  const [hidePassword, setHidePassword] = useState(password);
  const [isFocused, setIsFocused] = useState(false);


  return(
    <View style={styles.container}>

      <Text style={{marginLeft: 5}} > {label} 

        { 
          error && ( 
            <Text style={{color: '#ff6666', alignSelf: 'center'}}>{"  " + error}</Text>
          )
        }

      </Text>


      <View style={[styles.inputStyle,
        {
          borderColor: error ? '#ff6666' : isFocused ? '#000' : '#9999',
        }]}>

        {
          // If input is for mobile number
          mobileNumber && (       
            <Text style={{
              fontSize: 18, 
              alignSelf: 'center',
              width: '15%',
              textAlign: 'center',
              borderRightWidth: 1,
              marginRight: 5,
            }}> +63 </Text>
          )
        }


        <TextInput
          onFocus={() => { onFocus(); setIsFocused(true); } }
          onBlur={() => setIsFocused(false) }
          secureTextEntry={hidePassword}
          style={styles.txtInput}
          {...props}
        />


        {password && (
          <Icon
            onPress={() => setHidePassword(!hidePassword)}
            name={hidePassword ? 'eye-off-outline' : 'eye-outline'}
            style={{
              color: '#999', 
              fontSize: 25, 
              alignSelf: 'center', 
              marginRight: 5,
            }}
          />
        )}

      </View>

    </View>
  );
}

const styles = StyleSheet.create({

  inputStyle: {  // input component
    borderWidth: 1,
    borderColor: '#9999',
    flexDirection: 'row',
    borderRadius: 4,
    padding: 5,
  },

  txtInput:{
    color: '#000099', 
    flex: 1, 
    fontSize: 18, 
    marginLeft: 5,
  },

  container: { 
    //width: '100%',
    marginVertical: 5,
  },

});