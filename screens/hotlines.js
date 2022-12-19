import React, { useEffect, useState, useRef } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Alert, Image, Linking} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { queryClient } from '../lib/global-utils';
import { hotlines } from '../queries/fetch-profile';
import { Loading } from '../components/loading';

const HotButton = ({onSelect=()=> {}, selectState, ...props}) => {

  const dataRef = useRef(null);

  useEffect( ()=> {
    (async ()=> {
      if(props.brgy){
        const result = await hotlines(props.brgy, true)

        if(result){ dataRef.current = result.number }

        else { return Alert.alert('Failed to fetch hotlines', 'Please try again later')}
      }

      else {
        const result = await hotlines(props.dept)

        if(result){ dataRef.current = result.number }

        else { return Alert.alert('Failed to fetch hotlines', 'Please try again later')}
      }
    })()
  }, [])


  return (
      <TouchableOpacity style={[styles.box, {borderWidth: selectState ? 1 : 0} ]} 
        onPress={() => onSelect({id: props.dept, number: dataRef.current})} >

        <Image source={props.source} style={styles.imahe} />
        <Text style={{fontSize: 20}} >{props.label}</Text>
      </TouchableOpacity>
  )
}


export default function EmergencyHotlines( { navigation } ) {

    const [user, setUser] = useState(null)
    const [selected, setSelected] = useState(null)
    const [number, setNumber] = useState(null)

    const selectResponse = async (value) => {
      if(selected === value.id) {
        setSelected(null)
        setNumber(null)
      }
      else {
        setSelected(value.id)
        setNumber(value.number)
      }
    }

    const initiateCall = () => {
      // Open dial pad
      if(number) { Linking.openURL(`tel:${number}`) }

      else return Alert.alert('Resource Error', 'Please try again later')
    }

    useEffect( ()=> {
      (async ()=> {
        const profile = await queryClient.getQueryData({queryKey: ['userProfile']})

        if(profile) setUser(profile)
      })()
    }, [])


  return (
    <View style={styles.container}>

      {!user && ( <Loading />)}

      {user && (
        <>

          <View style={styles.rowContainer}>

            <HotButton  source={require('../assets/city-hall.png')}
              brgy={user.barangay}     label="Barangay" dept={1}
              selectState={selected === 1 ? true : false}
              onSelect={value => selectResponse(value)} 
            />  

            <HotButton  source={require('../assets/police-cap.png')}
              dept={2}     label="Police" 
              selectState={selected === 2 ? true : false}
              onSelect={value => selectResponse(value)}
            />
          </View>


          <View style={styles.rowContainer}>

            <HotButton   source={require('../assets/firefighter.png')}
              dept={3}     label="Fire" 
              selectState={selected === 3 ? true : false}
              onSelect={value => selectResponse(value)}
            />

            <HotButton  source={require('../assets/health.png')}
              dept={4}     label="Rescue" 
              selectState={selected === 4 ? true : false}
              onSelect={value => selectResponse(value)}
            />
          </View>

          {selected && (
            <View style={styles.btnContainer}>
                <TouchableOpacity style={styles.callBtn} onPress={()=> initiateCall()} >
                    <Ionicons name="call" size={50} color="black" />
                </TouchableOpacity>
            </View>
          )}
        </>
      )}
       
    </View>
  )
}

const styles = StyleSheet.create({
  container:{ flex: 1 },

  rowContainer: {
    flexDirection: 'row', 
    justifyContent: 'space-evenly',
    marginTop: 15,
  },

  box: {
    width: 150, 
    height: 150, 
    backgroundColor: '#cce6ff',
    alignItems: 'center',
    borderRadius: 5,
    padding: 10,
  }, 

  box2: {
    borderRadius: 5,
    borderColor: '#999',
  },

  btnContainer: {
    width: '100%',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 10
  },

  callBtn: {
    padding: 10,
    backgroundColor: '#00ff00',
    borderRadius: 50/2
  }, 

  imahe: {
    width: 100, 
    height: 100,
  },
  
});
