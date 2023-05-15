import { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack'; 
import * as SecureStore from 'expo-secure-store';
//import * as SplashScreen from 'expo-splash-screen';
import supabase from '../lib/supabase';
import getBrgy from '../queries/fetch-brgy';

import DrawerNav from './drawer-stack';
import Login from './login';
import Logout from '../screens/logout';
import PinCode from '../screens/passCode';


const RootStack = createNativeStackNavigator(); 

// Keep the splash screen visible while we fetch resources
//SplashScreen.preventAutoHideAsync();


export default function AppNavigation() {

  const [sessionState, setSession] = useState(false); // login state
  const [toggleCode, setToggleCode] = useState(false); // login state
  
  //const [appIsReady, setAppIsReady] = useState(false);
  // fetch barangays
  const { data: brgy, isSuccess} = getBrgy();

  async function getKey(key) {
    let result = await SecureStore.getItemAsync(key);
    if (result){ setToggleCode(true); } 
    else { setToggleCode(false) }
  }

 useEffect( ()=> { getKey('PINCODE') }, [!sessionState])

  useEffect( () => {
    supabase.auth.onAuthStateChange((event, session) => {
      session?.user ? setSession(true) : setSession(false)
    })
  }, [])
  
  const reload = () => setToggleCode(!toggleCode)


  /*useEffect(() => {
    async function prepare() {
        // Tell the application to render
        setAppIsReady(true);
    }
    prepare();
  }, [isSuccess]);

  const onLayoutRootView = useCallback(async () => {
    if (appIsReady) {
      // This tells the splash screen to hide immediately! If we call this after
      // `setAppIsReady`, then we may see a blank screen while the app is
      // loading its initial state and rendering its first pixels. So instead,
      // we hide the splash screen once we know the root view has already
      // performed layout.
      await SplashScreen.hideAsync();
    }
  }, [appIsReady]);

  if (!appIsReady) {
    return null;
  }*/

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
