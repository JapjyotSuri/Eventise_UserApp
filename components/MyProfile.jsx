import { StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import MyRegistrations from './MyRegistrations'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import { SafeAreaView } from 'react-native-safe-area-context'
import auth from '@react-native-firebase/auth'
import firestore from '@react-native-firebase/firestore'
import Feather from 'react-native-vector-icons/Feather'
const MyProfile = ({navigation}) => {
    const [name,setName]=useState('');
    const [email,setEmail]=useState('');
    const [currentUser,setUser]=useState(null);
    async function fetchUserData(uid){
        try{
            const userInfo= await firestore().collection('users').doc(uid).get();
            console.log("user data in user profile is",userInfo)
            setName(userInfo._data.name)
            setEmail(userInfo._data.email)
        }
        catch(error){
            console.log(error);

        }
    }
    useEffect(()=>{
      const unsubscribe=auth().onAuthStateChanged((user)=>{
        if(user){
          console.log("user is in my profile",user);
          console.log("current user",user)
          setUser(user) 
          fetchUserData(user.uid)
        }
      })
      return () => unsubscribe();
    },[])
  return (
    
    <View style={{height: '100%', alignItems: 'center',justifyContent: 'center', width: '100%',marginTop: 50}}>
      <View style={{width: '100%',flexDirection: 'row', alignItems: 'center',justifyContent: 'center',gap:10}}>
        <FontAwesome name="user-circle" size={90} color='#1659ce'/>
        <View style={{width: '55%'}}>
            <Text style={{fontSize: 25}}>{name}</Text>
            <Text style={{fontSize: 17, color: 'grey'}}>{email}</Text>
        </View>
        <View>
            <Feather name="edit" size={20} onPress={()=> navigation.navigate('Edit Profile',{name,email,currentUser})}/>
        </View>
        <View>

        </View>
      </View>
      <MyRegistrations currentUser={currentUser}/>
      
    </View>
  )
}

export default MyProfile

const styles = StyleSheet.create({})