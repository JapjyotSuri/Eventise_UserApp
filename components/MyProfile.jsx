import { StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import MyRegistrations from './MyRegistrations'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import { SafeAreaView } from 'react-native-safe-area-context'
import auth from '@react-native-firebase/auth'
import firestore from '@react-native-firebase/firestore'
import Feather from 'react-native-vector-icons/Feather'
import AntDesign from 'react-native-vector-icons/AntDesign'
import AsyncStorage from '@react-native-async-storage/async-storage'
const MyProfile = ({navigation}) => {
    const [name,setName]=useState('');
    const [email,setEmail]=useState('');
    const [currentUserUid,setUserUid]=useState(null);
    async function fetchUserData(uid){
        try{
            const userInfo= await firestore().collection('users').doc(uid).get();
            if(userInfo.exists){
            console.log("user data in user profile is",userInfo)
            setName(userInfo._data.name)
            setEmail(userInfo._data.email)
            }
            else {
              console.log("User document does not exist");
              navigation.navigate('Login')
            }  
            
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
          setUserUid(user.uid) 
          fetchUserData(user.uid)
        }
      })
      return () => unsubscribe();
    },[])
  return (
    <View style={{flex: 1,justifyContent: 'center', justifyContent: '',}}>
        <View style={{height: '33%',backgroundColor: '#1659ce',justifyContent: 'flex-start',alignItems: 'center', flexDirection: 'column',gap: 25,padding: 20,paddingTop: 55}}>
            <View style={{flexDirection: 'row',justifyContent: 'space-between',width: '100%'}}>
            <AntDesign
                onPress={() => navigation.navigate('Home')}
                name="back"
                size={27}
                color="white"
              />
              <Text style={{
              color: 'white',
              fontSize: 20,
              fontWeight: 'bold'
            }}>Profile</Text>
            <View style={{backgroundColor:"white", padding:4 , borderRadius:20}}>
            <AntDesign name='logout' style={{ color: 'red', fontSize: 27, }} onPress={async () => {
              await AsyncStorage.removeItem('KeepLoggedIn');
              await AsyncStorage.removeItem('Token');
              await auth().signOut();
              navigation.navigate('Login');
              
            }} />
            </View>
            </View>
            <View style={{width: '100%',flexDirection: 'row', alignItems: 'center',justifyContent: 'center',gap:10}}>
                <FontAwesome name="user-circle" size={85} color='white' style={styles.profilePic}/>
                <View style={{width: '60%',alignContent: 'flex-start',gap: 2}}>
                    <Text style={[styles.threeDText,{fontSize: 30,color: 'white'}]}>{name}</Text>
                    <Text style={[styles.threeDText,{fontSize: 19, color: 'white'}]}>{email}</Text>
                </View>
                <View style={styles.iconWrapper}>
                    <Feather name="edit" size={25} color='white' onPress={()=> navigation.navigate('Edit Profile',{name,email,currentUserUid})}/>
                </View>
            </View>
        </View>
      <View style={styles.card}>
      <MyRegistrations navigation={navigation}/>
    </View>
    </View>
  )
}

export default MyProfile

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#f3f2f3',
        width: '100%',
        flex: 1,
        borderRadius: 30,
        marginTop: -30,
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 3},
        shadowOpacity: 0.3,
        shadowRadius: 5,
        elevation: 5,
        
      },  
    profilePic: {
        shadowColor: 'rgba(0, 0, 0, 0.25)',
        shadowOffset: {width: 0, height: 4},
        shadowOpacity: 1,
        shadowRadius: 4,
        elevation: 5,
      },
    threeDText: {
        color: 'white',
        textShadowColor: '#000000',
        textShadowOffset: { width: 0, height: 1 },
        textShadowRadius: 1,
      },
      iconWrapper: {
        shadowColor: '#000000', 
        shadowOffset: { width: 2, height: 2 }, 
        shadowOpacity: 0.8, 
        shadowRadius: 1, 
        
      },
})