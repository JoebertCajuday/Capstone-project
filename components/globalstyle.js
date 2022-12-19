import { StyleSheet } from 'react-native';

export const globalStyles = StyleSheet.create({
  
  textInputWrapper: {//
    width: '100%',            
    justifyContent: 'flex-start', 
    marginVertical: 5,
  },
  
  
  loginBtn: { //
    width: '100%', 
    backgroundColor: '#0066cc', 
    borderRadius: 4,
    padding: 10,
    justifyContent: 'center', 
    alignItems: 'center',
  },

  loginTxt: { //
    fontSize: 20, color: '#fff', fontWeight: 'bold',
  },


  btnContainer: { //
    width: '100%', 
    justifyContent:'center', 
    alignItems:'center',
  },

  infoContainer: { //
    padding: 10,                      
    borderRadius: 5, 
    borderWidth: 1,                   
    borderColor: '#9999', 
    backgroundColor: '#cce6ff',       
    marginTop: 10,
  }

});

export const Colors = StyleSheet.create({

  bgPrimary: { backgroundColor: '#ff6666' },
  bgSecondary: { backgroundColor: '#0066cc'},

});