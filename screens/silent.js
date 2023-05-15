import { useState, useEffect } from 'react';
import { StyleSheet, View, Alert } from 'react-native';
import ReportHeader from '../components/reportheader';
import ChatComponent from '../chat/chatcomponent'
import { Loading } from '../components/loading';

////////////////////////////////////////////////////

import submit_report from '../queries/submit-report'
import getProfile from '../queries/fetch-profile';


export default function Silent({navigation, route}) {

  const location = route.params?.location
  const barangay = route.params?.barangay
  const brgyName = route.params.brgyName

  const { data: user } = getProfile();

  const [report, setReport] = useState(null)

  const showPasscode = () => {
    navigation.navigate('PinCode', {routeBack:'Silent', location: location, barangay: barangay })
  }

  

  const submit = async () => {
    const object = {
      sender_id:    user?.user_id,
      type:         6,
      location:     location?? null,
      brgy:         barangay,
      number:       user?.number
    }

    let result = await submit_report(object)
    .catch(err => { 
      return Alert.alert('Request failed', 
      `Please try again later or check your account status \n ${err}`)
    })
    
    //if(result?.error){ return Alert.alert('Request failed', 
    //'Please try again later or check your account status') }
    
    //if(result) { 
    setReport(result) //}
  }



  useEffect(() => { if(route.params?.submit){ submit()}}, [route.params?.submit])


  return (
    <View style={styles.container}>

      {!user && ( <Loading /> )}

      {user && (
        <>
          <View style={{padding: 10}}>
            <ReportHeader imageUri={require('../assets/alert.png')}  
              type="Silent"
              location={brgyName}
              sender={`${user?.username.fullname}`}
              darkmode
            /> 
          </View>
 
          <ChatComponent  
            user={user}
            report={report} 
            onSendCallback={() => showPasscode() }
            silent
            qController
          />

        </>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container:{ flex: 1, backgroundColor: '#333' }, 
});
