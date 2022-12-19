import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, Alert } from 'react-native';

import ReportHeader from '../components/reportheader';
import RescueHotlines from '../components/rescue-hotlines';
import { Loading } from '../components/loading';

import getProfile, { hotlines } from '../queries/fetch-profile';
import { queryClient } from '../lib/global-utils';
import submit_report from '../queries/submit-report'


export default function Rescue({ navigation, route }) {

  // For Headers
  const location = route.params?.location
  const barangay = route.params?.barangay
  const brgyName = route.params.brgyName

  const [user, setUser] = useState(null)
  const [numbers, setNumbers] = useState([])

  const [button, setButton] = useState(false);


  // Submit report Rescue is type 5
  const submit = async () => {
    setButton(true)

    const object = {
      sender_id:    user?.user_id,
      type:         5,
      location:     location?? null,
      message:      null,
      attachments:  null,
      brgy:         barangay,
      number:       user?.number,
    }
    
    let result = await submit_report(object)
    
    if(result?.error){ return Alert.alert('Request failed', 'Please try again later or check your account status') }
    else { navigation.navigate('Home') }

    console.log(object)
  }


  useEffect( ()=> {
    // fetxh hotlines & profile
    (async ()=> {
      const result = await hotlines(4) // Mdrrmo number
      const brgyNum = await hotlines(barangay, true)

      if(brgyNum && result){ setNumbers([result, brgyNum]) }
      else setNumbers([result])

      const profile = await queryClient.getQueryData({queryKey: ['userProfile']})
      if(profile) { setUser(profile) }
  })()

  }, [])


  useEffect( () => { if (route.params?.submit) { submit() } }, [route.params?.submit] )

  
  return (
    <View style={styles.container}>
      {!user && ( <Loading /> )}

      {user && (
        <>
          <ScrollView style={{flex: 1}}>
      
            <ReportHeader imageUri={require('../assets/rescue.png')}  type="Rescue" 
              location={brgyName}
              sender={`${user?.username.fullname}`}
            />

            {numbers && (
              numbers.map(obj => {
                return (
                  <RescueHotlines headerTitle={`${obj.dept.dept_name?? obj.barangay.brgy_name}`} 
                    headerDescription={`${!obj.brgy ? 'MDRRMO' : 'Barangay'}`} 
                    hotlineNum={obj.number}
                    key={obj.id}
                  />
                )
              })
            )}

            <Text style={{fontSize:20, alignItems:'center', marginTop:50, alignSelf:'center'}}> or </Text>

          </ScrollView>

          <View style={styles.btnContainer} >

            <TouchableOpacity style={[styles.submitBtn, {opacity: button ? 0.3 : 1}]}   disabled={button}  
              onPress={()=>navigation.navigate('PinCode', 
              {routeBack: 'Rescue', location: location, barangay: barangay})}>
                
              <Text style={{fontSize: 20, fontWeight: 'bold', color: '#fff'}}>Send an SOS</Text>
            </TouchableOpacity>
          </View>     
        </>
      )}
    </View>  
  )
}

const styles = StyleSheet.create({
  container:{ flex: 1, padding: 10, },

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
