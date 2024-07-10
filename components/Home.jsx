import { Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import firestore from '@react-native-firebase/firestore'
import auth from '@react-native-firebase/auth'
import AsyncStorage from '@react-native-async-storage/async-storage'
import EventCard from './EventCard'
const Home = ({ navigation }) => {
  const [isModalVisible,setIsModalVisible]=useState(false);
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(true);
  const [userInfo, SetUserInfo] = useState('');
  const [allEvents, setAllEvents] = useState([]);
  let subscribe = null
  async function LogoutHandle() {
    await AsyncStorage.removeItem('KeepLoggedIn');
    await AsyncStorage.removeItem('Token');
    await auth().signOut();
    navigation.navigate('Login');
  }
  useEffect(() => {

    const unsubscribe = auth().onAuthStateChanged(async (user) => {
      
      if (user) {
        setLoading(true);
        try {

          console.log(user.uid);
          
          subscribe = firestore().collection('events').where('status','==','Approved').onSnapshot((querySnapshot) => {
            let events = [];
            querySnapshot.forEach(documentSnapshot => {
              events.push({
                ...documentSnapshot.data(),
                eventId: documentSnapshot.id,

              })
            })
            console.log(events)
            setAllEvents(events);
          })
          const userDoc = await firestore().collection('users').doc(user.uid).get();
          if (userDoc.exists) {
            const data = userDoc._data;
            console.log(data);
            setName(data.name);
            setEmail(data.email);
            SetUserInfo(data.uid)

          }
          else {
            setName(user.displayName || '');
            setEmail(user.email || '');
          }
          return () => subscribe()
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


    return () =>  unsubscribe();
    
  }, [])
  if (loading === true) {
    return null;
  }
  return (
    <ScrollView>
    <View style={{ flex: 1 }}>
      <View style={{ flex: 1 }}>
        <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Welcome Back, {name}!!!!</Text>
        {/* <Text>Email: {email}</Text> */}
      </View >
      <View style={{flexWrap: 'wrap'}}>{
        allEvents.map((event) => (
          
          <EventCard event={event}/>
        ))
      }</View>
      <Pressable onPress={() => navigation.navigate('Event Creation', { userId: userInfo, name: name })}><Text>Add task</Text></Pressable>
      <View style={{ justifyContent: 'flex-end', flex: 1, alignItems: 'center', margin: 10 }}>
      
        <Pressable onPress={() => LogoutHandle()} style={styles.btn}><Text>Logout</Text></Pressable>
      </View>
      </View>
    </ScrollView>
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
  },
  card: {
    backgroundColor: '#f3f3ff',
    width: '92%',
    height: 'auto',
    margin: 13, 
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
    borderRadius: 10,
    shadowColor: 'rgba(0, 0, 0, 0.20)',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 1,
    shadowRadius: 7,
    elevation: 5,
  }
})