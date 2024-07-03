
import { Alert, Pressable, SafeAreaView, StyleSheet, Text, TextInput, View } from 'react-native'
import React, { useState } from 'react'
import auth from '@react-native-firebase/auth'
import firestore from '@react-native-firebase/firestore'
import * as Yup from 'yup'
//uid, name, email, and role (admin=0/user=1) isEmailVerified).
const Signup = ({ navigation }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('')
    const [confirm, setConfirm] = useState('');
    const [name, setName] = useState('');

    async function signUpFunc() {
        
        if (confirm === password) {
            try {
            const userCredential= await auth().createUserWithEmailAndPassword(email, password)
            console.log('hi')
            const user = userCredential.user;
                const userData = {
                    uid: user.uid,
                    name: name,
                    email: email,
                    role: 1,
                    isEmailVerified: false,

                }
                await firestore().collection('users').doc(user.uid).set(userData);
                Alert.alert("User created " + email)
                setEmail("");
                setPassword("");
                navigation.navigate('Login')
            }
            catch(error){
                console.log(error)
                Alert.alert(error.nativeErrorMessage)
            }
  }

  else {
    Alert.alert('Password does not match')
}
  }
  const PasswordSchema=Yup.object().shape({
    passwordLength: Yup.number()
    .min(4,'Should be min of 4 characters')
    .required('Length is required')
  })
return (
    <View style={{ width: '100%', justifyContent: 'center', alignItems: 'center', height: '80%' }}>
        <TextInput style={styles.input} placeholder='name' value={name} onChangeText={setName} />
        <TextInput style={styles.input} placeholder='Email' value={email} onChangeText={setEmail} />


        <TextInput style={styles.input} placeholder='Password' value={password} onChangeText={setPassword} secureTextEntry={true} />
        <TextInput style={styles.input} placeholder='Confirm Password' value={confirm} onChangeText={setConfirm} secureTextEntry={true} />
        <Pressable style={styles.btn} onPress={signUpFunc}><Text style={{ fontSize: 17, color: 'white', fontWeight: 'bold' }}>Sign up</Text></Pressable>
        <View style={{ flexDirection: 'row', marginTop: 10, justifyContent: 'flex-start' }}>
            <Text>Already have an account? </Text>
            <Pressable onPress={() => navigation.navigate('Login')}><Text style={{ color: '#5D3FD3' }}>Login</Text></Pressable>
        </View>
    </View>
)
}

export default Signup

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
        width: 350,
        backgroundColor: '#5D3FD3',
        marginTop: 10,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center'
    }
})