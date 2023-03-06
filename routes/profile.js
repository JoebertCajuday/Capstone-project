import React from 'react';
import { StyleSheet, Text, View, ActivityIndicator} from 'react-native';
import getProfile from '../queries/fetch-profile';

///////////////////////////////////////////////////////////////

export default function Profile() {

  const { data: user, isSuccess, isLoading } = getProfile();

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
