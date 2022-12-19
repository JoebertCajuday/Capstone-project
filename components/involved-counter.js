import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import { Feather } from '@expo/vector-icons';


export default function InvolvedCounter ({counter=()=>{}}) {

  const [count, setCount] = useState(0);

  return(
    <View style={styles.container}>

      <View style={styles.header}>
        <Text style={{fontSize: 20}}> Number Of Involved </Text>
      </View>
        
      <View style={styles.body}>
        <Text style={{fontSize: 30,}}> {count} </Text>
        
        <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
          <TouchableOpacity style={styles.btn} 
          onPress={()=> { 
            setCount(count + 1)
            counter(count + 1)
            }} >

            <Feather name="plus" size={30} color="black" />
          </TouchableOpacity>


          <TouchableOpacity style={styles.btn} 
          onPress={()=> { if(count !== 0) {
            setCount(count - 1) 
            counter(count - 1)
            }}} >

            <Feather name="minus" size={30} color="black" />
          </TouchableOpacity>
        </View>
      </View> 
    </View>
  );
}


const styles = StyleSheet.create({

  container: {
    width: '100%',
    borderWidth: 1,
    borderRadius: 5, borderColor: '#9999',
    marginVertical: 5,
  }, 

  header: {
    padding: 10, 
    borderBottomWidth: 1, 
    borderColor: '#9999', 
    backgroundColor: '#cceeff',
  },

  body: {
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    padding: 10, 
    alignItems: 'center'
  },

  btn: {
    padding: 10,
    borderWidth: 1,
    borderRadius: 5,
    borderColor: '#9999',
    marginHorizontal: 5,
  },

});