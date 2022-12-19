import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, Alert } from 'react-native';

import ReportHeader from '../components/reportheader';
import ReqAmbulance from '../components/request-checkbox';
import ImageAttachment from '../components/imageAttachments';
import OptionalMessage from '../components/option-message';
import { Loading } from '../components/loading';

import submit_report from '../queries/submit-report';
import { queryClient } from '../lib/global-utils';


export default function Fire( { navigation, route } ) {
  const location = route.params?.location
  const barangay = route.params?.barangay
  const brgyName = route.params.brgyName

  const [user, setUser] = useState(null)
  const [report, setReport] = useState(null)


  // states for inputs
  const [reqState, setReqState] = useState(false)
  const [message, setMessage] = useState(null)
  const [attachments, setAttach] = useState(null)

  const [button, setButton] = useState(false); // to disable button after send

  const reqHandler = value => { setReqState(value) } // Bouncy checkbox handler
  

  const submit = async () => {
    setButton(true)

    const object = {
      sender_id:    user?.user_id,
      type:         1,
      location:     location?? null,
      assistance:   reqState,
      message:      message,
      attachments:  attachments,
      brgy:         barangay,
      number:       user?.number,
    }

    let result = await submit_report(object)
    
    if(result?.error){ 
      return Alert.alert('Request failed', 'Please try again later or check your account status') 
    }
    else { setReport(result) }
  }



  const navigateToHome = () => { navigation.navigate('Home') }


  // Fetch profile
  useEffect(()=> {
    (async () => {
      const profile = await queryClient.getQueryData({queryKey: ['userProfile']})
      if(profile) { setUser(profile)}
    })()
  }, [])
  

  // submit Report after successful passcode entry
  useEffect(() => { if(route.params?.submit){ submit()}}, [route.params?.submit])

  return (
    <View style={styles.container}>

      {!user && ( <Loading /> )}
      
      {user && (
        <>

          <ScrollView style={{flex: 1}}>

            <ReportHeader imageUri={require('../assets/flames.png')}  type="Fire"
              location={brgyName}
              sender={`${user?.username.fullname}`}
            />

            <ReqAmbulance requestState={reqHandler}/>

            <OptionalMessage onChange={ text => setMessage(text) }/>

            <ImageAttachment onSubmit={() => navigateToHome()} report={report} onAttach={ val => setAttach(val)}/>

          </ScrollView>

          <View style={styles.btnContainer} >

            <TouchableOpacity style={[styles.submitBtn, {opacity: button ? 0.3 : 1}]} 
              disabled={button}  
              onPress={()=>{ 
                navigation.navigate('PinCode', {routeBack:'Fire', location :location, barangay: barangay }) }}>
                
              <Text style={{fontSize:20, fontWeight:'bold', color:'#fff'}}>Submit Report</Text>
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
