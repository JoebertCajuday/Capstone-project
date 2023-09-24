import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import Modal from "react-native-modal";
import BouncyCheckbox from 'react-native-bouncy-checkbox';


export default function TermsConditions ({ toggleModal=()=>{}, agreed=()=>{}, ...props }) {

  const [isAgree, setIsAgree] = useState(false)
  
  const checkBoxHandler = (state) => setIsAgree(state)

  const onCancel = () => {
    setIsAgree(false)
    toggleModal(false)
  }


  return(
    <Modal isVisible={props.visible} style={styles.modal}>

      <View style={styles.container}>

        <View style={styles.header}>
          <Text style={{fontSize: 18, fontWeight: 'bold',}}>Terms and Conditions</Text>
        </View>

        <ScrollView style={{padding: 10, height: 400}}>
          <Text>
            Lorem ipsum
          </Text>
        </ScrollView>

        <View style={[styles.agree, {backgroundColor: isAgree ? '#cce6ff' : null }]}>
          <BouncyCheckbox  
            size={25}                     
            fillColor="black"  
            unfillColor="#FFFFFF"        
            innerIconStyle={{ borderWidth: 2 }}   
            onPress={(isChecked) => checkBoxHandler(isChecked) } />

          <Text style={{fontSize: 16}}>I AGREE</Text>
        </View>

        <View style={styles.footer}>

        <TouchableOpacity onPress={() => onCancel() }
          style={[styles.button, {marginRight: 10, backgroundColor: '#ff9999'}]} >

          <Text style={{padding: 10}}>CANCEL</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => agreed() } 
          style={[styles.button, {backgroundColor: '#99ccff', opacity: isAgree ? 1 : 0.4, }]} 
          disabled={!isAgree} >

          <Text style={{padding: 10}}>OK</Text>
        </TouchableOpacity>

        </View>
      </View>
      
    </Modal>
  );
}

const styles = StyleSheet.create({

  modal: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  container: {
    borderRadius: 5,
    width:'90%', 
    backgroundColor: '#fff',
  },

  header: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderColor: '#999'
  },

  agree: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    padding: 10,
  },

  footer: {
    flexDirection: 'row',
    padding: 10,
    justifyContent: 'flex-end'
  },

  button: {
    width: 100,
    alignItems: 'center',
    borderRadius: 5,
    borderWidth: 0.8,
    borderColor: '#999'
  },


});