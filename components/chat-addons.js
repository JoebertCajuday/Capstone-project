import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Alert, Image} from 'react-native';
import ImageViewer from './image-viewer';
import { fetchOptions } from '../queries/submit-report';
import { pushSilentMessage } from '../queries/messages';
import * as ImagePicker from 'expo-image-picker'
import { ImageCont } from '../routes/report-modal';


import { FontAwesome, Ionicons } from '@expo/vector-icons';
//import supabase from '../lib/supabase';


export default function MessageContainer({obj, ...props}){
        
    return(
        <View style={[styles.msgContainer,
            {alignItems: props.user?.user_id === obj?.user_id ? 'flex-end' : 'flex-start'}]}>


        {obj && (
        <>
            {(props.user?.user_id !== obj?.user_id) && obj?.id && ( 
                <Text style={{fontSize: 12, color: '#333'}}>{`${obj.username?.fullname}`}</Text> 
            )}


            {obj.attachments && (
                <ImageCont fileUrl={obj.attachments} key={obj.attachments}/>
            )}


            {props.inlineMsg && (
                <TouchableOpacity style={[styles.msgTxtBox,
                    {backgroundColor: props.user?.user_id === obj?.user_id ? '#cceeff' : '#fff', }]}>
                    <Text style={{fontSize: 16}}>{props.inlineMsg}</Text>
                </TouchableOpacity>
            )}
            

            {obj?.question && (
                <TouchableOpacity style={[styles.msgTxtBox,
                    {backgroundColor: props.user?.user_id === obj?.user_id ? '#cceeff' : '#fff', }]}>
                    <Text style={{fontSize: 16, alignSelf: 'flex-start'}}>{obj?.questions?.question}</Text>
                    <Text style={styles.answer}> {`${obj?.option?.value}`} </Text>
                </TouchableOpacity>
            )}

            {obj?.message && (
                <TouchableOpacity style={[styles.msgTxtBox,
                    {backgroundColor: props.user?.user_id === obj?.user_id ? '#cceeff' : '#fff', }]}>
                    <Text style={{fontSize: 16}}>{obj?.message}</Text>
                </TouchableOpacity>
            )}
        
        </>
        )}

        </View>
    )
}




export const QuestionContainer = ({onSend=()=>{}, user, reportId, ...props}) => {

    const [options, setOptions] = useState(null) // container for questions
    const [pressed, setPressed] = useState(null)


    const pushToSilentMsg = async (option) => {
        const object = {
            report_id: reportId,
            question: props.questionId,
            answer: option?? pressed,
            user_id: user?.user_id,
        }

        let resu = await pushSilentMessage(object)

        if(resu.error) Alert.alert('Failed to send message', 'Please check your internet connection')
    }


    const onOptionPress = (optionId) => {
        if(reportId) { 
            setPressed(optionId)
            pushToSilentMsg(optionId) 
        }
        else {
            setPressed(optionId)
            onSend()
        }
    }


    useEffect( () => {
        (async () => {
            let result = await fetchOptions(props.questionId)
            if(result){ setOptions(result) }
        })()
    }, [])


    const delaySubmit = () =>  setTimeout(() => pushToSilentMsg(), 2000)


    useEffect( ()=> {
        if(reportId && pressed){ delaySubmit() }
    }, [reportId])


    return (

        <View style={styles.questionBox}>
            <Text style={[{fontSize:18, backgroundColor:'#cce6ff', padding:10, borderTopRightRadius: 3, borderTopLeftRadius: 3}]}>
                {props.questionTxt}</Text>
            
            <View style={{padding: 5}}>
                {options && options.map( obj => {
                    return(
                        <TouchableOpacity style={styles.optionBtn} onPress={() => onOptionPress(obj.id)} key={`${obj.id}`}>
                            <Text style={[styles.txtWhite, {fontSize: 18}]}>{obj.value}</Text>
                        </TouchableOpacity>
                    )
                })}
                
            </View>
        </View>

    )
}




export const ImageContainer = (props) => {
    const [openViewer, setOpenViewer] = useState(false)

    return (
        <View style={{alignItems: props.report?.sender_id === props.user?.user_id ? 'flex-end' : 'flex-start'}}>
            <TouchableOpacity style={styles.imageBtn} onPress={() => setOpenViewer(true) } >
                <Image source={{uri: `${props.fileUrl}`, scale: 1}} style={{height: 130, width: 100, borderRadius: 5}}/>

                <ImageViewer ImageUri={props.fileUrl} visible={openViewer} onClose={()=>setOpenViewer(false)} />
            </TouchableOpacity>
        </View>
    )
}


export const CameraAddon = ({callBack=()=>{},...props}) => {
    
    const capture = async () => {
        const { status } = await ImagePicker.requestCameraPermissionsAsync()
    
        if(status === 'granted'){
          const result = await ImagePicker.launchCameraAsync({ base64: true, })
    
          if (!result.cancelled) { callBack(result) } //pushImage(result); 
        }
        else Alert.alert('Camera permission is required', 
            'This app needs to access the device camera. Please enable it in your phone settings')
      }

    return (
        <TouchableOpacity onPress={()=> capture()}>
            <FontAwesome name="camera" size={25} color={props.color} /> 
        </TouchableOpacity>
    )
}


const styles = StyleSheet.create({

    txtWhite: {color: '#ffffff'},
    
    msgContainer: { marginVertical: 5 }, 
    
    msgTxtBox : {
        padding: 10,  
        borderRadius: 5,
        maxWidth: '70%',
        borderWidth: 0.5, 
        borderColor: '#999',
    },

    answer: {
        fontSize: 16, 
        alignSelf: 'flex-end', 
        backgroundColor: '#ffffff', 
        padding: 5,
        paddingHorizontal: 20, 
        borderRadius: 3,
        borderWidth: 0.5,
        borderColor: '#999999', 
        marginTop: 5
    },

    // Question Container

    questionBox: {
        borderWidth: 1,
        borderColor: '#999999',
        borderRadius: 5,
        marginVertical: 10,
    },

    optionBtn: {
        width: '100%',
        marginVertical: 5,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 10 ,
        backgroundColor: '#ff6666',
        borderRadius: 5,
    },

    // Image Container
    
    imageBtn: {
        backgroundColor: '#cce6ff',
        marginVertical: 5,
        borderRadius: 5,
    }

})