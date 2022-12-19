import React, { useState } from 'react';
import { StyleSheet, Text, View, ActivityIndicator} from 'react-native';
import Modal from "react-native-modal";


export default function LoadingScreen({ label, toggleState=()=>{}, ...props }) {
  
  return (

    <Modal isVisible={props.visible} style={styles.modal}>

        <View style={styles.container}>

            {label && (
                <View style={styles.labelContainer}>
                    <Text style={styles.label}> {label} </Text>
                </View>
            )}

            <ActivityIndicator size="large" color='#0033cc' />
        </View> 

    </Modal>
  );
}


export const Loading = () => {
    return (
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <ActivityIndicator size="large" color="#3399ff" />
        </View>
    )
}

const styles = StyleSheet.create({

    modal: {
        justifyContent: 'center',
        alignItems: 'center',
    },

    container: {
        width: '100%',
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 5,
    },

    labelContainer: { marginBottom: 20, },

    label: { fontSize: 18, }

});
