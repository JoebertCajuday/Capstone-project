import React, { useEffect, useState, useRef } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, TextInput, Alert} from 'react-native';
//import { useNavigation } from '@react-navigation/native';
import { getRprt } from '../queries/fetch-reports';
import { queryClient } from '../lib/global-utils';
import { Loading } from '../components/loading';
import ChatComponent from '../components/chatcomponent'
import ReportModal from '../routes/report-modal';

//import supabase from '../lib/supabase';
//import { FontAwesome, Ionicons } from '@expo/vector-icons';


export default function ReportDetails({navigation, route}) {

    const [report, setReport] = useState(null)
    const [user, setUser] = useState(null)

    const [modalState, setModalState] = useState(false)

      useEffect( ()=> {
        (async () => {
            const data = await getRprt(route?.params?.reportId)
            const profile = await queryClient.getQueryData({queryKey: ['userProfile']})

            if(profile) { setUser(profile)}
            if(data){ 
                setReport(data)
                navigation.setOptions({ headerTitle: `${data.repType.type_name} @ ${data.brgyName.brgy_name}`})
            }
        })()
      }, [])

      
  return(
    <View style={styles.container}>

    {!report && ( <Loading/> ) }

    {report && (
    <>
        <ReportModal visible={modalState} id={report?.id} onExit={()=> setModalState(false)}
            user={user}
        />

        <TouchableOpacity style={styles.headerButton} onPress={()=> setModalState(true)}>
            <Text style={{fontSize: 18}}> View Details</Text>
        </TouchableOpacity>

        <ChatComponent 
            user={user} 
            report={report} 
            attachments = {report?.attachments}
            silent={report?.type === 6 ? true : null}
        />

    </>
    )}

    </View>
  )
}
      

const styles = StyleSheet.create({
    container: { flex: 1, },

    headerContainer: {
        padding: 10, 
        backgroundColor: '#cce6ff',
    },

    headerButton: {
        paddingVertical: 10,
        justifyContent: 'center',
        alignItems: 'center',
        margin: 5,
        borderRadius: 3,
        backgroundColor: '#cce6ff',
        borderWidth: 0.4,
        borderColor: '#999999',
    }

});
