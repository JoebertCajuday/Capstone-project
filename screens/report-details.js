import { useEffect, useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { Loading } from '../components/loading';
import ChatComponent from '../chat/chatcomponent'
import ReportModal from '../routes/report-modal';

////////////////////////////////////////////////////////

import getProfile from '../queries/fetch-profile';
import { getRprt } from '../queries/fetch-reports';


export default function ReportDetails({navigation, route}) {

    const { data: user } = getProfile();
    const [report, setReport] = useState(null)
    const [modal, setModal] = useState(false)

    useEffect( ()=> {
    (async () => {
        const data = await getRprt(route?.params?.reportId)
        .catch(err => { return Alert.alert('Request failed', `${err}`) })
    
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
                <ReportModal 
                    visible={modal} 
                    id={report?.id} 
                    onExit={()=> setModal(false)} 
                    user={user}
                />

                <TouchableOpacity style={styles.headerButton} 
                    onPress={()=> setModal(true)}
                >
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
