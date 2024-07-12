import { FlatList, Image, Modal, Pressable, RefreshControl, ScrollView, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import firestore from '@react-native-firebase/firestore'
import auth from '@react-native-firebase/auth'
import AsyncStorage from '@react-native-async-storage/async-storage'
import EventCard from './EventCard'
import Swiper from 'react-native-swiper'
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
  
  async function loadData() {
    try {
      const eventCollection = await firestore()
        .collection('events')
        .where('status', '==', 'Approved')
        .get();
      
      const eventsList = eventCollection.docs.map((doc) => ({
        eventId: doc.id,
        ...doc.data(),
      }));
  
      setRefreshEventList(eventsList);
      SetRefreshing(false);
    } catch (error) {
      console.error('Error loading events:', error);
    }
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
      <View style={{marginTop: 5,marginLeft: 15,marginBottom : -5}}>
        <Text style={{ fontSize: 20, fontWeight: 'bold' ,color: '#5D3FD3',marginTop: 5}}>Nearby Events: </Text>
      </View>
    <View style={{margin: 5}}>  
  <FlatList
  data={RefreshEventList}
  renderItem={({ item }) => (
    <View style={styles.card}>
      <Image source={{ uri: item.imgUrl }} style={{ width: 300, height: 200, borderRadius: 10 }} resizeMode='cover' />
      <View style={{ flexDirection: 'column', padding: 10 ,alignItems: 'flex-start' , width: '100%',gap: 1}}>
        <Text style={{color: 'grey', fontSize: 15}}>{item.date.toDate().toLocaleDateString('en-US', { month: 'long', day: 'numeric',year: 'numeric' })}</Text>
        <Text style={{ fontSize: 18, fontWeight: 'bold' }}>{item.title}</Text>
        <Text style={{color: 'grey', fontSize: 15}}>{item.location}</Text>
      </View>
    </View>
  )}
  keyExtractor={item => item.eventId} 
  horizontal={true} 
  showsHorizontalScrollIndicator={false} 
  
/>
</View>
<View style={{marginTop: 5,marginLeft: 15}}>
        <Text style={{ fontSize: 20, fontWeight: 'bold' ,color: '#5D3FD3',marginTop: 5}}>All Events: </Text>
      </View>
      {/* <Swiper style={{ height: 250 }} >
  {RefreshEventList.map((event) => (
    <EventCard key={event.eventId} event={event} userEmail={email}/>
  ))}
</Swiper> */}
      
      <FlatList
        data={RefreshEventList}
        renderItem={ ({item}) => (
          <View style={{}} showsButtons={true}>{    
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
      <Pressable style={{backgroundColor: '#5D3FD3',height: 50,width: 200, borderRadius: 20,justifyContent: 'center',alignItems: 'center',paddingHorizontal: 4}} onPress={() => navigation.navigate('Event Creation', { userId: userInfo, name: name })}>
        <Text style={{ fontSize: 17, color: 'white', fontWeight: 'bold', }}>+ Add Event</Text>
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
    width: 320,
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
  },

})