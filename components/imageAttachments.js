import { useEffect, useState } from 'react';
import { StyleSheet, Text, View, ScrollView, Image, TouchableOpacity, Alert } from 'react-native';
import ImageViewer from './image-viewer';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system'

import LoadingScreen from './loading';
import { AntDesign } from '@expo/vector-icons';

import supabase from '../lib/supabase';
import { upload_image } from '../queries/image-upload';



export default function ImageAttachment({onSubmit=()=>{}, onAttach=()=>{}, report, ...props}) {

  const [images, setImages] = useState(null)
  const [preview, setPreview] = useState(false)

  const [loading, setLoading] = useState(false)

  // For Selecting images
  const selectImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      //allowsEditing: false,
      base64: true,
    });

    if (!result.cancelled) { pushImage(result) }
  }


  const capture = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync()

    if(status === 'granted'){
      const result = await ImagePicker.launchCameraAsync({ base64: true })

      if (!result.cancelled) pushImage(result); // if image is captured    
    }
    else Alert.alert('Camera permission is required', 
    'This app needs to access the device camera. Please enable it in your phone settings')
  }

  
  // add image to images state
  const pushImage = async obj => {

    if(!obj.base64){
      let base = await FileSystem.readAsStringAsync(obj.uri, { encoding: FileSystem.EncodingType.Base64, })

      obj['base64'] = base;
    }


    if(!images){ 
      setImages([obj])
      onAttach(images ? true : null)
      return 
    }

    setImages(images => [...images, obj]);
    onAttach(images ? true : null)
  }


  // remove image from stack
  const removeImage = (details) => {
    setImages(current => current.filter(img => { return img.uri !== details }) )

    onAttach(images ? true : null)
  }


  const uploadPics = async () => {
    setLoading(true)
    images.map( async (e) => { 
      
        let resp = await upload_image(e, 'reports', 'reportattachments')
        .catch(err => { return Alert.alert('Failed to upload image', `Please try again later. \n ${err}`)})

        if(resp.error){ setLoading(false)
          return Alert.alert('Failed to upload image', 'Please try again later')
        }

        const { data, error } = await supabase.from('attachments')
        .insert([{ report_id: report?.id, file_url: resp?? null}])

        if(error) { setLoading(false)
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


  //useEffect( () => { onAttach(images ? true : null) }, [images])


  return (
    <View style={[styles.container, styles.border]}>

      <LoadingScreen visible={loading} />

      <ImageViewer ImageUri={preview} visible={preview ? true : false} onClose={()=>setPreview(false)}/>

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

      <ScrollView horizontal style={{margin: 10}}>
        {images && images.map( e => {
          return(
            <View style={{justifyContent:'center', alignItems:'center', margin:5}} key={`${e.uri}`} >

              <TouchableOpacity onPress={() => setPreview(e.uri)} >
                <Image source={{ uri: e.uri }} style={{width:120, height:150, borderRadius: 5,}} />
              </TouchableOpacity>

              <View style={styles.close}>
                <AntDesign name="closecircleo" size={24} color="white" onPress={()=> removeImage(e.uri)}/>
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
    backgroundColor: '#ff6666',
    padding: 3, borderRadius: 3, borderWidth: 0.3, borderColor: '#999',
    zIndex: 1,
    position: 'absolute',
    top: 0,
    right: 0
  },
});
