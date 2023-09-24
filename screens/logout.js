//import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, } from 'react-native';
import Modal from 'react-native-modal';

import { queryClient } from '../lib/global-utils';
import * as SecureStore from 'expo-secure-store';
import supabase from '../lib/supabase';



export default function Logout({navigation}) {

  async function signOut() {

    queryClient.removeQueries({ queryKey: 'userProfile', exact: true })

    await SecureStore.deleteItemAsync('PINCODE', {} )
    logout();
  }

  const logout = async () => { const { error } = await supabase.auth.signOut() }

  return (
    <Modal isVisible>
      <View style={styles.box}>
          <Text style={styles.boxTxt} > Are you sure you want to logout? </Text>
          <View style={styles.row}>

              <TouchableOpacity onPress={()=> navigation.navigate('Home')}
                style={[styles.btns, {backgroundColor: '#ff8080'}]} >

                <Text style={{fontWeight: 'bold'}}>CANCEL</Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={() => signOut() }
                style={[styles.btns, {backgroundColor: '#cceeff'}]} >
                  
                <Text style={{fontWeight: 'bold'}}>LOGOUT</Text>
              </TouchableOpacity>
          </View>
      </View>
    </Modal>
  )
}

 const styles = StyleSheet.create({
  box: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 5,
  },

  boxTxt: {
    fontSize: 20,
    fontWeight: 'bold',
    marginVertical: 20,
  },

  row: {
    flexDirection: 'row',
    justifyContent: 'space-around'
  },

  btns: {
    width: '40%',
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#9999',
    padding: 10,
    alignItems: 'center',
  }

})
