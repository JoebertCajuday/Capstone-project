import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, View, Dimensions, Alert,} from 'react-native';

import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import { Loading } from './loading';


export default function Locator({onChangeLocation=()=>{}, isActive}) {

  const [markerLoc, setMarkerLoc] = useState({})
  const mapViewRef = useRef()

  // get coordinates for marker
  const setMarker = async () => {
    let coordinates = await Location.watchPositionAsync(
      { accuracy: Location.Accuracy.BestForNavigation, distanceInterval: 10, mayShowUserSettingsDialog: true },
      location => { 

        mapViewRef.current = {
          region : {
            latitude: location.coords.latitude,
            longitude: location.coords.longitude, 
            latitudeDelta: 0.002,
            longitudeDelta: 0.0001,
          }
        }

        setMarkerLoc({ latitude: location.coords.latitude, longitude: location.coords.longitude })
        
        const loc_obj = {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        }

        // Sent location details back to home component
        onChangeLocation(loc_obj)
      }
    )
  }
  

  useEffect( ()=> {
    (async () => {
      
      let { status } = await Location.requestForegroundPermissionsAsync();    
        if(status !== 'granted'){
          return Alert.alert("Permission required", 
          "This app needs access to your location. Please enable it under Phone Settings / Applications / Permissions / locate")
        }
        
        let coordinates = await Location.getCurrentPositionAsync(
          { accuracy: Location.Accuracy.High, distanceInterval: 10 });
    
        if(coordinates) { 
    
          mapViewRef.current = {
            region : {
              latitude: coordinates.coords.latitude,
              longitude: coordinates.coords.longitude, 
              latitudeDelta: 0.002,
              longitudeDelta: 0.0001,
            }
          }
        }
        setMarker();
    })()
  }, [])


  return (
    <View style={{flex: 1}}>

      {!markerLoc.latitude && ( <Loading /> )}

      { markerLoc.latitude && (
        <View style={styles.container}>
        
          <MapView provider={PROVIDER_GOOGLE}   
            style={styles.map}
            region={mapViewRef.current.region} >

            <Marker coordinate={{latitude: markerLoc.latitude, longitude: markerLoc.longitude}} />
          </MapView>
        </View>
      )}
    </View>
  )
}


const styles = StyleSheet.create({
  container:{
    //...StyleSheet.absoluteFillObject,
    width: Dimensions.get('window').width,
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#9999'
  },

  map: {
    ...StyleSheet.absoluteFillObject,
  },
  
});
