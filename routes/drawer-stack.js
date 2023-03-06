//import React, { useState, createContext } from 'react';
import { StyleSheet, View } from 'react-native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { DrawerContentScrollView, DrawerItemList, DrawerItem } from '@react-navigation/drawer' 
import { AntDesign, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
//import { MaterialCommunityIcons } from '@expo/vector-icons';
//import getProfile from '../queries/fetch-profile';
//import { Loading } from '../components/loading';

/** Routes Folder */
import About from './about';
import Profile from './profile';
import Home from './home';
import Reports from './reports';

/** Screens Folder */
import Fire from '../screens/fire'; 
import Accident from '../screens/accident';
import Rescue from '../screens/rescue';
import Conflicts from '../screens/conflicts';
import Silent from '../screens/silent';
import Other from '../screens/other';
import PinCode from '../screens/passCode';
import ReportDetails from '../screens/report-details';
import EmergencyHotlines from '../screens/hotlines';
import ReportSummary from '../screens/report-summary'

const stackHeaderStyle = { 
  headerStyle: { backgroundColor: '#ff6666', justifyContent: 'center',}, 
  headerTintColor: '#fff', 
  headerTitleStyle: { fontSize: 25 }, 
}

// Navigators
const Drawer = createDrawerNavigator(); // Parent Navigator
const Stack = createNativeStackNavigator();  // Home Stack
const Stack1 = createNativeStackNavigator(); // Profile Stack
const Stack2 = createNativeStackNavigator(); // About Stack
const Stack3 = createNativeStackNavigator(); // Reports Stack


function HomeStack( { navigation } ) {  // Stack Navigation for Home

  return (
      <Stack.Navigator initialRouteName="Home" screenOptions={stackHeaderStyle} >
        <Stack.Screen name="Home" component={Home} options = {
          { headerLeft: () => (
              <AntDesign name='bars' size={30} color='white' 
                onPress={()=>navigation.openDrawer()} 
                style={styles.stackHeader} 
              /> 
            ),
            headerRight: () => (
              <View style={{flexDirection: 'row'}}>
                <Ionicons name='call' size={30} color='white' 
                  onPress={()=>navigation.navigate('Hotlines')} 
                  //style={{marginLeft: 100}} 
                />
              </View> 
            )
          }} />

        <Stack.Screen name="Fire" component={Fire} />
        <Stack.Screen name="Accident" component={Accident} />
        <Stack.Screen name="Rescue" component={Rescue} />
        <Stack.Screen name="Conflicts" component={Conflicts} />
        <Stack.Screen name="Silent" component={Silent} />
        <Stack.Screen name="Other" component={Other} />
        <Stack.Screen name="Hotlines" component={EmergencyHotlines} options={{title:'Emergency Hotlines'}}/>
        <Stack.Screen name="PinCode" component={PinCode} options={{title:'Enter User Pin'}} />
        
      </Stack.Navigator>
  )
}


function ProfileStack( { navigation } ) {  // Stack Navigation for Profile
  return (
    <Stack1.Navigator initialRouteName="Profile" screenOptions={stackHeaderStyle} >
      <Stack1.Screen name="Profile" component={Profile} options = {
        { headerLeft: () => (
          <AntDesign name='bars' size={30} color='white' onPress={()=>navigation.openDrawer()} 
            style={styles.stackHeader} /> 
          ),
          title: 'User Profile'
        }} />
      <Stack1.Screen name="Fire" component={Fire} />
    </Stack1.Navigator>
  )
}


function ReportStack( { navigation } ) {  // Stack Navigation for Profile
  return (
    <Stack3.Navigator initialRouteName="Reports" screenOptions={stackHeaderStyle} >
      <Stack3.Screen name="Reports" component={Reports} options = {
        { headerLeft: () => (
            <AntDesign name='bars' size={30} color='white' 
              onPress={()=>navigation.openDrawer()} 
              style={styles.stackHeader} 
            /> 
          ),
          headerRight: () => (
            <View style={{flexDirection: 'row'}}>
              <MaterialCommunityIcons name="export-variant" size={30} color="white" 
                onPress={()=>navigation.navigate('Report Summary')}
              />
            </View> 
          )
        }} />
      <Stack3.Screen name="Report Details" component={ReportDetails} options={{title: ''}} />
      <Stack3.Screen name="Report Summary" component={ReportSummary} options={{title: 'Report Summary'}} />
    </Stack3.Navigator>
  )
}


function AboutStack( { navigation } ) {  // Stack Navigation for About
  return (
    <Stack2.Navigator initialRouteName="About" screenOptions={stackHeaderStyle} >
      <Stack2.Screen name="About" component={About} options = {
        { headerLeft: () => (
          <AntDesign name='bars' size={30} color='white' onPress={()=>navigation.openDrawer()} 
            style={styles.stackHeader} />   
          ),
        }} />
      <Stack2.Screen name="Fire" component={Fire} />
    </Stack2.Navigator>
  )
}


export default function DrawerNav({navigation}) {

  return(
   
    <Drawer.Navigator initialRouteName="HomeStack" drawerContent={props => {
      return (
        <DrawerContentScrollView {...props}>
          <DrawerItemList {...props} />
          <DrawerItem label="Logout" onPress={()=>navigation.navigate('Logout')} />
        </DrawerContentScrollView>
      )
    }}>

      <Drawer.Screen name="HomeStack" component={HomeStack} options={{headerShown:false, title:'Home'}}/>

      <Drawer.Screen name="ProfileStack" component={ProfileStack} options={{headerShown:false, title:'Profile'}}/>

      <Drawer.Screen name="ReportStack" component={ReportStack} options={{headerShown:false, title:'Reports'}}/>

      <Drawer.Screen name="AboutStack" component={AboutStack} options={{headerShown:false, title:'About'}}/>

    </Drawer.Navigator>
    
  )
}

const styles = StyleSheet.create({
  stackHeader: { marginRight: 25, },
});
