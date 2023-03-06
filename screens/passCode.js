import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import LoadingScreen from '../components/loading';
import { Entypo, Octicons, Feather } from '@expo/vector-icons';

import * as SecureStore from 'expo-secure-store';
import { useNavigation } from '@react-navigation/native';


export default function PinCode({ setup, reloadState=()=>{}, route}) {

  const routeBack = route?.params?.routeBack
  const location = route?.params?.location
  const barangay = route?.params?.barangay

  const navigation = useNavigation();

  const [keys, setKeys] = useState([])
  const [disable, setDisable] = useState(false)
  const [error, setError] = useState()
  const [loading, setLoading] = useState(false)
  const [pin, setPin] = useState() // from secure store


  useEffect( ()=> {
    (async () => {
      let result = await SecureStore.getItemAsync('PINCODE');
      if(result){ setPin(result) } 
    })()
  },[])


  useEffect( () => {

    if(keys.length === 4){
      setDisable(true)
      let key = ''
      keys.map( digits => key = key.concat(digits) )

      // If after login
      if(setup){
        setLoading(true)
        save('PINCODE', key)
        setLoading(false)
        reloadState();
      }
      // if for user confirmation
      else compare(key)
    }

  }, [keys])

  // save pin
  const save = async (key, value) => await SecureStore.setItemAsync(key, value);

  const compare = async (key) => {
    if(key === pin){ navigation.navigate(routeBack, 
      {submit: true, location: location, barangay: barangay}) }

    else{ 
      setError(true);
      setTimeout( () => {
        setKeys([])
        setDisable(false)
        setError(null)
      }, 2000)
    }
  }

  const presshandler = value => {
    if(!keys[0]) setKeys(value)
    else setKeys( val => [...val, value])
  }

  // clear pin field
  const pop = () => setKeys([])

  return(
    <View style={styles.container}>

      <LoadingScreen visible={loading} label="Please wait ..." />

      <View style={styles.input}> 

        { setup && 
          <View>
            <Text style={{fontSize: 24, alignSelf: 'center' }}> Please set up your pin </Text>
          </View>      
        }

        <View style={styles.row}>

          {keys[0] ? <Octicons name="dot-fill" size={40} color={error ? "red" :"black" } /> :
            <Entypo name="circle" size={24} color="black" />
          }

          {keys[1] ? <Octicons name="dot-fill" size={40} color={error ? "red" :"black" } /> :
            <Entypo name="circle" size={24} color="black" />
          }

          {keys[2] ? <Octicons name="dot-fill" size={40} color={error ? "red" :"black" } /> :
            <Entypo name="circle" size={24} color="black" />
          }

          {keys[3] ? <Octicons name="dot-fill" size={40} color={error ? "red" :"black" } /> :
            <Entypo name="circle" size={24} color="black" />
          }
          
        </View>
        
      </View>

      <View style={styles.keypad}>

        <View style={styles.keypadRows}> 
          <TouchableOpacity style={styles.btns} onPress={()=> presshandler('1')} 
            disabled={disable} >
            <Text style={styles.btnsTxt} > 1 </Text> 
            </TouchableOpacity>

          <TouchableOpacity style={styles.btns} onPress={()=> presshandler('2')} 
            disabled={disable} >
            <Text style={styles.btnsTxt} > 2 </Text> 
            </TouchableOpacity>

          <TouchableOpacity style={styles.btns} onPress={()=> presshandler('3')} 
            disabled={disable} >
            <Text style={styles.btnsTxt} > 3 </Text> 
            </TouchableOpacity>
        </View>



        <View style={styles.keypadRows}> 
          <TouchableOpacity style={styles.btns} onPress={()=> presshandler('4')} 
            disabled={disable} >
            <Text style={styles.btnsTxt} > 4 </Text> 
            </TouchableOpacity>

          <TouchableOpacity style={styles.btns} onPress={()=> presshandler('5')} 
            disabled={disable} >
            <Text style={styles.btnsTxt} > 5 </Text> 
            </TouchableOpacity>

          <TouchableOpacity style={styles.btns} onPress={()=> presshandler('6')} 
            disabled={disable} >
            <Text style={styles.btnsTxt} > 6 </Text> 
            </TouchableOpacity>
        </View>



        <View style={styles.keypadRows}> 
          <TouchableOpacity style={styles.btns} onPress={()=> presshandler('7')} 
            disabled={disable} >
            <Text style={styles.btnsTxt} > 7 </Text> 
            </TouchableOpacity>

          <TouchableOpacity style={styles.btns} onPress={()=> presshandler('8')} 
            disabled={disable} >
            <Text style={styles.btnsTxt} > 8 </Text> 
            </TouchableOpacity>

          <TouchableOpacity style={styles.btns} onPress={()=> presshandler('9')} 
            disabled={disable} >
            <Text style={styles.btnsTxt} > 9 </Text> 
            </TouchableOpacity>
        </View>



        <View style={styles.keypadRows}> 
          <TouchableOpacity style={[styles.btns, { opacity: 0 }]}
            disabled >
            <Text style={styles.btnsTxt} > 1 </Text> 
          </TouchableOpacity>

          <TouchableOpacity style={styles.btns} onPress={()=> presshandler('0')} 
            disabled={disable} >
            <Text style={styles.btnsTxt} > 0 </Text> 
            </TouchableOpacity>

          <TouchableOpacity style={[styles.btns, { borderWidth: 0, backgroundColor: 'transparent' }]}
            onPress={()=> pop()}
            disabled={disable} >
            <Feather name="delete" size={40} color="black" />
            </TouchableOpacity>
        </View>

        

      </View>
            
    </View>
  )
}

const styles = StyleSheet.create({

  container:{ flex: 1, padding: 10, },
  input: { flex: 2, justifyContent: 'space-evenly', },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
  },

  rowTxt:{ fontSize: 30 },
  keypad: { flex: 4, width: '100%',},

  keypadRows: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
  },

  btns: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    borderWidth: 0.6,
    borderRadius: 15,
    borderColor: '#999',
    backgroundColor: '#cce6ff'
  },

  btnsTxt: {fontSize: 40,}, 
  modal: { justifyContent: 'flex-end', alignItems: 'center', },

  modalView: {
    width: '100%',
    backgroundColor: '#cceeff', 
    padding: 10,
    borderRadius: 5,
  },
  modalBtn: {
    padding: 10,
    width: 120,
    borderRadius: 5,
    alignItems: 'center',
  }
});
