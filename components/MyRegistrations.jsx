import {FlatList, StyleSheet, Text, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import firestore, {onSnapshot} from '@react-native-firebase/firestore';
import RegisteredTaskInfo from './RegisteredTaskInfo';
import auth from '@react-native-firebase/auth'
const MyRegistrations = ({route, navigation}) => {
  const {uid} = route.params;
  const [eventsRegistered, setEventsRegistered] = useState([]);
  useEffect(() => {
    const subscribe= auth().onAuthStateChanged((user) => {
        if(user){
            console.log(user)
            const unsubscribe = firestore()
            .collection('registrations')
            .where('userId', '==', user.uid)
            .onSnapshot(querySnapshot => {
              let registeredEvents = [];
              querySnapshot.forEach(documentSnapshot => {
                registeredEvents.push({
                  ...documentSnapshot.data(),
                  registerationId: documentSnapshot.id,
                });
              });
              console.log('events registered are', registeredEvents);
              setEventsRegistered(registeredEvents);
            });
            return ()=> unsubscribe()
        }
       
    })
   
    return () => subscribe();
  }, [uid]);
  if(eventsRegistered.length === 0){
    return(
        <View style={{height: '85%',justifyContent: 'center',alignItems: 'center'}}>
            <Text style={{fontSize: 22,fontWeight: 'bold'}}>No Registrations yet</Text>
        </View>
    )
  }
  return (
    <View>
      <View style={{marginTop: 10}}>
        <FlatList
          data={eventsRegistered}
          keyExtractor={item => item.registrationId}
          renderItem={({item}) => (
            <View>
              {
                <RegisteredTaskInfo
                  eventId={item.eventId}
                  navigation={navigation}
                />
              }
            </View>
          )}
        />
      </View>
    </View>
  );
};

export default MyRegistrations;

const styles = StyleSheet.create({});
