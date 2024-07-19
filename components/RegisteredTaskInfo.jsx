import { StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import firestore from '@react-native-firebase/firestore'
import EventCard from './EventCard';
const RegisteredTaskInfo = ({eventId,navigation}) => {
    const [eventData,setEventData]=useState(null);
    useEffect(() => {
       async function getEventData(){
         const data=await firestore().collection('events').doc(eventId).get();
         console.log("data of event is ",data._data)
         setEventData(data._data);
       }
       getEventData()
    },[])
  return (
    <View>
      { eventData && <EventCard event={eventData} navigation={navigation}/>}
    </View>
  )
}

export default RegisteredTaskInfo

const styles = StyleSheet.create({})