import { ScrollView, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import Login from './components/Login'
import Signup from './components/Signup'
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import Home from './components/Home'
import AsyncStorage from '@react-native-async-storage/async-storage'
import FormikSignup from './components/FormikSignup'
import EventCreationForm from './components/EventCreationForm'
import AntDesign from 'react-native-vector-icons/AntDesign'
import auth from '@react-native-firebase/auth'
const App = () => {
  const [initialRoute,setInitialRoute]=useState('');
  const [loading,setLoading]=useState(true);
  const Stack=createNativeStackNavigator();
  useEffect(() => {

     async function checkIfLoggedIn(){
      try{
        const keepLoggedIn=await AsyncStorage.getItem('KeepLoggedIn');
        const data=await AsyncStorage.getItem('Token');
        console.log(keepLoggedIn)
        if(keepLoggedIn === 'true'){
           setInitialRoute('Home')
        }
        else{
          setInitialRoute('Login')
        }
      }
      catch (error) {
        console.error('Failed to check login status', error);
        setInitialRoute('Login');
        
      }
      finally{
        setLoading(false);
      }
     }
     checkIfLoggedIn()
  },[])
  if (loading) {
    return null; // Or you can show a loading indicator here
  }
  async function LogoutHandle() {
    
  }
  return (
    <NavigationContainer>
    <Stack.Navigator initialRouteName={initialRoute}>
      <Stack.Screen name='Login' component={Login} 
      options={ ({navigation}) => ({ headerLeft: () => <></>})}></Stack.Screen>
      <Stack.Screen name='Signup' component={FormikSignup} options={ ({navigation}) => ({ headerLeft: () => <></>})}></Stack.Screen>
      <Stack.Screen name='Home' component={Home} 
      options={ ({navigation}) => ({ headerLeft: () => <></>,
      headerRight: ()=> <AntDesign name='logout' style={{color: 'red', fontSize: 27}} onPress={async ()=> {
        await AsyncStorage.removeItem('KeepLoggedIn');
        await AsyncStorage.removeItem('Token');
        await auth().signOut();
    navigation.navigate('Login');
        navigation.navigate('Login')}}/>})}></Stack.Screen>
      <Stack.Screen name='Event Creation' component={EventCreationForm} options={ ({navigation}) => ({ headerLeft: () => <AntDesign onPress={()=> navigation.navigate('Home')} name="back" size={27}/>})}></Stack.Screen>
    </Stack.Navigator>

    </NavigationContainer>
    
  )
}

export default App

const styles = StyleSheet.create({})