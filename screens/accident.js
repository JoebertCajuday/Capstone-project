import { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, Alert } from 'react-native';

////////////////////////////////////////////////////////////

import ReportHeader from '../components/reportheader';
import ReqAmbulance from '../components/request-checkbox';
import ImageAttachment from '../components/imageAttachments';
import OptionalMessage from '../components/option-message';
import { Loading } from '../components/loading';

import getProfile from '../queries/fetch-profile';
import submit_report from '../queries/submit-report';

export default function Accident({ navigation, route }) {

  const location = route.params?.location
  const barangay = route.params?.barangay
  const brgyName = route.params.brgyName

  const { data: user } = getProfile();

  const [report, setReport] = useState(null)

  // states for inputs
  const [reqState, setReqState] = useState(false)
  const [message, setMessage] = useState(null)
  const [attachments, setAttach] = useState()

  const reqHandler = value => { setReqState(value) }

  const submit = async () => {

    // Accident type = 2
    const object = {
      sender_id:    user?.user_id,
      type:         2,
      location:     location?? null,
      assistance:   reqState,
      message:      message,
      attachments:  attachments,
      number:       user?.number,
      brgy:         barangay
    }

    let result = await submit_report(object)
    .catch(err => { 
      return Alert.alert('Request failed', 
      `Please try again later or check your account status \n ${err}`)
    })
    
    //if(result?.error){ 
      //return Alert.alert('Request failed', 'Please try again later or check your account status') 
    //}
    //else { 
    setReport(result) 
    //}
  }


  const navigateToHome = () => { navigation.navigate('Home', {id: report.id}) }

  useEffect(() => { if(route.params?.submit){ submit() }}, [route.params?.submit])


  return (
    <View style={styles.container}>
      {!user && ( <Loading /> )}

      {user && (
        <>
          <ScrollView style={{flex: 1}}>

            <ReportHeader imageUri={require('../assets/collision.png')}   type="Accident"
              location={brgyName}
              sender={`${user?.username.fullname}`}
            />

            <ReqAmbulance reqState={reqHandler}/>

            <OptionalMessage onChange={ text => setMessage(text) }/>

            <ImageAttachment onSubmit={() => navigateToHome() } report={report} onAttach={ val => setAttach(val)}/>

          </ScrollView>

          <View style={styles.btnContainer} >

            <TouchableOpacity style={[styles.submitBtn, {opacity: route?.params?.submit ? 0.3 : 1}]} 
              disabled={route?.params?.submit?? false}  
              onPress={()=>navigation.navigate('PinCode', {routeBack: 'Accident', location:location, barangay: barangay})}>
                
              <Text style={{fontSize: 20, fontWeight: 'bold', color: '#fff'}}>Submit Report</Text>
            </TouchableOpacity>
          </View>
        </>
      )}
     
    </View>
  )
}

const styles = StyleSheet.create({
  container:{ flex: 1, padding: 10 },

  btnContainer: { justifyContent: 'flex-end', marginVertical: 10 },

  submitBtn: {
    padding: 10,
    justifyContent: 'flex-end',
    borderWidth: 1,
    borderRadius: 5,
    alignItems: 'center',
    borderColor: '#999',
    backgroundColor: '#ff6666'
  }
});
