import React, {useState, useEffect} from 'react';
import { StyleSheet, Text, View, ActivityIndicator} from 'react-native';
import getProfile from '../queries/fetch-profile';

export default function Profile({ navigation }) {

  const { data: user, isSuccess, isLoading } = getProfile();

  /**
   * {"accStatus": {"id": 1, "status_name": "Allowed"}, "account_status": 1, "barangay": 5, 
   * "brgy": {"brgy_name": "Balogo", "id": 5}, "created_at": "2022-12-13T13:16:27.888281+08:00",
   * "id": 30, "number": "+639662177645", "respo": {"back_id": "https://vxtdvbgqcnzxevlqgqmx.supabase.co/storage/v1/object/public/public-bucket/d0103fe2-c140-4a73-a1bc-143fa44b94b2/7db3232a-1c2a-4cc2-bb20-3bf0dd1ed9c7.jpeg",
   * "department": 1, "front_id": "https://vxtdvbgqcnzxevlqgqmx.supabase.co/storage/v1/object/public/public-bucket/d0103fe2-c140-4a73-a1bc-143fa44b94b2/7db3232a-1c2a-4cc2-bb20-3bf0dd1ed9c7.jpeg",
   * "id": 30, "user_id": "d0103fe2-c140-4a73-a1bc-143fa44b94b2", "verif_status": 1}, "responder": 30,
   * "role": 2, "userRole": {"id": 2, "role": "Responder"}, "user_id": "d0103fe2-c140-4a73-a1bc-143fa44b94b2", 
   * "username": {"fname": "Joebert", "fullname": "Joebert Dilao Cajuday", "lname": "Cajuday", "mname": "Dilao", "user_id": "d0103fe2-c140-4a73-a1bc-143fa44b94b2"}}
   */

  useEffect( ()=> {
    //console.log(data)
  }, [user])

  return (
    <View style={styles.container}>

      {isLoading && ( <ActivityIndicator /> )}

      {isSuccess && (
        <View style={{flex: 1}}>
          <View style={styles.fields}>
            <Text style={{fontSize: 18}}>{`Name :  ${user?.username?.fullname}`}</Text>
          </View>

          <View style={styles.fields}>
            <Text style={{fontSize: 18}}>{`Number : ${user?.number}`}</Text>
          </View>

          <View style={styles.fields}>
            <Text style={{fontSize: 18}}>{`Address:  ${user?.brgy?.brgy_name}`}</Text>
          </View>

          <View style={styles.fields}>
            <Text style={{fontSize: 18}}>{`Account Status: ${user?.accStatus?.status_name}`}</Text>
          </View>

          <View style={styles.fields}>
            <Text style={{fontSize: 18}}>{`Role :  ${user?.userRole?.role}`}</Text>
          </View>

          {user?.role && user?.role === 2 && (
            <>
              <View style={styles.fields}>
                <Text style={{fontSize: 18}}>{`Department: ${user?.respo?.dept?.dept_name}`}</Text>
              </View>

              <View style={styles.fields}>
                <Text style={{fontSize: 18}}>{`Verification status: ${user?.respo?.verification?.status}`}</Text>
              </View>
            </>
          )}

        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },

  fields: {
    margin: 10,
  }
});
