import {FlatList, StyleSheet, Text, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import firestore, {onSnapshot} from '@react-native-firebase/firestore';
import RegisteredTaskInfo from './RegisteredTaskInfo';
import auth from '@react-native-firebase/auth'
const MyRegistrations = ({route, navigation}) => {
  const [eventsRegistered, setEventsRegistered] = useState([]);
//   useEffect(() => { 
//     console.log("current user is",currentUser)
//    //here i had to use onAuthStateChanged because when user logouts the it gives an error that cant read property of  null even after putting if condition
//     const subscribe= auth().onAuthStateChanged((user) => {
//         if(user){
//             console.log(user)
//             const unsubscribe = firestore()
//             .collection('registrations')
//             .where('userId', '==', user.uid)
//             .onSnapshot(querySnapshot => {
//               let registeredEvents = [];
//               querySnapshot.forEach(documentSnapshot => {
//                 registeredEvents.push({
//                   ...documentSnapshot.data(),
//                   registerationId: documentSnapshot.id,
//                 });
//               });
//               console.log('events registered are', registeredEvents);
//               setEventsRegistered(registeredEvents);
//             });
//             return ()=> unsubscribe() 
//         }
       
//     })
   
//     return () => subscribe();

// }, []);

useEffect(() => {
  let unsubscribe;

  const authUnsubscribe = auth().onAuthStateChanged((user) => {
    if (user) {
      unsubscribe = firestore()
        .collection('registrations')
        .where('userId', '==', user.uid)
        .onSnapshot(
          (querySnapshot) => {
            const registeredEvents = [];
            querySnapshot.forEach((documentSnapshot) => {
              registeredEvents.push({
                ...documentSnapshot.data(),
                registrationId: documentSnapshot.id,
              });
            });
            setEventsRegistered(registeredEvents);
          },
          (error) => {
            console.log('Error fetching registrations:', error);
          }
        );
    } else {
      setEventsRegistered([]);
      if (unsubscribe) {//we had to do this because even after a user logs out the above onSnapshot still exixts and tries to access user that is now null and gives an error 
        //we have to unsubscribe to the above onSnapshot when user is logged out
        unsubscribe();
      }
    }
  });

  return () => {
    if (unsubscribe) {
      unsubscribe();
    }
    authUnsubscribe();
  };
}, []);

  if(eventsRegistered.length === 0){
    return(
        <View style={{height: '85%',justifyContent: 'center',alignItems: 'center'}}>
            <Text style={{fontSize: 22,fontWeight: 'bold'}}>No Registrations yet</Text>
        </View>
    )
  }
  return (
    <View>
      <View>
      <View style={{ marginLeft: 15,marginTop: 20,marginBottom: 10}}>
        <Text style={{ fontSize: 23, fontWeight: 'bold' ,color: '#1659ce',marginTop: 5}}>Your Event Journey</Text>
      </View >
      <View style={{marginBottom: 20}}>
        <FlatList
          data={eventsRegistered}
          keyExtractor={item => item.registrationId}
          renderItem={({item}) => (
            <>
              {
                <RegisteredTaskInfo
                  eventId={item.eventId}
                  navigation={navigation}
                  status={item.status}
                />
              }
            </>
          )}
        />
        </View>
      </View>
    </View>
  );
};

export default MyRegistrations;

const styles = StyleSheet.create({});
