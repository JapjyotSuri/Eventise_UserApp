import { Image, Pressable, StyleSheet, Text, View } from 'react-native'
import React from 'react'

const EventDescription = ({event,modalStateChange,userEmail}) => {
    
  return (

    <View>
        <Image source={{uri: event.imgUrl}} style={{width: '100%',height: '43%'}}></Image>
        <View style={styles.card}> 
            <Text style={{fontSize: 30}}>{event.title}</Text>
            <View style={{flexDirection: 'row', width: '100%',justifyContent: 'space-between'}}>
            <Pressable ><Text style={{fontSize: 18,color: '#9CA3AF'}}>{event.date.toDate().toLocaleDateString('en-US', { month: 'long', day: 'numeric',year: 'numeric' })}</Text></Pressable>
            <Pressable ><Text style={{fontSize: 18,color: '#9CA3AF'}}>{event.location}</Text></Pressable>
            </View>
           
            <Text style={{fontSize: 25}}>Event Overview:</Text>
            <Text style={{fontSize: 18, color: '#9CA3AF'}}>{event.description}</Text>
            <View style={{marginTop: 50}}>
                <Text style={{fontSize: 20}}>For more info about the event contact: </Text>
                <View style={{flexDirection: 'row',width: '100%',justifyContent: 'space-between'}}>
                <Text style={{fontSize: 18, color: '#9CA3AF'}}>{event.username}</Text>
                <Text style={{fontSize: 18, color: '#9CA3AF'}}>{userEmail}</Text>
                </View>
            </View>
            <View style={{justifyContent: 'flex-end'}}>
            <Pressable style={styles.btn} onPress={()=> modalStateChange()}>
            <Text style={{fontSize: 20, color: 'white'}}>Close</Text>
        </Pressable>
        </View>
        </View>
        
    </View>
  )
}

export default EventDescription

const styles = StyleSheet.create({
    card: {
        backgroundColor: 'white',
        width: '100%',
        height: '70%',
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