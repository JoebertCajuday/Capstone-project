import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, StatusBar, Keyboard } from 'react-native';
//import * as SecureStore from 'expo-secure-store';

///////////////////////////////////////////////////////////

import supabase from '../lib/supabase';

import SignUp from '../components/signup';
import CustomInput from '../components/custominput';
import LoadingScreen from '../components/loading';
//import { useNavigation } from '@react-navigation/native';

import { globalStyles } from '../components/globalstyle';


export default function Login() {

  //const navigation = useNavigation();
  // toggler for login / sign up buttons
  const [toggleValue, setToggleValue] = useState('login'); 
  

  // Login Screen component
  const SignIn = () => {   
    
    const [inputs, setInputs] = useState({ email: '', password: '' });
    const [errors, setErrors] = useState({});

    const [loading, setLoading] = useState(false);
  
    // Methods 
    const handleOnchange =(text,input)=> setInputs(prevState =>({...prevState, [input]: text}));
    const handleError =(error,input) => setErrors(prevState =>({...prevState, [input]: error}));


    const logIn = async () => {
      setLoading(true);
  
      const { data, error } = await supabase.auth.signInWithPassword({
        email: inputs.email, password: inputs.password, })

      if(error){ handleError(`Email / password don't match`, 'invalidCredential');}

      setLoading(false)
    }

    function validate() {
      Keyboard.dismiss();
      let isValid = true
  
      if (!inputs.email) {
        handleError('    * Please input email', 'email');
        isValid = false;
      } else if (!inputs.email.match(/\S+@\S+\.\S+/)) {
        handleError('    * Please input a valid email', 'email');
        isValid = false;
      }  

      if(!inputs.password) { 
        handleError('    * Password is required', 'password'); isValid = false 
      }
      
      if(isValid) logIn();
    }


    return (
      
      <View style={{ flex: 1}}>

        <LoadingScreen visible={loading}/>

        <View style={{ flex: 1, marginTop: 50}}>

          {errors.invalidCredential && (
            <View style={{padding: 10, alignItems: 'center', backgroundColor: '#ff6666', borderRadius: 5}}>
              <Text style={{fontSize: 18, color: '#fff'}}> {errors.invalidCredential} </Text>
            </View>
          )}
        
          <CustomInput    label="Email"    value={inputs.email}
            onChangeText={text => handleOnchange(text, 'email')} 
            onFocus={() => handleError(null, 'email')}
            error={errors.email} />

          <CustomInput    label="Password"    value={inputs.password}
            onChangeText={text => handleOnchange(text, 'password')} 
            onFocus={() => handleError(null, 'password')}
            error={errors.password} password 
          />

        </View>
        
  
        <TouchableOpacity style={[globalStyles.loginBtn, {marginTop: 25}]} onPress= {validate}>
          <Text style={globalStyles.loginTxt}>Continue</Text>
        </TouchableOpacity>
      </View> 
    );
  }


  return (
    
    <View style={styles.container}>
      <View style={{flex: 1}}>

        <Text style={styles.banner}> Account Setup </Text>
        
        <View style={styles.authMenu} >
          
          <TouchableOpacity style={styles.authBtn(toggleValue === 'login' ? 'active' : 'pass')} 
          onPress={()=>{ setToggleValue('login') }} >
            <Text style={{fontSize: 20, fontWeight: 'bold', alignSelf: 'center'}}>Login</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.authBtn(toggleValue === 'login' ? 'pass' : 'active')}
          onPress={()=>{ setToggleValue('sign-up') }} >
            <Text style={{fontSize: 20, fontWeight: 'bold', alignSelf: 'center'}}>Sign Up</Text>
          </TouchableOpacity>

        </View>

        { toggleValue === 'login' ? <SignIn/> : <SignUp /> }
        
      </View>
    </View>
  );
}

 const styles = StyleSheet.create({

  container: {
    flex: 1,                  
    backgroundColor: '#fff',
    width: '100%',            
    paddingHorizontal: 15,     
    paddingVertical: StatusBar.currentHeight, 
  },

  banner: {
    fontSize: 25,             
    fontWeight: 'bold', 
    marginVertical: 30,       
    alignSelf: 'center'
  },

  authMenu: {    
    flexDirection: 'row', 
    marginVertical: 10,       
    justifyContent: 'space-around', 
  },
  
  authBtn:(val)=> ({
    width: '46%',             
    paddingVertical: 8,       
    borderRadius: 5, 
    borderWidth: 1,
    backgroundColor: val === "active" ? "#ff6666" : '#fff',
    borderColor: val === 'active' ? '#999' : '#000',
  }),

  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },

});
