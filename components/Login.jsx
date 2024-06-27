import { Pressable, StyleSheet, Text, View, TextInput, Alert } from 'react-native'
import React, { useEffect, useState } from 'react'
import auth from '@react-native-firebase/auth'
import { GoogleSignin } from '@react-native-google-signin/google-signin'
const Login = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  function loginfunc() {
    auth().signInWithEmailAndPassword(email, password).then((res) => {
      // console.log(res)
      Alert.alert("Logged in succesfully")
      setEmail('');
      setPassword('');
      navigation.navigate('Todos');
    }).catch((error) => {
      console.log(error)
      Alert.alert(error.nativeErrorMessage)
    })
  }
  useEffect(() =>{
      GoogleSignin.configure({
        webClientId: '21431401143-gpq5ri9vf944jim2au1gn5cgv4s3qksi.apps.googleusercontent.com'
      })
  },[])
  async function onGoogleButtonPress() {
    // Check if your device supports Google Play
    await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
    // Get the users ID token
    const { idToken } = await GoogleSignin.signIn();
  
    // Create a Google credential with the token
    const googleCredential = auth.GoogleAuthProvider.credential(idToken);
  
    // Sign-in the user with the credential
    return auth().signInWithCredential(googleCredential);
  }
  
  return (
    <View style={{ width: '100%', justifyContent: 'center', alignItems: 'center', height: '80%' }}>
      <View >
        <TextInput style={styles.input} placeholder='Email' value={email} onChangeText={setEmail} />
        <TextInput style={styles.input} placeholder='Password' value={password} onChangeText={setPassword} secureTextEntry={true} />
        <Pressable style={styles.btn} onPress={loginfunc}><Text style={{ fontSize: 17, color: 'white', fontWeight: 'bold' }}>Login</Text></Pressable>
        <View style={{ flexDirection: 'row', marginTop: 10 }}>
          <Text>Don't have an account? </Text>
          <Pressable onPress={() => navigation.navigate('Signup')}><Text style={{ color: '#5D3FD3' }}>Signup</Text></Pressable>
        </View>
        <Pressable onPress={onGoogleButtonPress}><Text style={{ color: '#5D3FD3' }}>Sign in with google</Text></Pressable>
      </View>
    </View>
  )
}

export default Login

const styles = StyleSheet.create({
  input: {
    marginTop: 10,
    width: 350,
    height: 50,
    borderColor: 'black',
    borderWidth: 1,
    borderRadius: 5,
    paddingLeft: 10

  },
  btn: {
    height: 50,
    backgroundColor: '#5D3FD3',
    marginTop: 10,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center'
  }
})