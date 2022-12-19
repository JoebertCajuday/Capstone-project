import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import getReports, { getRprt } from '../queries/fetch-reports';
//import { queryClient } from '../lib/global-utils';
import supabase from '../lib/supabase';
import { Loading } from '../components/loading';


const ReportContainer = ({reload, ...props}) => {
  const navigation = useNavigation();

  const [report, setReport] = useState(null)

  // get report by id
  async function getData() {
    const data = await getRprt(props.reportId)
    if(data) { setReport(data) }
  }

  useEffect( () => { getData() }, [reload])


  return(
    <>
      {report && (

        <TouchableOpacity onPress={()=> navigation.navigate('Report Details', {reportId: props.reportId})}
          style={[styles.box, { backgroundColor: report.status === 1 ? color_codes.primary : 
            report.status === 2 ? color_codes.secondary : 
            report.status === 3 ? color_codes.tertiary : color_codes.rejected }]} >
    
          <View style={styles.row}>
            <Text style={[styles.title, {color: report.status === 1 ? '#000': '#fff'}]}>{report.repType.type_name}</Text>
            <Text style={[styles.title, {color: report.status === 1 ? '#000': '#fff'}]}>{report.repStatus.status}</Text>
          </View>
    
          <View style={styles.row}>
            <Text style={{color: report.status === 1 ? '#000': '#fff'}}>{`${report.brgyName.brgy_name}`}</Text>
            <Text style={{color: report.status === 1 ? '#000': '#fff'}}>
              {`${report.created_at.substring(0, 10)}  ${report.created_at.substring(11, 16)}`}</Text>
          </View>
        </TouchableOpacity> 
      )}
    </>
  )
}




export default function Reports({navigation, route}) {

  const [data, setData] = useState(null)
  const [reload, setReload] = useState(false)

  async function getData() {
    const data = await getReports()
    if(data) { setData(data) }
  }

  useEffect( ()=> { getData() }, [])

  // subscribe to all realtime events
  useEffect( () => {
      
  const reports = supabase.channel('custom-all-channel')
  .on(
    'postgres_changes',
    { event: '*', schema: 'public', table: 'reports' },
    (payload) => {
      if(payload.eventType === 'INSERT'){ //setData(name => [...name, payload.new])
        setData(name => [payload.new, ...name])
      }

      else setReload(payload.new)
    }
  )
  .subscribe()

  return () => { supabase.removeChannel(reports) }
  }, [])



  return(
    <View style={styles.container}>

      {!data && ( <Loading /> )}

      {data && (
        <ScrollView>
          {data.map( obj => {
              return (<ReportContainer key={`${obj.id}`} reportId={obj.id} reload={reload}/>)
            }) 
          }        
        </ScrollView>
      )}
    </View>
  )
}

const color_codes = {
  primary : '#ffffff', // For verif
  secondary: '#0033cc', // Verified 
  tertiary: '#009900', // Report resolved
  rejected: '#ff6666',
}    

const styles = StyleSheet.create({

  container: { flex: 1, padding: 10,},

  box: {
    borderWidth: 0.5,
    borderRadius: 5, borderColor: '#9999',
    padding: 10, 
    marginVertical: 5,
  }, 

  title: { fontSize: 18, }, 

  row: { flexDirection: 'row', justifyContent: 'space-between', }
});
