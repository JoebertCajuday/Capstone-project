import { useEffect, useState, useRef } from 'react';
import { StyleSheet, View, TouchableOpacity, ScrollView, TextInput, Alert, Image} from 'react-native';
import MessageContainer, { QuestionContainer, CameraAddon } from './chat-addons'
import AttachmentDisplayer from './attach-component';
import LoadingScreen from '../components/loading';

import { pushMessage, loadMessage, loadSilentMessage, pushSilentMessage, fetchSilentMessage, fetchNormalMessage } from '../queries/messages';
import { Ionicons } from '@expo/vector-icons';
import { upload_image,} from '../queries/image-upload';
import { fetchQuestions } from '../queries/submit-report';

import supabase from '../lib/supabase';

export default function ChatComp({onSendCallback=()=>{}, report, user, ...props}) {

    const [messageList, setMessageList] = useState(null)
    const [message, setMessage] = useState(null)
    const [questions, setQuestions] = useState(null)

    // container for captured image
    const [image, setImage] = useState(null) 

    const [loading, setLoading] = useState(false)

    // Refs
    const scrollViewRef = useRef();
    const txtinputRef = useRef();

    const pushtoMessage = async () => {
        if(message) txtinputRef.current.clear()

        if(props.silent) { 
            let url = null

            if(image){ 
                url = await upload_image(image, 'reports', 'reportattachments') 
                .catch(err => { return })
            }

            const obj = {
                report_id: report?.id,
                user_id: user?.user_id,
                message: message,
                attachments: url,
                role: user.respo?.department?? 5
            }

            const response = await pushSilentMessage(obj)
            .catch(err => { return Alert.alert('Failed', `Please try again later. \n ${err}`)})

            if(response) { setLoading(false) }

            else {
                setLoading(false)
                Alert.alert('Failed to send message', 'Please try again later')
            }
        }
        else{
            let url = null
            
            if(image){ 
                url = await upload_image(image, 'reports', 'reportattachments')
                .catch(err => { return })
            }

            const obj = {
                report_id: report?.id,
                user_id: user?.user_id,
                message: message,
                attachments: url,
                role: user.respo?.department?? 5
            }
            const response = await pushMessage(obj)
            .catch(err => { 
                setLoading(false)
                return Alert.alert('Failed', `Please try again later. \n ${err}`)
            })

            if(response) { setLoading(false) }
            
            else {
                setLoading(false)
                Alert.alert('Failed to send message', 'Please check your internet connection')
            }
        }

        setMessage(null)
        setImage(null)
    }

    // callback for silent report
    const onSendReport = () => { onSendCallback() }

    // Load initial data and messages
    useEffect( ()=> {
        (async () => {
            setMessageList([])

            // Questions for silent type
            if(props.silent) { 
                const question = await fetchQuestions()
                .catch(err => { return Alert.alert('Failed', `Please try again later. \n ${err}`)})
                
                if(question){ setQuestions(question) }
            }

            //For Report messages
            if((user?.user_id === report?.sender_id || user?.role !== 1) && !props.silent) {
                const messages = await loadMessage(report?.id)
                .catch(err => { return Alert.alert('Failed', `Please try again later. \n ${err}`)})

                if(messages){ setMessageList(messages) }
            }

            // For silent types
            if((user?.user_id === report?.sender_id || user?.role !== 1) && props.silent && report) {
                const messages = await loadSilentMessage(report?.id)
                .catch(err => { return Alert.alert('Failed', `Please try again later. \n ${err}`)})

                if(messages){ setMessageList(messages) }
            }
        })()
    }, [])

    const fetchSltMsg = async (msgObject) => {

        let messageX = await fetchSilentMessage(msgObject.id)
        .catch(err => { return Alert.alert('Failed', `Please try again later. \n ${err}`)})

        if(messageX.error) { return }

        setMessageList(name => [...name, messageX])

        if(messageX.question !== null){
            setQuestions((current) => current.filter(obj => obj.id !== messageX.question) )
        }

        scrollViewRef.current.scrollToEnd({ animated: true })
        return
    }

    const fetchNrmlMsg = async (msgObject) => {

        let messageX = await fetchNormalMessage(msgObject.id)
        .catch(err => { return Alert.alert('Failed', `Please try again later. \n ${err}`)})

        if(messageX.error) { return }

        setMessageList(name => [...name, messageX])

        scrollViewRef.current.scrollToEnd({ animated: true })
        return
    }

    // Listen to realtime updates
    useEffect( () => {
        if(props.silent && report?.id) {
        
            const reportMessages = supabase.channel('custom-insert-channel').on('postgres_changes',
            {event:'INSERT', schema:'public', table:'silent_messages', filter:`report_id=eq.${report?.id}`},
            (payload) => { fetchSltMsg(payload.new) })
            .subscribe()

            return () => { supabase.removeChannel(reportMessages) }
        }
    }, [report])

    // Listen to realtime updates
    useEffect( () => {  
        if(!props.silent){

            const reportMessages = supabase.channel('custom-filter-channel').on('postgres_changes',
            {event:'INSERT', schema:'public', table:'report_messages', filter:`report_id=eq.${report?.id}`},
            (payload) => { fetchNrmlMsg(payload.new) })
            .subscribe()

            return () => { supabase.removeChannel(reportMessages) }
        }
    }, [])
    

    return(
    <>
        <ScrollView style={styles.container}  ref={scrollViewRef}  showsVerticalScrollIndicator={false} >

            {props.silent && props.qController && questions?.map( obj => (
                <QuestionContainer key={`${obj.id}`} user={user}
                    reportId={report?.id} 
                    questionId={obj.id}
                    questionTxt={obj.question}
                    questionDescription={obj.description}
                    onSend={() => onSendReport()}  
                />
            )) }

            <AttachmentDisplayer report={report} user={user} />

            {report?.message && (
                <MessageContainer key={`${report?.id}`} 
                    user={user} inlineMsg={report?.message} 
                    obj={{user_id: report?.sender_id}}
                />
            )}

            {(messageList?.length > 0) && messageList?.map( msgObj => (
                <MessageContainer obj={msgObj} key={`${msgObj.id}`} user={user} />
            ))}
        </ScrollView>

        <LoadingScreen visible={loading} />

        {report?.id && (user?.user_id === report?.sender_id || user?.role !== 1) && (

        <View style={[styles.footer, {backgroundColor: props.qController ? '#333333' : '#cce6ff'}]}>
        
            {!message && !image && ( 
                <CameraAddon color={props.qController ? 'white' : 'black'} callBack={obj => setImage(obj)}/>     
            )}

            {image !== null ? 
                <View style={{flexDirection: 'row', justifyContent:'center', alignItems: 'center'}}>
                    <Image source={{ uri: image.uri }} style={{width: 100, height: 100, marginRight: 10}}/>
                    <Ionicons name='close' color='black' size={25} 
                        onPress={() => setImage(null)}
                    />
                </View>
                : 
                <TextInput style={[styles.textInput, {backgroundColor: props.qController ? '#fff' : 'transparent'}]} 
                    multiline  ref={txtinputRef}    
                    onChangeText={text => setMessage(text)} 
                    onFocus={() => scrollViewRef.current.scrollToEnd({ animated: true })}
                />
            }

            <TouchableOpacity style={{opacity: (message || image) ? 1 : 0.3}} 
                onPress={()=>{ if(message || image) pushtoMessage()}} 
            >
                <Ionicons name="ios-send-sharp" size={25} color={props.qController ? 'white' : 'black'} />
            </TouchableOpacity>
        </View>
      
        )}
    </>
    )
}

const styles = StyleSheet.create({
    container: { flex: 1, paddingHorizontal: 10 },

    footer: {
        paddingVertical: 15,
        paddingHorizontal: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },

    textInput: {
        flex: 1,
        padding: 5,
        borderWidth: 1,
        borderRadius: 10,
        fontSize: 18,
        marginHorizontal: 10,
    },                   
});
