import { Image, Pressable, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import firestore from '@react-native-firebase/firestore'
import Entypo from 'react-native-vector-icons/Entypo'
import Fontisto from 'react-native-vector-icons/Fontisto'
const EventDescription = ({event,modalStateChange,userEmail}) => {
    const [creator,setCreator]=useState('');
    useEffect(()=>{
        async function fetchEmail(){
            try{
                const userData= await firestore().collection('users').doc(event.userId).get()
                console.log('user who has created event',userData);
                setCreator(userData._data.email)

            }
            catch(error){
             console.log(error);
            }
        }
       fetchEmail();
    },[event])
  return (
   <SafeAreaView>
    <View >
        <Image source={{uri: event.imgUrl}} style={{width: '100%',height: '43%'}}></Image>
        <View style={styles.card}> 
            <Text style={{fontSize: 30, fontWeight: 500}}>{event.title}</Text>
            <View style={{flexDirection: 'row', width: '100%',justifyContent: 'space-between'}}>
            <Pressable ><Text style={{fontSize: 17,color: '#9CA3AF'}}>{event.date.toDate().toLocaleDateString('en-US', { month: 'long', day: 'numeric',year: 'numeric' })}</Text></Pressable>
            <Pressable ><Text style={{fontSize: 17,color: '#9CA3AF'}}><Entypo name="location-pin"  size={19} color='red'/>{event.location}</Text></Pressable>
            </View>
           
            <Text style={{fontSize: 25}}>Event Overview:</Text>
            <Text style={{fontSize: 17, color: '#9CA3AF' , textAlign: 'justify'}}>{event.description}</Text>
           
            <View style={{justifyContent: 'flex-end',left: 25 , bottom: 15,position: 'absolute'}}>
            <View style={{marginTop: 50 ,}}>
                <Text style={{fontSize: 20}}>For more information : </Text>
                <View style={{flexDirection: 'row',width: '100%',justifyContent: 'space-between',alignItems: 'center'}}>
                <Text style={{fontSize: 17, color: '#9CA3AF'}}>{event.username}</Text>
                <View style={{flexDirection: 'row',alignItems: 'center',gap: 3}}>
                    <Text><Fontisto name="email" size={19} style={{ marginTop: 4 , color: '#9CA3AF'}} /></Text>
                <Text style={{fontSize: 17, color: '#9CA3AF'}}>{creator}</Text>
                </View>
                
                </View>
            </View>
            <Pressable style={styles.btn} onPress={()=> modalStateChange()}>
            <Text style={{fontSize: 20, color: 'white'}}>Close</Text>
        </Pressable>
        </View>
        </View>
        
    </View>
    </SafeAreaView>
  )
}

export default EventDescription

const styles = StyleSheet.create({
    card: {
        backgroundColor: 'white',
        width: '100%',
        height: '61%',
        borderRadius: 15,
        padding: 20,
        marginTop: -30,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
        elevation: 5,
        gap: 10
      },
      btn: {
        height: 50,
        width: 350,
        backgroundColor: 'red',
        marginTop: 10,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center'
    }, 
})