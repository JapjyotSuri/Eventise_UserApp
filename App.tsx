import { ScrollView, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import Login from './components/Login'
import Signup from './components/Signup'
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'

const App = () => {
  const Stack=createNativeStackNavigator();
  return (
    <NavigationContainer>
    <Stack.Navigator>
      <Stack.Screen name='Login' component={Login}></Stack.Screen>
      <Stack.Screen name='Signup' component={Signup}></Stack.Screen>
    </Stack.Navigator>

    </NavigationContainer>
    
  )
}

export default App

const styles = StyleSheet.create({})