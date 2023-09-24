import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, ScrollView} from 'react-native';




export default function OptionalMessage ({onChange = () => {}}) {

  return(
    <View style={styles.container}>
        <View style={styles.header}>
            <Text style={{fontSize: 20}}> Message </Text>
            <Text style={styles.optional}> Optional </Text>
        </View>

        <ScrollView style={styles.textContainer}>
            <TextInput multiline style={styles.input} onChangeText={text => onChange(text)}
            />
        </ScrollView>
        
    </View>
  );
}

const styles = StyleSheet.create({

    container: {
        width: '100%',
        maxHeight: 200,
        borderWidth: 1,
        borderColor: '#9999', borderRadius: 5,
        marginVertical: 5, 
    }, 

    header: {
        flexDirection: 'row',
        alignItems: 'center',
        borderBottomWidth: 1,
        padding: 8,
        borderColor: '#9999',
        backgroundColor: '#cceeff'
    },

    optional: {
        padding: 5,
        marginLeft: 10,
        backgroundColor: '#ff6666',
        borderRadius: 2,
        opacity: 0.8,
    },

    textContainer: {
        padding: 10,
    },

    input: {
        borderBottomWidth: 1,
        borderColor: '#9999',
        padding: 3,
        fontSize: 16,
    }
});