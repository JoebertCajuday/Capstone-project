import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image, } from 'react-native';
import Locator from '../components/locator';
import ReportModal from './report-modal';
import SelectList from 'react-native-dropdown-select-list';
import { Loading } from '../components/loading';
import { MaterialCommunityIcons } from '@expo/vector-icons';

/////////////////////////////////////////////////////////////////////

import getProfile from '../queries/fetch-profile';
import getBrgy from '../queries/fetch-brgy';




const ImageWrapper = (props) => {
  return(
    <View style={{width: '70%', height: '70%'}}>
      <Image source={props.ImageUri} style={{width: '100%', height: '100%'}} />
    </View>
)}


const BarangaySelect = ({barangay, onSlct = () => {}, ...props}) => {

  const [brgy, setBrgy] = useState(null)
  const { data: brgys, isSuccess } = getBrgy();

  useEffect(() => {
    if(brgys){
      brgys.map( obj => { 
        if(obj.key === barangay) { 
          setBrgy(obj) 
          onSlct(obj)
        }
      })
    }
  }, [isSuccess])

  const onSelectHandler = (id) => {
    if(id === brgys[id-1].key) { onSlct(brgys[id-1]) }

    else{ brgys.map( obj => { if(obj.key === id) onSlct(obj) }) }
  }

  return (
    <>
      {!isSuccess && (<Loading/>)}
      
      {isSuccess && (
        <SelectList
          setSelected={ val => setBrgy(val)} 
          placeholder={`${brgy ? brgy.value : 'Loading'}`}
          onSelect={ () => onSelectHandler(brgy) }
          data={brgys} 
        />
      )}
    </>
  )
}



export default function Home( {navigation, route} ) {// Homescreen

  const Fire = () => { // Fire button
    return(
      <TouchableOpacity style={styles.buttons} onPress={() => pressHandler('Fire')}>
        <ImageWrapper ImageUri={require('../assets/flames.png')} />
        <Text style={styles.txt}>Fire</Text>
      </TouchableOpacity>
    )}  
  const Accident = () => { // Accident button
    return(
      <TouchableOpacity style={styles.buttons} onPress={() => pressHandler('Accident')}>
        <ImageWrapper ImageUri={require('../assets/collision.png')} />
        <Text style={styles.txt}>Accident</Text>
      </TouchableOpacity>
    )}
  const Rescue = () => {  // Rescue button
    return(
      <TouchableOpacity style={styles.buttons} onPress={() => pressHandler('Rescue') }>
        <ImageWrapper ImageUri={require('../assets/rescue.png')} />
        <Text style={styles.txt}>Rescue</Text>
      </TouchableOpacity>
    )}
  const Conflicts = () => { // Conflicts button
    return(
      <TouchableOpacity style={styles.buttons} onPress={() => pressHandler('Conflicts') }>
        <ImageWrapper ImageUri={require('../assets/fight.png')} />
        <Text style={styles.txt}>Conflicts</Text>
      </TouchableOpacity>
    )}
  const Silent = () => { // Silent Button
    return(
      <TouchableOpacity style={styles.buttons} onPress={() => pressHandler('Silent')} >
        <ImageWrapper ImageUri={require('../assets/alert.png')} />
        <Text style={styles.txt}>Silent</Text>
      </TouchableOpacity>
    )}
  const Other = () => { // Other button
    return(
      <TouchableOpacity style={styles.buttons} onPress={() => pressHandler('Other')}>
        <ImageWrapper ImageUri={require('../assets/more.png')} />
        <Text style={styles.txt}>Other</Text>
      </TouchableOpacity>
    )}
  
  const ButtonGroup = () => { // Buttons arranged with flex props
    return(
      <View style={styles.container_btn}>
        <View style={styles.btn_flex}>
          <Fire />
          <Accident />
          <Rescue />
        </View>
        
        <View style={styles.btn_flex}>
          <Conflicts />
          <Silent />
          <Other />
        </View>  
      </View>
    );
  }


  // pass location details to routes
  const pressHandler = (screen) => { navigation.navigate(screen, {
      location: location, 
      barangay: barangay.current,
      brgyName: brgyName.current,
    })
  }

  const exitModal = () => setModalState(false)

  const { data: profile, isSuccess, isError } = getProfile();

  const brgyName = useRef('');
  const barangay = useRef(null);

  const [location, setLocation] = useState(null)


  // States for Report Modal
  const [modalState, setModalState] = useState(false)  // hide or show modal
  const [modalId, setModalId] = useState(null) // report id


  const onSelectBrgy = (brgyId) => {
    brgyName.current = brgyId.value
    barangay.current = brgyId.key
  }


  // Set barangay state ref based on profile
  useEffect( () => { 
    if(profile){ barangay.current = profile.barangay }
  }, [profile])


  // Listen to inserts
  useEffect( () => {
    const reports = supabase.channel('custom-insert-channel')
    .on('postgres_changes', { event:'INSERT', schema:'public', table:'reports' },
    (payload) => {
          //if(payload.new.sender_id === profile?.user_id){ return }

          setModalId(payload.new.id)
          if(payload.new.type !== 6) { setModalState(true) }
          
          if(payload.new.type === 6 && payload.new.sender_id !== profile.user_id) {
            setModalState(true)
          }
      }
    )
    .subscribe()
    return () => { supabase.removeChannel(reports) }

  }, [])

/*
  useEffect(() => { if(route.params?.id){
    setModalId(route?.params?.id)
    setModalState(true)
  }}, [route.params?.id])
*/


/// Home return component
  return (
    <View style={styles.container}>

      {!isSuccess && ( <Loading /> )}
      {isSuccess && (
        <>
          <ReportModal visible={modalState} id={modalId} onExit={() => exitModal()} user={profile} />

          <View style={{flex:4}} >
    
            <View style={{padding: 5, flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center' }}>
               
              <View style={{width: modalId ? '80%' : '100%'}}>

                <BarangaySelect barangay={profile.barangay} onSlct={val => onSelectBrgy(val)} />
             
              </View>

              {modalId && (
                <TouchableOpacity onPress={()=> setModalState(true)}
                  style={{backgroundColor: '#ff6666', padding: 5, borderRadius: 5}}>
                  <MaterialCommunityIcons name="alarm-light-outline" size={30} color="white" />
                </TouchableOpacity>
              )}
            </View> 

            <Locator onChangeLocation={ loc => { setLocation(loc) }}/>
          </View>

          <View style={{flex:2}} >
            <ButtonGroup />
          </View>
        </> 
      )}    

      {isError && (
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}> 
          <Text style={{fontSize: 20,}}>Something went wrong. Please make sure you are connected to the internet and try again</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({

  container:{
    flex: 1,
    alignItems: 'center',
  },

  container_btn:{
    flex: 1,
    alignItems: 'center',
    flexDirection: 'column',
    paddingHorizontal: 5
  },

  btn_flex: {
    flex: 1, 
    width: '100%', 
    flexDirection: 'row', 
    justifyContent: 'space-around',
    marginVertical: 5,
  },

  buttons: {
    width: '30%',
    height: '100%',
    backgroundColor: '#cce6ff',
    alignItems: 'center',
    padding: 5,
    justifyContent: 'space-between', 
    borderWidth: 1, borderColor: '#9999', borderRadius: 10,
  },

  txt: {
    fontSize: 18,
    fontWeight: '500',
    color: '#111',
  },
});
