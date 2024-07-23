import { StyleSheet, } from 'react-native'
import React, { useEffect, useState } from 'react'
import Login from './components/Login'
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import Home from './components/Home'
import AsyncStorage from '@react-native-async-storage/async-storage'
import FormikSignup from './components/FormikSignup'
import EventCreationForm from './components/EventCreationForm'
import AntDesign from 'react-native-vector-icons/AntDesign'
import auth from '@react-native-firebase/auth'
import EventRegistrationForm from './components/EventRegistrationForm'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import MyRegistrations from './components/MyRegistrations'
import EvilIcons from 'react-native-vector-icons/EvilIcons'
import MyProfile from './components/MyProfile'
import EditProfile from './components/EditProfile'
import FeedbackPage from './components/FeedbackPage'
const App = () => {
  const [initialRoute, setInitialRoute] = useState('');
  const [loading, setLoading] = useState(true);
  const Stack = createNativeStackNavigator();
  const [userId,setUserId]=useState('')
  useEffect(() => {
    async function checkIfLoggedIn() { 
      try {
        const keepLoggedIn = await AsyncStorage.getItem('KeepLoggedIn');
        const data = await AsyncStorage.getItem('Token');
        console.log(keepLoggedIn)
        const userData=JSON.parse(data)
        
          console.log("data is",userData.uid);
        
        
        
          setUserId(userData.uid)
        if (keepLoggedIn === 'true') {
          setInitialRoute('Home')
        }
        else {
          setInitialRoute('Login')
        }
      }
      catch (error) {
        console.error('Failed to check login status', error);
        setInitialRoute('Login');

      }
      finally {
        setLoading(false);
      }
    }
    checkIfLoggedIn()
  }, [])
  if (loading) {
    return null; // Or you can show a loading indicator here
  }
  async function LogoutHandle() {

  }
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName={initialRoute}>
        <Stack.Screen name='Login' component={Login}
          options={({ navigation }) => (
            {
              headerLeft: () => <></>,
              title: 'Login',
              headerTitleStyle: {
                color: '#1659ce',
                fontSize: 20,
                fontWeight: 'bold'
              },
            }
          )}></Stack.Screen>
        <Stack.Screen name='Signup' component={FormikSignup} options={({ navigation }) => (
          {
            headerLeft: () => <></>,
            title: 'Signup',
            headerTitleStyle: {
              color: '#1659ce',
              fontSize: 20,
              fontWeight: 'bold'
            }
          }
        )}></Stack.Screen>
        <Stack.Screen name='Home' component={Home}
          options={({ navigation }) => ({
            title: 'Events List',
            headerTitleStyle: {
              color: '#1659ce',
              fontSize: 20,
              fontWeight: 'bold'
            },
            headerLeft: () => <EvilIcons name="user" style={{ color: '#1659ce', fontSize: 45 }} onPress={()=> navigation.navigate('My Registrations',{uid: userId})}/>,
            headerRight: () => <AntDesign name='logout' style={{ color: 'red', fontSize: 27 }} onPress={async () => {
              await AsyncStorage.removeItem('KeepLoggedIn');
              await AsyncStorage.removeItem('Token');
              await auth().signOut();
              navigation.navigate('Login');
              
            }} />
          })}></Stack.Screen>
        <Stack.Screen name='Event Creation'
          component={EventCreationForm}
          options={({ navigation }) => ({
            title: 'Event Creation',
            headerTitleStyle: {
              color: '#1659ce',
              fontSize: 20,
              fontWeight: 'bold'
            },
            headerLeft: () => (
              <AntDesign
                onPress={() => navigation.navigate('Home')}
                name="back"
                size={27}
                color="#1659ce"
              />
            ),
          })}
        ></Stack.Screen>
        <Stack.Screen name='Event Registration'
          component={EventRegistrationForm}
          options={({ navigation }) => ({
            title: 'Event Registration',
            headerTitleStyle: {
              color: '#1659ce',
              fontSize: 20,
              fontWeight: 'bold'
            },
            headerLeft: () => (
              <AntDesign
                onPress={() => navigation.navigate('Home')}
                name="back"
                size={27}
                color="#1659ce"
              />
            ),
          })}
        ></Stack.Screen>
        <Stack.Screen name='My Registrations' component={MyProfile}
          options={({ navigation }) => ({
            title: 'Your Profile',
            headerTitleStyle: {
              color: '#1659ce',
              fontSize: 20,
              fontWeight: 'bold'
            },
            headerLeft: () => (
              <AntDesign
                onPress={() => navigation.navigate('Home')}
                name="back"
                size={27}
                color="#1659ce"
              />
            ),
            headerRight: () => <AntDesign name='logout' style={{ color: 'red', fontSize: 27 }} onPress={async () => {
              await AsyncStorage.removeItem('KeepLoggedIn');
              await AsyncStorage.removeItem('Token');
              await auth().signOut();
              navigation.navigate('Login');
              navigation.navigate('Login')
            }} />
          })}></Stack.Screen>
           <Stack.Screen name='Edit Profile' component={EditProfile}
          options={({ navigation }) => ({
            title: 'Edit Profile',
            headerTitleStyle: {
              color: '#1659ce',
              fontSize: 20,
              fontWeight: 'bold'
            },
            headerLeft: () => (
              <AntDesign
                onPress={() => navigation.navigate('Home')}
                name="back"
                size={27}
                color="#1659ce"
              />
            ),
            headerRight: () => <AntDesign name='logout' style={{ color: 'red', fontSize: 27 }} onPress={async () => {
              await AsyncStorage.removeItem('KeepLoggedIn');
              await AsyncStorage.removeItem('Token');
              await auth().signOut();
              navigation.navigate('Login');
              navigation.navigate('Login')
            }} />
          })}></Stack.Screen>
          <Stack.Screen name='Feedback' component={FeedbackPage}
          options={({ navigation }) => ({
            title: 'Write a Feedback',
            headerTitleStyle: {
              color: '#1659ce',
              fontSize: 20,
              fontWeight: 'bold'
            },
            headerLeft: () => (
              <AntDesign
                onPress={() => navigation.navigate('Home')}
                name="back"
                size={27}
                color="#1659ce"
              />
            ),
            headerRight: () => <AntDesign name='logout' style={{ color: 'red', fontSize: 27 }} onPress={async () => {
              await AsyncStorage.removeItem('KeepLoggedIn');
              await AsyncStorage.removeItem('Token');
              await auth().signOut();
              navigation.navigate('Login');
              navigation.navigate('Login')
            }} />
          })}></Stack.Screen>
      </Stack.Navigator>

    </NavigationContainer>

  )
}

export default App
const styles = StyleSheet.create({})