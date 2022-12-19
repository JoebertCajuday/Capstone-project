import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, ScrollView, Image, TouchableOpacity, Alert} from 'react-native';
import { AntDesign } from '@expo/vector-icons';
//import Modal from "react-native-modal";
import ImageViewer from './image-viewer';
import * as ImagePicker from 'expo-image-picker';
import { upload_image } from '../queries/image-upload';
import LoadingScreen from './loading';

import supabase from '../lib/supabase';


export default function ImageAttachment({onSubmit=()=>{}, onAttach=()=>{}, report, ...props}) {

  const [images, setImages] = useState(null)
  const [preview, setPreview] = useState(false)
  const [fileUrl, setFileUrl] = useState(null)

  const [loading, setLoading] = useState(false)


  const selectImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: false,
      base64: true,
    });

    if (!result.cancelled) { pushImage(result) }
  }


  const capture = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync()

    if(status === 'granted'){
      const result = await ImagePicker.launchCameraAsync({ base64: true, })

      if (!result.cancelled) pushImage(result); // if image is captured
      
    }
    else Alert.alert('Camera permission is required', 'This app needs to access the device camera. Please enable it in your phone settings')
  }

  
  // add image to images state
  const pushImage = obj => {
    if(!images){ setImages([obj]); return }

    setImages(images => [...images, obj]);
  }

  // image preview
  const prevHandler = (details) => {
    setFileUrl(details.uri)
    setPreview(true);
  }

  // remove image from stack
  const removeImage = (details) => {
    setImages(current => current.filter(img => { return img.uri !== details }) )
  }


  const uploadPics = async () => {
    setLoading(true)
    images.map( async (e) => { 
      
        let resp = await upload_image(e, 'reports', 'reportattachments')

        if(resp.error){ 
          setLoading(false)
          return Alert.alert('Failed to upload image', 'Please try again later')
        }

        const { data, error } = await supabase
        .from('attachments')
        .insert([{ report_id: report?.id, file_url: resp?? null}])

        if(error) { 
          setLoading(false)
          return Alert.alert('Failed to upload image', 'Please try again later')
        }
    })

    setLoading(false)
  }



  useEffect( () => {
    (async () => {
      if(report && images){ await uploadPics() } // upload images

      if(report) onSubmit() // Return to home if images is submitted
    })() 
  }, [report])


  useEffect( () => { onAttach(images ? true : null) }, [images])


  return (
    <View style={[styles.container, styles.border]}>

      <LoadingScreen visible={loading} />

      <ImageViewer ImageUri={fileUrl} visible={preview} onClose={()=>setPreview(false)}/>

      <View style={styles.header}>
        <Text style={{fontSize: 20}}>Attachments </Text>

        <View style={{flexDirection: 'row'}}>
          <TouchableOpacity onPress={()=> selectImage()} style={{marginRight: 10}}>
            <AntDesign name="folder1" size={30} color="black" />
          </TouchableOpacity>
          <TouchableOpacity onPress={()=> capture()} >
            <AntDesign name='pluscircleo' size={30} color='black'/>
          </TouchableOpacity>
        </View>

      </View>

      <ScrollView horizontal style={{margin: 10,}}>
        {images && images.map( e => {
          return(
            <View style={{justifyContent:'center', alignItems:'center', margin:5}} key={`${e.uri}`} >

              <TouchableOpacity onPress={() => prevHandler(e)} >
                <Image source={{ uri: e.uri }} style={{width:150, height:150, borderRadius: 5,}} />
              </TouchableOpacity>

              <View style={styles.close}>
                <AntDesign name="closecircleo" size={24} color="black" onPress={()=> removeImage(e.uri)}/>
              </View>
            </View>
          )
        })}
      </ScrollView>
      
    </View>
  )}

const styles = StyleSheet.create({
  container:{
    width: '100%',
    minHeight: 150,
    borderWidth: 1,
    borderRadius: 5,
    marginVertical: 5,
  },

  header: {
    flexDirection: 'row', 
    width: '100%', 
    padding: 10,
    justifyContent: 'space-between', 
    alignItems: 'center',
    borderBottomWidth: 1, borderColor: '#9999',
    backgroundColor: '#cceeff',
  },

  border: { borderColor: '#9999',},
  
  close: {
    backgroundColor: '#fff',
    padding: 5,
    borderRadius: 30,
    borderWidth: 0.3, 
    borderColor: '#999',
    marginTop: 5,
  },

});
