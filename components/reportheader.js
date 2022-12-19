import React from 'react';
import { StyleSheet, Text, View, Image } from 'react-native';
//import Location from './location';

export default function ReportHeader({ darkmode, type, location, sender, ...props }) {

  return(

    <View style={styles.container}>

      <View style={styles.imgContainer} >
        <Image source={props.imageUri} style={{width: 100, height: 100}}/>
        
      </View>
        
      <View style={styles.detailsContainer} >

        <Text style={styles.txt1}> Type : {type}</Text>

        <Text style={[styles.txt2, {color: darkmode ? '#fff' : '#404040',}]}> Location : {location}</Text>

        <Text style={[styles.txt2, {color: darkmode ? '#fff' : '#404040',}]}> Sender : {sender}</Text>

      </View>
      
    </View>
  );
}


const styles = StyleSheet.create({
  container:{
    flexDirection: 'row',
    alignItems: 'center',
    padding: 5,
    borderWidth: 1, borderRadius: 5, borderColor: '#9999',
    marginVertical: 5,
  },

  imgContainer: {
    width: '30%', 
    justifyContent: 'center', 
    alignItems: 'center',
    padding: 5,
  },

  detailsContainer: {
    width: '70%', 
    justifyContent: 'center', 
    alignItems: 'flex-start',
    padding: 5,
  },

  txt1: {
    fontSize:25, 
    color:'#ff6666', 
    fontWeight: 'bold', 
    marginVertical: 3,
  },

  txt2: {
    fontSize:18,  
    marginVertical: 3,
    marginLeft: 5,
  },
  
});
