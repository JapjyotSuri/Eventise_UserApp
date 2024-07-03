import { Pressable, StyleSheet, Text, View, TextInput, Alert, Image } from 'react-native'
import React, { useEffect, useState } from 'react'
import auth, { firebase } from '@react-native-firebase/auth'
import { GoogleSignin } from '@react-native-google-signin/google-signin'
import AsyncStorage from '@react-native-async-storage/async-storage'
import firestore from '@react-native-firebase/firestore'

import { Formik } from 'formik'

const Login = ({ navigation }) => {

    async function loginfunc(values) {
        try {
            const currentUser = await auth().signInWithEmailAndPassword(values.email, values.password);
            const user = currentUser.user;
            const data = await firestore().collection('users').doc(user.uid).get();
            console.log(data._data);
            AsyncStorage.setItem('KeepLoggedIn', JSON.stringify(true))
            AsyncStorage.setItem('Token', JSON.stringify(data._data))
            Alert.alert("Logged in succesfully")
            navigation.navigate('Home');
        }

        catch (error) {
            console.log(error)
            Alert.alert(error.nativeErrorMessage)
        }
    }
    function resetPassword(values) {
        const user = auth().currentUser;
        firebase.auth().sendPasswordResetEmail(values.email).then(() => {
            Alert.alert("Password reser email sent")
        }).catch((error) => {
            console.log(error)
        })
    }
    useEffect(() => {
        GoogleSignin.configure({
            webClientId: '21431401143-gpq5ri9vf944jim2au1gn5cgv4s3qksi.apps.googleusercontent.com'
        })
    }, [])
    async function onGoogleButtonPress() {
        // Check if your device supports Google Play
        await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
        // Get the users ID token
        const { idToken } = await GoogleSignin.signIn();

        // Create a Google credential with the token
        const googleCredential = auth.GoogleAuthProvider.credential(idToken);

        // Sign-in the user with the credential
        await auth().signInWithCredential(googleCredential);
        const user = auth().currentUser;
        // console.log(user);
        // const data=await firestore().collection('users').doc(user.uid).get();
        // console.log(data._data);
        await AsyncStorage.setItem('KeepLoggedIn', JSON.stringify(true));
        // console.log(user);
        await firestore().collection('users').doc(user.uid).set({

            uid: user.uid,
            name: user.displayName,
            email: user.email,
            role: 1,
            isEmailVerified: user.emailVerified,


        })
        navigation.navigate('Home');


    }

    return (

        <View style={{ flex: 1,justifyContent: 'center', alignItems: 'center' }}>
            
            <Formik
                initialValues={{ email: '', password: '' }}

                onSubmit={(values) => {
                    console.log(values)
                    loginfunc(values);
                    navigation.navigate('Login')
                }}
            >
                {({
                    values,
                    errors,
                    touched,
                    handleChange,
                    handleSubmit,

                }) => (
                    <View style={{justifyContent: 'center',alignItems: 'center'}}>

                        <View>
                            <TextInput style={styles.input} placeholder='Email' value={values.email} onChangeText={handleChange('email')} />
                        </View>

                        <View>
                            <TextInput style={styles.input} placeholder='Password' value={values.password} onChangeText={handleChange('password')} secureTextEntry={true} />
                        </View>

                        <View>
                            <Pressable style={styles.btn} onPress={handleSubmit}><Text style={{ fontSize: 17, color: 'white', fontWeight: 'bold' }}>Login</Text></Pressable>
                            <View style={{ flexDirection: 'row', marginTop: 10 }}>
                                <Text>forgot password? </Text>
                                <Pressable onPress={() => resetPassword(values)}><Text style={{ color: '#5D3FD3' }}>reset password</Text></Pressable>
                            </View>
                            <View style={{ flexDirection: 'row', marginTop: 10 }}>
                                <Text>Don't have an account? </Text>
                                <Pressable onPress={() => navigation.navigate('Signup')}><Text style={{ color: '#5D3FD3' }}>Signup</Text></Pressable>
                            </View>
                            
                            <Pressable onPress={onGoogleButtonPress}><Text style={{ color: '#5D3FD3' }}>Sign in with google</Text></Pressable>
                        </View>
                    </View>
                )}
            </Formik>
        </View>



        // <View style={{ width: '100%', justifyContent: 'center', alignItems: 'center', height: '80%' }}>
        //   <View >
        //     <TextInput style={styles.input} placeholder='Email' value={email} onChangeText={setEmail} />
        //     <TextInput style={styles.input} placeholder='Password' value={password} onChangeText={setPassword} secureTextEntry={true} />
        //     <Pressable style={styles.btn} onPress={loginfunc}><Text style={{ fontSize: 17, color: 'white', fontWeight: 'bold' }}>Login</Text></Pressable>
        //     <View style={{ flexDirection: 'row', marginTop: 10 }}>
        //       <Text>forgot password? </Text>
        //       <Pressable onPress={() => resetPassword()}><Text style={{ color: '#5D3FD3' }}>reset password</Text></Pressable>
        //     </View>
        //     <View style={{ flexDirection: 'row', marginTop: 10 }}>
        //       <Text>Don't have an account? </Text>
        //       <Pressable onPress={() => navigation.navigate('Signup')}><Text style={{ color: '#5D3FD3' }}>Signup</Text></Pressable>
        //     </View>
        //     <Image></Image>
        //     <Pressable onPress={onGoogleButtonPress}><Text style={{ color: '#5D3FD3' }}>Sign in with google</Text></Pressable>
        //   </View>
        // </View>
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