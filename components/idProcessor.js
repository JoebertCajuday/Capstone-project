import React, { useState, useEffect } from 'react';
import { Image, View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

import { AntDesign } from '@expo/vector-icons';
import { Feather } from '@expo/vector-icons';


export default function IdPicker(
    {
        data,
        label, 
        error, 
        onSelect=()=>{},
        removeError=()=>{}, 
        ...props
    }) {


  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: false,
      base64: true,
    });

    // if an Image is selected
    if (!result.cancelled) {
      //console.log(result.uri.split('\\').pop().split('/').pop())
      onSelect(result); 
      removeError(null);
    }
  };

  return (
    
    <View style={{ marginVertical: 10 }}>

      <Text style={{ marginLeft: 10 }}> {label}
        { error && ( 
          <Text style={{color:'#ff6666', alignSelf:'center', marginLeft:10}}>{'     ' + error}</Text>
        )}
            
      </Text>

      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>

        <View style={[styles.idInput, {width: '70%'}]}> 

            <Text style={{fontSize: 16, color: '#000099', }}> 
                { data && data.substring(0, 24) + '...' + data.slice(-7) } 
            </Text>
        </View>

        { data ? 

          <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }} >

            <View style={styles.idInput}>
              <Image source={{ uri: data }} style={{width: 30, height: 30,}}/>
            </View>

            <TouchableOpacity style={[styles.idInput,{paddingHorizontal: 8, marginLeft: 5}]} onPress={() => onSelect('')} >
              <AntDesign name="close" size={24} color="black" />
            </TouchableOpacity>

          </View> : 
          
          <View style={{justifyContent: 'flex-end' }} >

            <TouchableOpacity style={[styles.idInput, {paddingHorizontal: 8}]}
              onPress={pickImage} >
              <AntDesign name="folder1" size={24} color="black" />
            </TouchableOpacity>
              
          </View>
        }

      </View>

    </View>
  );
}

const styles = StyleSheet.create({

  box_style: {
    height: 40, 
    borderRadius: 5, 
    alignItems: 'center', 
    paddingVertical: 0, 
    marginTop: 10,
  }, 
  
  idInput: {
    height: 40, 
    borderWidth: 1, 
    borderColor: '#9999', 
    borderRadius: 5,
    justifyContent: 'center',
    padding: 5,
  },
});