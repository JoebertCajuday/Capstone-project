import React, { useState, useEffect } from 'react';
import { StyleSheet, Alert } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack'; 
import * as SecureStore from 'expo-secure-store';
import supabase from '../lib/supabase';
import getBrgy from '../queries/fetch-brgy';
//import AsyncStorage from '@react-native-async-storage/async-storage';

import DrawerNav from './drawer-stack';
import Login from './login';
import Logout from '../screens/logout';
import PinCode from '../screens/passCode';

const RootStack = createNativeStackNavigator(); 



export default function AppNavigation() {

  const [sessionState, setSession] = useState(false); // login state
  const [toggleCode, setToggleCode] = useState(false); // login state
  

  // fetch barangays
  const { data: brgy, isSuccess, isLoading } = getBrgy();

  async function getKey(key) {
    let result = await SecureStore.getItemAsync(key);
    if (result){ setToggleCode(true); } 
    else { setToggleCode(false) }
  }

 useEffect( ()=>{ getKey('PINCODE'); }, [!sessionState])

  useEffect( () => {
    supabase.auth.onAuthStateChange((event, session) => {
      //console.log(session?.user.id?? 'No session detected')
      session?.user ? setSession(true) : setSession(false)
    })
  }, [])
  
  const reload = () => setToggleCode(!toggleCode)

  return (
    <NavigationContainer>

    {isSuccess &&(
      <>
        {sessionState ? toggleCode ? 
          <RootStack.Navigator presentation="modal">
            <RootStack.Screen name="Home" component={DrawerNav}  options={{headerShown:false}}/>
            <RootStack.Screen name="Logout" component={Logout}  options={{headerShown:false}}/>
          </RootStack.Navigator> : <PinCode setup reloadState={ ()=> reload() }/> 

          : <Login/>
        }
      </>
    )}
    </NavigationContainer>
  )
}
