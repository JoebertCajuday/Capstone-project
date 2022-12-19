import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, TextInput} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

export default function ProblemDescription({onInput=()=> {} ,...props}) {

  const [inputState, setInputState] = useState(false)

  return(
    <View style={styles.container}>
      
      <TextInput style={styles.input} placeholder='Problem Description'
        multiline 
        onChangeText={text => onInput(text)}
        />
      
      {/*<TouchableOpacity style={{opacity: 1}} 
        onPress={()=>console.log('hello')}
        disabled={!inputState}
      >
          <FontAwesome style={{marginLeft: 5}} name='microphone' size={30} color='black' />
        </TouchableOpacity>*/}

    </View>    
  );
}


const styles = StyleSheet.create({
  container:{
    width: '100%',
    flexDirection: 'row',
    alignItems: 'flex-end',
    padding: 5,
    borderWidth: 1, borderRadius: 5, borderColor: '#9999',
    marginVertical: 5,
    justifyContent: 'space-around',
    fontSize: 16,
  },
  
  input: {
    width: '100%',
    borderBottomWidth: 1, borderColor: '#999',
    fontSize: 16,
    padding: 5,
  },
});
