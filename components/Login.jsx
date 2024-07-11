import { Pressable, StyleSheet, Text, View, TextInput, Alert, Image, ImageBackground, Dimensions } from 'react-native'
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
            console.log(user);
            const data = await firestore().collection('users').doc(user.uid).get();

            console.log(data);
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
        try{
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
        catch(error){
            console.log(error)
        }

    }

    return (

        <View style={{ flex: 1 ,}}>
            <View style={{justifyContent: 'flex-start',alignItems: 'center'}}>
            <Image source={require('./LoginSignupBackgroundNobg.png')} style={styles.image}></Image>
            </View>
            <Text style={{ fontSize: 25, fontWeight: 'bold',color: '#5D3FD3',marginLeft: 20, marginBottom: 10}}>Welcome back!!!!</Text>
            
             <View style={{flex: 1,}}> 
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
                    <View style={{ justifyContent: 'center', alignItems: 'center', width: '100%',}}>

                        <View>
                            <TextInput style={styles.input} placeholder='Email' value={values.email} onChangeText={handleChange('email')} />
                        </View>

                        <View>
                            <TextInput style={styles.input} placeholder='Password' value={values.password} onChangeText={handleChange('password')} secureTextEntry={true} />
                        </View>

                        <View style={{ width: '100%' ,marginLeft: 50}}>
                            <View style={{ flexDirection: 'row', marginTop: 10 }}>
                                <Text>forgot password? </Text>
                                <Pressable onPress={() => resetPassword(values)}><Text style={{ color: '#5D3FD3' } }>reset password</Text></Pressable>
                            </View>
                            <Pressable style={styles.btn} onPress={handleSubmit}><Text style={{ fontSize: 17, color: 'white', fontWeight: 'bold', }}>Login</Text></Pressable>

                            <View style={{ flexDirection: 'row', marginTop: 10, alignItems: 'flex-start', justifyContent: 'flex-start' }}>
                                <Text>Don't have an account? </Text>
                                <Pressable onPress={() => navigation.navigate('Signup')}><Text style={{ color: '#5D3FD3' }}>Signup</Text></Pressable>
                            </View>
                            <View style={{ width: '100%', justifyContent: 'center', alignItems: 'center', marginVertical: 5 }}>
                                
                            </View>
                            <Pressable onPress={onGoogleButtonPress} style={styles.btn}>
                                <View style={{flex: 1,flexDirection: 'row',justifyContent: 'center', alignItems: 'center' , gap: 15}}>
                                <Image source={require('./googleLogin.png')} style={{height: 25,width: 25}}></Image>
                                <Text style={{ color: 'white', fontSize: 17, fontWeight: 'bold' }}>Log in with Google</Text>
                                </View>
                                </Pressable>
                        </View>
                    </View>
                )}
            </Formik>
            </View>
        </View>


        //Code written using normal form 
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
        width: 350,
        backgroundColor: '#5D3FD3',
        marginTop: 10,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center'
    },
    image: {
        height: 340,
        width: 340,
    },
    
   
})