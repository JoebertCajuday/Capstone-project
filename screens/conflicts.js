import { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, Alert, } from 'react-native';

/////////////////////////////////////////


import ReportHeader from '../components/reportheader';
import { ReqPolice } from '../components/request-checkbox';
import ImageAttachment from '../components/imageAttachments';
import InvolvedCounter from '../components/involved-counter';
import { Loading } from '../components/loading';

import submit_report from '../queries/submit-report';
import getProfile from '../queries/fetch-profile';



export default function Conflicts({ navigation, route }) {

  const location = route.params?.location
  const barangay = route.params?.barangay
  const brgyName = route.params.brgyName

  const { data: user } = getProfile();

  const [report, setReport] = useState(null)

  // state for inputs
  const [reqState, setReqState] = useState(false);
  const [count, setCount] = useState(0);
  //const [message, setMessage] = useState(null)
  const [attachments, setAttach] = useState()
 
  const reqHandler = value => { setReqState(value) }

  
  const submit = async () => {
    // Accident type = 3
    const object = {
      sender_id:      user?.user_id,
      type:           3,
      location:       location?? null,
      assistance:     reqState,
      attachments:    true,
      involved_count: count,
      brgy:           barangay,
      number:         user?.number,
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

  useEffect(() => { if(route.params?.submit){ submit()}}, [route.params?.submit])


  return (
    <View style={styles.container}>
      {!user && ( <Loading /> )}

      {user && (
      <>
        <ScrollView style={{flex: 1}}>

          <ReportHeader imageUri={require('../assets/fight.png')} 
            type="Conflicts"
            location={brgyName}
            sender={`${user?.username.fullname}`}
          />

          <ReqPolice reqState={reqHandler}/>

          <InvolvedCounter counter={ val => setCount(val) }/>

          <ImageAttachment //onSubmit={() => navigateToHome() } 
            report={report} //onAttach={ val => setAttach(val)}
          />

        </ScrollView> 

        <View style={styles.btnContainer} >

          <TouchableOpacity style={[styles.submitBtn, {opacity: route?.params?.submit ? 0.3 : 1}]} 
            disabled={route?.params?.submit?? false} 
            onPress={()=>navigation.navigate('PinCode', {routeBack: 'Conflicts', location: location, barangay: barangay})}>
              
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
