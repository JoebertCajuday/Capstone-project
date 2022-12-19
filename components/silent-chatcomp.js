import React, { useEffect, useState, useRef } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, TextInput, Alert} from 'react-native';
//import { useNavigation } from '@react-navigation/native';
import { queryClient } from '../lib/global-utils';
//import { Loading } from '../components/loading';
import { pushMessage, loadMessage } from '../queries/messages';
import { FontAwesome, Ionicons } from '@expo/vector-icons';

import supabase from '../lib/supabase';


export default function SilentChat(props) {

    /** Props
     * reportId
     * uId
     */

    const MessageContainer = ({obj}) => {
        
        return(
            <View style={{marginVertical: 5,
                alignItems: user?.user_id === obj.user_id ? 'flex-end' : 'flex-start' }}>

                { user?.user_id !== obj.user_id && ( 
                    <Text style={{fontSize: 12, color: '#333'}}>{`${obj.sender_name}`}</Text> 
                )}

                <TouchableOpacity style={{ padding: 10,  borderRadius: 5, maxWidth: '70%',
                    borderWidth: 0.5, borderColor: '#999',
                    backgroundColor: user?.user_id === obj.user_id ? '#cceeff' : '#fff', 
                }}>

                    <Text style={{fontSize: 16}}>{obj.message}</Text>
                </TouchableOpacity>
            </View>
        )
    }


    /* Load initial data
    useEffect( ()=> {
        (async () => {
            const profile = await queryClient.getQueryData({queryKey: ['userProfile']})

            if(profile) { 
                setUser(profile)

                if(profile.user_id === props.senderId || profile.role !== 1) {
                    const messages = await loadMessage(props.reportId)
                    if(messages){ setMessageList(messages)}
                }
                else return //setMessageList([])
            }

        })()
    }, [])*/



    /* Listen to realtime updates
    useEffect( () => {
        
        const reportMessages = supabase.channel('custom-filter-channel')
        .on('postgres_changes',
        {event: 'INSERT', schema: 'public', table: 'report_messages', filter: `report_id=eq.${props.reportId}`},
        (payload) => {
            setMessageList(name => [...name, payload.new])
            scrollViewRef.current.scrollToEnd({ animated: true })
        })
        .subscribe()

        return () => { supabase.removeChannel(reportMessages) }
    }, [])


    useEffect( () => {
        if(messageList) scrollViewRef.current.scrollToEnd({ animated: true })
    }, [messageList])*/


    const [user, setUser] = useState(null)
    const [messageList, setMessageList] = useState(null)
    const [message, setMessage] = useState(null)

    const scrollViewRef = useRef();
    const txtinputRef = useRef();

    const pushtoMessage = async () => {
        const obj = {
            report_id: props.reportId,
            user_id: props.userId,
            message: message,
            sender_name: props.userName
        }

        const response = await pushMessage(obj)

        if(response) {      
            setMessage(null) 
            txtinputRef.current.clear();
        }
        else 
            Alert.alert('Failed to send message', 'Please check your internet connection')
    }

      
    return(
        <>

        {(user?.user_id === props.senderId || user?.role !== 1) && ( <>

            <ScrollView style={styles.container}    ref={scrollViewRef}  showsVerticalScrollIndicator={false} >

            </ScrollView>

            <View style={styles.footer}>
                {!message && ( 
                    <TouchableOpacity >
                        <FontAwesome name="camera" size={25} color="white" /> 
                    </TouchableOpacity>
                )}

                <TextInput style={ styles.textInput} multiline  ref={txtinputRef}
                    onChangeText={ text => setMessage(text)} />

                <TouchableOpacity style={{opacity: message ? 1 : 0.3}}
                    onPress={() => { if(message) //pushtoMessage()
                                        console.log(message)
                }} >
                    <Ionicons name="ios-send-sharp" size={25} color="white" />
                </TouchableOpacity>
            </View>
        </> )} 

        </>
    )
}
    

const styles = StyleSheet.create({
    container: { 
        flex: 1, 
        paddingHorizontal: 10,
        backgroundColor: '#999999',
    },

    footer: {
        paddingVertical: 10,
        paddingHorizontal: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },

    textInput: {
        flex: 1,
        padding: 5,
        borderWidth: 1,
        borderColor: '#999999',
        borderRadius: 10,
        fontSize: 18,
        marginHorizontal: 10,
        backgroundColor: '#ffffff',
    },
});
