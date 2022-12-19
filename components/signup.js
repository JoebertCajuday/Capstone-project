import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, 
  ScrollView, Keyboard, Alert } from 'react-native';
//import * as SecureStore from 'expo-secure-store';
import getBrgy, { getDept } from '../queries/fetch-brgy';
import supabase from '../lib/supabase';

import BouncyCheckbox from 'react-native-bouncy-checkbox';
import SelectList from 'react-native-dropdown-select-list';
import LoadingScreen, { Loading } from './loading';

import CustomInput from './custominput';
import IdPicker from './idProcessor';
import TermsConditions from './termsConditions';

import { globalStyles } from './globalstyle';
import upload_id, { fetchImgUrl } from '../queries/image-upload';
import insertToProfile, { insertToResponders, insertToUnames } from '../queries/post-user';
import { queryClient } from '../lib/global-utils';


export default function SignUp() {

  /** Fetch
   * Barangays
   * Departments
   * 
   * Fill up => register to auth => upload id => insert to respo => insert name => insert profile
   */

  const { data: departments, isSuccess, isLoading } = getDept()

  const [brgy, setBrgy] = useState([]);
  const [dept, setDept] = useState([])

  const [isReady, setIsReady] = useState(false)

  const [responder, setResponder] = useState(false); // Toggler Value
  const [modal, setModal] = useState(false); // For Terms and Condition

  const [loading, setLoading] = useState(false); // For Loading screen
  const [errors, setErrors] = useState({}); // For error checking

  const [inputs, setInputs] = useState({
    firstName: null,    
    middleName: null,
    lastName: null,     
    barangay: null,
    mobileNumber: null,
    email: null, 
    password: null,
    isResponder: null,  
    department: null,
    idFront: null,      
    idBack: null,
  })

  const handleOnchange =(text,input)=> setInputs(prevState =>({...prevState, [input]: text}));
  const handleError =(error,input) => setErrors(prevState =>({...prevState, [input]: error}));

  const showTerms = () => setModal(true)


  const getBarangays = async () => {
    const brgys = await queryClient.getQueryData({queryKey: ['getBrgys']})
    if(brgys){ brgys.map( obj => setBrgy(name => [...name, {key: obj.id, value: obj.brgy_name}])) }

    setIsReady(true)
  }


  useEffect( () => {
    (async ()=> {
      if(departments){ 
        departments.map(obj => setDept(name => [...name, {key: obj.id, value: obj.dept_name}]))
        getBarangays() 
      } 
    })()
  }, [departments]) 


  const insert = async (user_id) => { // Insert data to profile

    let responderRef;
    
    if(inputs.isResponder){  // insert to responders
      let frontImage = await upload_id(inputs.idFront, user_id)
      let backImage = await upload_id(inputs.idBack, user_id)

      if(!frontImage || !backImage){ setLoading(false) 
        return Alert.alert('Failed to upload Image', 'Please try again later')
      }
      else{
        let frontImgUrl = await fetchImgUrl(frontImage.path)
        let backImgUrl = await fetchImgUrl(frontImage.path)

        const responderObj = {
          user_id:      user_id, 
          department:   inputs.department?? null,
          front_id:     frontImgUrl?.publicUrl?? null,
          back_id:      backImgUrl?.publicUrl?? null,
        }

        let responderResult = await insertToResponders(responderObj)

        if(responderResult?.error){setLoading(false)
          return Alert.alert('Failed to create profile', 'Please try again later')
        }

        responderRef = responderResult 
      } 
    }


    // insert to username
    const usernameObj = {
      user_id:      user_id, 
      fname:        inputs.firstName?? null,
      mname:        inputs.middleName?? null,
      lname:        inputs.lastName?? null,
      fullname:     `${inputs.firstName} ${inputs.middleName} ${inputs.lastName}`
    }

    let usernameResult = await insertToUnames(usernameObj)
    if(usernameResult?.error){
      setLoading(false)
      return Alert.alert('Failed to create profile', `Please try again later`)
    }


    // insert to username
    const userprofileObj = {
      user_id:      user_id, 
      username:     usernameResult?.user_id?? null,
      barangay:     inputs.barangay?? null,
      number:       inputs.mobileNumber?? null,
      responder:    responderRef?.id?? null,
      role:         inputs.isResponder ? 2 : 1,
    }

    let userprofileResult = await insertToProfile(userprofileObj)
    if(userprofileResult?.error){
      setLoading(false)
      return Alert.alert('Failed to create profile', `Please try again later`)
    }

    const {data, error} = await supabase.from('social').insert([{number: inputs.mobileNumber}])
      
    setLoading(false)

    return Alert.alert( 
      "Registration Successful",
      "An email verification will be sent shortly. Please verify your account with the link that will be provided"
    )
  }


  const signUser = async () => { // Sign up the user
    
    const { data, error } = await supabase.auth.signUp({
      email: inputs.email, password: inputs.password })
    
    if(error){ setLoading(false);
      return Alert.alert('Failed', 'An error occured. Please try again later') 
    }

    insert(data.user.id);
  }

  const register = async () => {
    
    setModal(false) 
    setLoading(true)

    // Check if number is not taken

    let { data, error } = await supabase
    .from('social')
    .select('*')
    .match({ number: inputs.mobileNumber })

    let num = false;
    data.map( obj => { num = obj; })

    if(error){ setLoading(false)
       return Alert.alert("Request failed ", 'An error occured. Please try again later' ) 
      }

    if(num){ setLoading(false)
      handleError('*Please use a different number', 'mobileNumber') 
    }

    else signUser() 
  }


  function validate() {
    Keyboard.dismiss();
    let isValid = true

    if(!inputs.firstName) { 
      handleError('    This field is required', 'firstName') 
      isValid = false
    }

    if(!inputs.middleName) { 
      handleError('    This field is required', 'middleName') 
      isValid = false
    }

    if(!inputs.lastName) { 
      handleError('    This field is required', 'lastName')
      isValid = false 
    }

    if(inputs.mobileNumber?.length < 10 || inputs.mobileNumber?.length > 10 ){ 
      handleError('    Invalid number', 'mobileNumber') 
      isValid = false
    }
    if(inputs.mobileNumber && inputs.mobileNumber[0] !== '9') { 
      handleError('    Number must start with 9', 'mobileNumber')
      isValid = false 
    }
    if(!inputs.mobileNumber) { 
      handleError('    Invalid number', 'mobileNumber')
      isValid = false 
    }

    if (!inputs.email) { 
      handleError('    Please input email', 'email') 
      isValid = false
    } 
    else if (!inputs.email.match(/\S+@\S+\.\S+/)) { 
      handleError('    Please input a valid email', 'email')
      isValid = false 
    }  

    if(inputs.password?.length < 8) { 
      handleError('    Must be atleast 8 characters long', 'password') 
      isValid = false
    }
    if(!inputs.password) { 
      handleError('    Password is required', 'password') 
      isValid = false
    }

    if(!inputs.barangay) { 
      handleError('    Please select your barangay', 'barangay') 
      isValid = false
    }

    if(responder){
      if(!inputs.department) { 
        handleError('    Please select your department', 'department') 
        isValid = false
      }
      if(!inputs.idFront) { 
        handleError('    Image is required', 'idFront') 
        isValid = false
      }
      if(!inputs.idBack) { 
        handleError('    Image is required', 'idBack')
        isValid = false 
      }
    }

    if(isValid) {
      // change select inputs to corresponding ids
      //dept.map(obj=>{return obj.value === inputs.department ? handleOnchange(obj.key, 'department') : null })

      if(responder) { handleOnchange(responder, 'isResponder') }
      // Change inputs.mobile number to unicode format
      handleOnchange('+63' + inputs.mobileNumber, 'mobileNumber')

      showTerms();
    }
  }


  return (
    <View style={[styles.container, {flex:1}]}>

      {!isReady && ( <Loading />)}

      { isReady && ( <>
        <TermsConditions  visible={modal}     toggleModal={val => setModal(val)}     
          agreed={() => register() } />

        <LoadingScreen visible={loading}/>

        <ScrollView style={{width: '100%', flex: 6, marginBottom: 5}}>

          { errors.success && (
            <View style={{padding: 10, backgroundColor: '#b3ffff'}}>
              <Text style={{fontSize: 16, alignSelf: 'center'}}> { errors.success } </Text>
            </View>
          )}

          <CustomInput    label="First Name"    value={inputs.firstName}
            onChangeText={text => handleOnchange(text, 'firstName')} 
            onFocus={() => handleError(null, 'firstName')}
            error={errors.firstName} />

          <CustomInput    label="Middle Name"   value={inputs.middleName}
            onChangeText={text => handleOnchange(text, 'middleName')} 
            onFocus={() => handleError(null, 'middleName')}
            error={errors.middleName} />

          <CustomInput    label="Last Name"   value={inputs.lastName}
            onChangeText={text => handleOnchange(text, 'lastName')} 
            onFocus={() => handleError(null, 'lastName')}
            error={errors.lastName} />
        
          <View style={globalStyles.textInputWrapper}>

            <SelectList     data={brgy}   placeholder='Select Barangay'
              setSelected={text => setInputs(prevState =>({...prevState, ['barangay']: text}))} 
              onSelect={() => { handleError(null, 'barangay') }}
              boxStyles={[styles.box_style, { borderColor: errors['barangay'] ? '#ff6666' : '#9999',}]} 
            />
          </View>

          <CustomInput    label="Mobile Number"   value={inputs.mobileNumber}
            onChangeText={text => handleOnchange(text, 'mobileNumber')} 
            onFocus={() => handleError(null, 'mobileNumber')}
            error={errors.mobileNumber}   keyboardType='numeric' 
            placeholder="9..."   mobileNumber />

          <CustomInput    label="Email"    value={inputs.email}
            onChangeText={text => handleOnchange(text, 'email')} 
            onFocus={() => handleError(null, 'email')}
            error={errors.email} />

          <CustomInput    label="Password"    value={inputs.password}
            onChangeText={text => handleOnchange(text, 'password')} 
            onFocus={() => handleError(null, 'password')}
            error={errors.password}   password />


          <View style={[globalStyles.textInputWrapper, {padding:5, flexDirection:'row', alignItems:'center'}]}>
            <BouncyCheckbox  size={25}  fillColor="black"  unfillColor="#FFFFFF"
              innerIconStyle={{ borderWidth: 2 }}   textStyle={globalStyles.check_box}
              onPress={(isChecked) => 
                { // Set value to true / false
                  setResponder(isChecked); 
                  
                  // remove error handler if toggler is hidden
                  if(!isChecked){  
                    handleOnchange('', 'department');
                    handleOnchange('', 'idFront');
                    handleOnchange('', 'idBack');

                    handleError(null, 'department');
                    handleError(null, 'idFront');
                    handleError(null, 'idBack');
                  } 
                }} />

            <Text>Responders Account?</Text>
          </View>  

          {responder && (
            <View>
              <View style={globalStyles.textInputWrapper}>
                <SelectList 
                  setSelected={text => setInputs(prevState =>({...prevState, ['department']: text}))} 
                  onSelect={() => { handleError(null, 'department') }}
                  data={dept}   placeholder='Select Department'
                  boxStyles={[styles.box_style, { borderColor: errors['department'] ? '#ff6666' : '#9999', }]}
                />
              </View>
      
              <View style={globalStyles.infoContainer} >
                <Text style={{fontSize: 16,}}>
                  We need to verify your identity using your ID. 
                  Please present any Government Issued ID. </Text>
              </View>  

              <IdPicker label="ID ( Front )" 
                onSelect={text => handleOnchange(text, 'idFront')}
                removeError={text => handleError(text, 'idFront')}
                data={inputs.idFront?.uri}
                error={errors.idFront}
              />

              <IdPicker label="ID ( Back )"
                onSelect={text => handleOnchange(text, 'idBack')}
                removeError={text => handleError(text, 'idBack')} 
                data={inputs.idBack?.uri}
                error={errors.idBack}
              />
            </View>
          )} 
            
        </ScrollView>

        <View style={globalStyles.btnContainer}>
          <TouchableOpacity style={globalStyles.loginBtn}  onPress={() => validate() }>
            <Text style={{fontSize: 20, color: '#fff', fontWeight: 'bold'}}> Register</Text>
          </TouchableOpacity>
        </View>
      </>)}  
    </View>     
  )
}

const styles = StyleSheet.create({

  container: { width: '100%' },

  box_style: {
    height: 40, 
    borderRadius: 5, 
    alignItems: 'center', 
    paddingVertical: 0, 
    marginTop: 10,
  }, 
  
  idInput: {
    height: 40, 
    borderWidth: 1, 
    borderColor: '#9999', 
    borderRadius: 5,
    justifyContent: 'center',
    padding: 5,
  },
});
