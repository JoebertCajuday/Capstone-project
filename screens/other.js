import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import ReportHeader from '../components/reportheader';
import ImageAttachment from '../components/imageAttachments';
import ProblemDescription from '../components/probDescription';
import LoadingScreen, { Loading } from '../components/loading';

import submit_report from '../queries/submit-report';
import { queryClient } from '../lib/global-utils';


export default function Other({ navigation, route}) {

  const location = route.params?.location
  const barangay = route.params?.barangay
  const brgyName = route.params.brgyName

  const [user, setUser] = useState(null)
  const [report, setReport] = useState(null)

  const [loading, setLoading] = useState(false)

  // State for inputs
  const [descrip, setDescript] = useState();
  const [attachments, setAttach] = useState()


  const [button, setButton] = useState(false); // Button for sending

  // Submit report
  const submit = async () => {
    setButton(true)
    
    // Accident type = 4
    const object = {
      sender_id:      user?.user_id,
      type:           4,
      location:       location,
      assistance:     null,
      message:        descrip,
      attachments:    attachments,
      brgy:           barangay,
      number:         user?.number,
    }

    let result = await submit_report(object)
    
    if(result?.error){ 
      setLoading(false)
      return Alert.alert('Request failed', 'Please try again later or check your account status') 
    }
    else { setReport(result) }
  }


  const navigateToHome = () => { 
    setLoading(false)
    navigation.navigate('Home', {id: report.id}) 
  }

  useEffect(()=> {
    (async () => {
      const profile = await queryClient.getQueryData({queryKey: ['userProfile']})
      if(profile) { setUser(profile)}
    })()
  }, [])

  useEffect(() => { if(route.params?.submit){ submit()}}, [route.params?.submit])


  return (
    <View style={styles.container}>

      {!user && ( <Loading /> )}

      {user && (
        <>
          <LoadingScreen visible={loading} />

          <ScrollView>
            <ReportHeader imageUri={require('../assets/more.png')}  type="Other" 
              location={brgyName}
              sender={`${user?.username.fullname}`}
            />

            <ProblemDescription onInput={ value => setDescript(value)}/>

            <ImageAttachment onSubmit={() => navigateToHome() } report={report} onAttach={ val => setAttach(val)}/>

          </ScrollView>

          <View style={styles.btnContainer} >
            <TouchableOpacity disabled={button}
              style={[styles.submitBtn, {opacity: button ? 0.3 : 1}]}  
              onPress={()=>navigation.navigate('PinCode', 
              { routeBack: 'Other', location: location, barangay: barangay})}>
                
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
