import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import BouncyCheckbox from 'react-native-bouncy-checkbox';


export default  function ReqAmbulance({ requestState=()=>{}, ...props }){

  const [bg, setBg] = useState(false)

  return (

    <View style={[styles.container, {backgroundColor: bg ? '#ff6666' : null}]} >
      <BouncyCheckbox
        size={25}
        fillColor="black"
        unfillColor="#FFFFFF"
        iconStyle={{ borderColor: "black" }}
        innerIconStyle={{ borderWidth: 2 }}
        textStyle={styles.check_box}
        onPress={(isChecked) => { 
          setBg(!bg)
          requestState(isChecked)
        }}
      />
      <Text style={{fontSize: 18, color: bg ? '#fff' : null}} > Request an Ambulance</Text>
    </View>  
  )
}


export function ReqPolice({ requestState=()=>{}, ...props }){   

  const [bg, setBg] = useState(false)

  return (
    <View style={[styles.container, {backgroundColor: bg ? '#ff6666' : null}]} >
      <BouncyCheckbox
        size={25}
        fillColor="black"
        unfillColor="#FFFFFF"
        iconStyle={{ borderColor: "red" }}
        innerIconStyle={{ borderWidth: 2 }}
        textStyle={styles.check_box}
        onPress={(isChecked) => { 
          setBg(!bg)
          requestState(isChecked)
        }}
      />
      <Text style={{fontSize: 18, color: bg ? '#fff' : null}} > Request for Police Assistance </Text>
    </View>
  )
}

const styles = StyleSheet.create({

  container: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginVertical: 5,
    padding: 15,
    borderWidth: 1, 
    borderRadius: 5,
    borderColor: '#9999',
  },

  check_box: {
    fontSize: 20,             
    alignSelf: 'center',
    color: '#000'
  },
  
});
