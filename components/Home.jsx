import { FlatList, Image, Modal, Pressable, RefreshControl, StyleSheet, Text, TextInput, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import firestore from '@react-native-firebase/firestore'
import auth from '@react-native-firebase/auth'
import EventCard from './EventCard'
import { getDistance } from 'geolib';
import EventDescription from './EventDescription'
import Entypo from 'react-native-vector-icons/Entypo'
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'
import Geolocation from 'react-native-geolocation-service';
const Home = ({ navigation }) => {
  const [refreshing,SetRefreshing]=useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(true);
  const [userInfo, SetUserInfo] = useState('');
  const [RefreshEventList,setRefreshEventList]=useState([]);
  const[nearbyEvents,setNearbyEvents]=useState([]);
  
  const userLocation={latitude: "12.889910", longitude: "77.613870"}
  const [currentLocation,setCurrentLoaction]=useState(userLocation)
  const [eventToOpen,setEventToOpen]=useState(null);
  const [isModalVisible,setIsModalVisible]=useState(false);
  
  useEffect(() => {
    Geolocation.requestAuthorization('whenInUse');
    Geolocation.getCurrentPosition(
      (position) => {
        console.log('current position is',position.coords)
        const location={latitude: position.coords.latitude, longitude: position.coords.longitude}
        console.log('Latest location is from geolocation services',location)
        setCurrentLoaction(location)
      },
      (error) => {
        console.log('error is',error);
      },
      {
        enableHighAccuracy: true, // This selects the most accurate location service avalable like GPS
        timeout: 15000, // Max amount of time the device should wait to get the location
        maximumAge: 10000, // Caching the result for 10 seconds
      }
    )
  },[])

  function modalStateChange(){
    setIsModalVisible(false);
}
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
      console.log(eventsList)
      const nearby=[...eventsList].sort((a,b)=>{//here we had to use the spread operator(...)as if we sorted dont write it the eventsList also changes as it is called by refrence hence changing the refreshEventList as well
        const distanceA = getDistance(currentLocation, { latitude: a.preciseLoaction.lat, longitude: a.preciseLoaction.lon });
        const distanceB = getDistance(currentLocation, { latitude: b.preciseLoaction.lat, longitude: b.preciseLoaction.lon  });
        return distanceA - distanceB;
      });
      setNearbyEvents(nearby);
      SetRefreshing(false);
      // setSearchList(eventsList)
    } catch (error) {
      console.error('Error loading events:', error);
    }
  }
  useEffect(() => {
    let userDocUnsubscribe
    const unsubscribe = auth().onAuthStateChanged(async (user) => {
      
      if (user) {
        setLoading(true);

        try {
          loadData();
          console.log(user.uid);
          //Below code is used to get realtime updates but in the app we want to update the list when it is pulled down to refresh
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
          const userDoc = firestore().collection('users').doc(user.uid);
          userDocUnsubscribe=userDoc.onSnapshot((docSnapshot) => {
            if (docSnapshot && docSnapshot.exists) {
              const data = docSnapshot.data();
              console.log(data);
              setName(data.name);
              setEmail(data.email);
              SetUserInfo(data.uid)
  
            }
            else {
              setName(user.displayName || '');
              setEmail(user.email || '');
              // if (userDocUnsubscribe) {//we had to do this because even after a user logs out the above onSnapshot still exixts and tries to access user that is now null and gives an error 
              //   //we have to unsubscribe to the above onSnapshot when user is logged out
              //   userDocUnsubscribe();
              // }
            }
          })
          
          return () => userDocUnsubscribe()
        } catch (error) {
          console.error(error);
        } finally {
          setLoading(false);
        }
      } else {
        setName('');
        setEmail('');
        setLoading(false);
        if (userDocUnsubscribe) {//we had to do this because even after a user logs out the above onSnapshot still exixts and tries to access user that is now null and gives an error 
          //we have to unsubscribe to the above onSnapshot when user is logged out
          userDocUnsubscribe();
        }
      }
    });


    return () =>  {
    if(userDocUnsubscribe){
      userDocUnsubscribe();
    }
      unsubscribe();
    }
  }, [])
  if (loading === true) {
    return null;
  }
  return (
    
    <View style={{ flex: 1,gap: 5 ,marginBottom: 13 }}>
      <View style={{ marginLeft: 15,marginTop: 12}}>
        <Text style={{ fontSize: 23, fontWeight: 'bold' ,color: '#1659ce',marginTop: 5}}>Welcome Back, {name}!!</Text>
      </View >
      <View style={{marginTop: 1,marginLeft: 15,marginBottom : -5}}>
        <Text style={{ fontSize: 19, fontWeight: 'bold' ,color: 'black',marginTop: 5}}>Nearby Events: </Text>
      </View>
    <View style={{margin: 5}}>  
   <FlatList
  data={nearbyEvents}
  renderItem={({ item }) => (
    <Pressable onPress={()=> {
      setEventToOpen(item)
      setIsModalVisible(true);
    }}>
    <View style={styles.card}>
      <Image source={{ uri: item.imgUrl }} style={{ width: 270, height: 150, borderTopLeftRadius: 10,  borderTopRightRadius: 10}} resizeMode='cover' />
      <View style={{ flexDirection: 'column',alignItems: 'flex-start' , width: '100%', marginTop: 10,marginLeft: 7,paddingHorizontal: 10,gap: 4}}>
        <Text style={{color: 'grey', fontSize: 15}}>{item.date.toDate().toLocaleDateString('en-US', { month: 'long', day: 'numeric',year: 'numeric' })}</Text>
        <Text style={{ fontSize: 18, fontWeight: 'bold' }}>{item.title}</Text>
        <Text style={{color: 'grey', fontSize: 15,}}><Entypo name="location-pin"  size={16} color='red'/>{item.location}</Text>
      </View>
    </View>
    </Pressable>
    
  )}
  keyExtractor={item => item.eventId} 
  horizontal={true} 
  showsHorizontalScrollIndicator={false} 
  
/>
</View>
<View style={{marginTop: -5 ,marginLeft: 15}}>
        <Text style={{ fontSize: 20, fontWeight: 'bold' ,color: 'black',marginTop: 5}}>All Events: </Text>
      </View>
      
      <FlatList
        data={RefreshEventList}
        renderItem={ ({item}) => (
          <View style={{}}>{    
              <EventCard event={item} navigation={navigation}/>    
          }</View>
        )
        }
        keyExtractor={item => item.title}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={loadData}/>//here whenever we pull the flatlist down to refresh it calls the loadData function
        }
        
      />
      
      <View style={{ justifyContent: 'flex-end', alignItems: 'flex-end', marginBottom: 10, marginRight: 20  }}>
      <Pressable style={{backgroundColor: '#1659ce',height: 50,width: 140, borderRadius: 20,justifyContent: 'center',alignItems: 'center',paddingHorizontal: 4,position: 'absolute'}} onPress={() => navigation.navigate('Event Creation', { userId: userInfo, name: name ,email: email})}>
        <Text style={{ fontSize: 17, color: 'white', fontWeight: 'bold', }}>+ Add Event</Text>
        </Pressable>
        
      </View>
      <Modal visible={isModalVisible} onRequestClose={() => setIsModalVisible(false)} animationType='slide' presentationStyle='pageSheet'>
      <EventDescription event={eventToOpen} modalStateChange={modalStateChange} navigation={navigation}/>
    </Modal>
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
    width: 270,
    height: 234,
   margin: 8,
    alignItems: 'center',
    flexDirection: 'column',
    borderRadius: 10,
    shadowColor: 'rgba(0, 0, 0, 0.20)',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 5,
  },
  input: {
    marginTop: 10,
    width: 340,
    height: 40,
    borderColor: 'ligthgrey',
    borderWidth: 1,
    borderRadius: 5,
    paddingLeft: 10,
  }

})