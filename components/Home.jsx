import { FlatList, Modal, Pressable, RefreshControl, ScrollView, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import firestore from '@react-native-firebase/firestore'
import auth from '@react-native-firebase/auth'
import AsyncStorage from '@react-native-async-storage/async-storage'
import EventCard from './EventCard'
const Home = ({ navigation }) => {
  const [isModalVisible,setIsModalVisible]=useState(false);
  const [refreshing,SetRefreshing]=useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(true);
  const [userInfo, SetUserInfo] = useState('');
  const [allEvents, setAllEvents] = useState([]);
  const [RefreshEventList,setRefreshEventList]=useState([]);
  let subscribe = null
  
  async function loadData(){
     const eventCollection=await firestore().collection('events').where('status','==','Approved').get();
     const eventsList=eventCollection.docs.map((doc) => ({
      eventId: doc.id,
      ...doc.data()
     }))
     setRefreshEventList(eventsList)
     SetRefreshing(false);
  } 
  useEffect(() => {
     
    const unsubscribe = auth().onAuthStateChanged(async (user) => {
      
      if (user) {
        setLoading(true);

        try {
          loadData();
          console.log(user.uid);
          
          // subscribe = firestore().collection('events').where('status','==','Approved').onSnapshot((querySnapshot) => {
          //   let events = [];
          //   querySnapshot.forEach(documentSnapshot => {
          //     events.push({
          //       ...documentSnapshot.data(),
          //       eventId: documentSnapshot.id,

          //     })
          //   })
          //   console.log(events)
          //   setAllEvents(events);
          // })
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


    return () =>  {
    //   if(subscribe){
    // subscribe();
    //   }
      unsubscribe();
    }
  }, [])
  if (loading === true) {
    return null;
  }
  return (
    
    <View style={{ flex: 1,gap: 5 ,marginTop: 10,marginBottom: 13}}>
      <View style={{ marginLeft: 15}}>
        <Text style={{ fontSize: 25, fontWeight: 'bold' ,color: '#5D3FD3',marginTop: 5}}>Welcome Back, {name}!!</Text>
        
        {/* <Text>Email: {email}</Text> */}
      </View >
      <FlatList
        data={RefreshEventList}
        renderItem={ ({item}) => (
          <View style={{}}>{    
              <EventCard event={item} userEmail={email}/>    
          }</View>
        )
        }
        keyExtractor={item => item.title}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={loadData}/>
        }
        // ItemSeparatorComponent={() => <View style={{ height:  }}/>}
      />
      
      <View style={{ justifyContent: 'flex-end', alignItems: 'flex-end', marginBottom: 10, marginRight: 30  }}>
      <Pressable style={{backgroundColor: '#5D3FD3',height: 50,width: 100, borderRadius: 20,justifyContent: 'center',alignItems: 'center',paddingHorizontal: 4}} onPress={() => navigation.navigate('Event Creation', { userId: userInfo, name: name })}>
        <Text style={{ fontSize: 17, color: 'white', fontWeight: 'bold', }}>+ Add Task</Text>
        </Pressable>
        {/* <Pressable onPress={() => LogoutHandle()} style={styles.btn}><Text>Logout</Text></Pressable> */}
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