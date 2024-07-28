import { StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import firestore from '@react-native-firebase/firestore'
import EventCard from './EventCard';
import MyRegistrationsCard from './MyRegistrationsCard';
const RegisteredTaskInfo = ({eventId,navigation,status}) => {
    const [eventData,setEventData]=useState(null);
    useEffect(() => {
       async function getEventData(){
         const data=await firestore().collection('events').doc(eventId).get();
         console.log("data of event is ",data._data)
         const eventsData={eventId: eventId,...data._data};
         console.log(" full data of event is ",eventsData)
         setEventData(eventsData);
       }
       
       console.log("status of event is ",status)
       getEventData()
    },[])
  return (
    <View >
      { eventData && <MyRegistrationsCard event={eventData} navigation={navigation} status={status}/>}
    </View>
  )
}

export default RegisteredTaskInfo

const styles = StyleSheet.create({})