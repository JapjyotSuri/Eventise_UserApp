import { Pressable, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import firestore from '@react-native-firebase/firestore'
import auth from '@react-native-firebase/auth'
import AsyncStorage from '@react-native-async-storage/async-storage'
const Home = ({navigation}) => {
    const [name,setName]=useState('');
    const [email,setEmail]=useState('');
    const [loading,setLoading]=useState(true);
    const [userInfo,SetUserInfo]=useState(null);
    async function LogoutHandle(){
        await AsyncStorage.removeItem('KeepLoggedIn');
        await AsyncStorage.removeItem('Token');
        await auth().signOut();
        navigation.navigate('Login');
    }
  useEffect(()=> {
    
    const unsubscribe = auth().onAuthStateChanged(async (user) => {
        if (user) {
            setLoading(true);
            try {
                console.log(user.uid);
                SetUserInfo(user);
                const userDoc= await firestore().collection('users').doc(user.uid).get(); 
                if(userDoc.exists){
                    const data = userDoc._data;
                    console.log(data);
                    setName(data.name );
                    setEmail(data.email);
                }
                else{
                    setName(user.displayName || '');
                    setEmail(user.email || '');  
                }
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        } else {
            setName('');
            setEmail('');
            setLoading(false);
        }
    });


    return () => unsubscribe();
  },[])
  if(loading === true){
    return null;
  }
  return (
    <View style={{ flex: 1}}>
      <View style={{flex: 1}}>
      <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Welcome Back, {name}!!!!</Text>
      {/* <Text>Email: {email}</Text> */}
      </View >
      <Pressable onPress={()=> navigation.navigate('Event Creation',{user: userInfo.uid,name: name})}><Text>Add task</Text></Pressable>
      <View style={{justifyContent: 'flex-end',flex: 1, alignItems: 'center', margin: 10}}>
        
      <Pressable onPress={() => LogoutHandle()} style={styles.btn}><Text>Logout</Text></Pressable>
      </View>
    </View>
  )
}

export default Home

const styles = StyleSheet.create({
  btn: {
    height: 50,
    width: '50%',
    backgroundColor: 'red',
    marginTop: 10,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center'
}
})