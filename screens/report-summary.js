import { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, Alert, Image} from 'react-native';

import axios from 'axios';
import { Loading } from '../components/loading';
import getProfile from '../queries/fetch-profile';

import * as Print from 'expo-print';
import { shareAsync } from 'expo-sharing';


export default function ReportSummary({ navigation, route }) {

  const { data: user } = getProfile();


  /* Function to open Print API
  const print = async () => {
    // On iOS/android prints the given html. On web prints the HTML from the current page.

    await Print.printAsync({html});
    //const { uri } = await Print.printToFileAsync({ file });
    //console.log('File has been saved to:', uri);
    //await shareAsync(uri, { UTI: '.pdf', mimeType: 'application/pdf' });
    return
  };*/


  // Request data from serverless function
  const fetchData = async () => {

    axios.post(`https://serverless-api-fawn.vercel.app/api/summary?uuid=${user?.user_id}`, {
      //uuid: `${user?.user_id}`
      //firstName: 'Fred',
      //lastName: 'Flintstone'
    })
    .then(async function (response) {
      //console.log(response.data);

      if(response.data.success) {
        //setHtml(response.data.success)
        let html = response.data.success
        //await print(response.data.success);
        await Print.printAsync({html}, Print.Orientation.landscape);
      }
    })
    .catch(function (error) { return Alert.alert('Failed', `${error}`) });
  }


  return (
    <View style={styles.container}>
      {!user && ( <Loading /> )}

      {user && user.respo && (
        <>
          <View style={{flex: 1, padding: 10, justifyContent: 'center', alignItems: 'center'}}>
            <Image source={require('../assets/pdf.png')} style={{width: 150, height: 200}} />
            <Text style={{fontSize: 18, marginTop: 20}}> Print report summary or save it to PDF file </Text>
          </View>

          <TouchableOpacity style={styles.createBtn} onPress={()=> fetchData()}>
            <Text style={styles.cbtn_txt}> Generate Report Summary</Text>
          </TouchableOpacity>
        </>
      )}
      {user && !user.respo && (
        <>
          <View style={{flex: 1, padding: 10, justifyContent: 'center', alignItems: 'center'}}>
            <Image source={require('../assets/pdf.png')} style={{width: 150, height: 200}} />
            <Text style={{fontSize: 18, marginTop: 20}}> Print report summary or save it to PDF file </Text>
            <Text style={{fontSize: 18, marginTop: 20}}>This feature is for responders only</Text>
          </View>

        </>
      )}
     
    </View>
  )
}

const styles = StyleSheet.create({
  container:{ flex: 1, justifyContent: 'flex-end' },

  headerComp: {
    marginBottom: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#9999'
  },

  fieldContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingLeft: 5,
    borderWidth: 1,
    borderColor: '#9999',
    borderRadius: 5,
    marginBottom: 10,
  },

  createBtn: {
    backgroundColor: '#ff6666',
    paddingVertical: 10,
    borderRadius: 4,
    margin: 20,
  },

  cbtn_txt: {
    fontSize: 20,
    //fontWeight: 'bold',
    alignSelf: 'center',
    color: '#FFFFFF',
  }

});