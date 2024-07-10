import { Image, Pressable, StyleSheet, Text, View } from 'react-native'
import React from 'react'

const EventDescription = ({event,modalStateChange}) => {
  return (
    <View>
        <Image source={{uri: event.imgUrl}} style={{width: '100%',height: '43%'}}></Image>
        <View style={styles.card}> 
            <Text style={{fontSize: 30}}>{event.title}</Text>
            <View style={{flexDirection: 'row', width: '100%',justifyContent: 'space-between'}}>
            <Text style={{fontSize: 20}}>{event.date.toDate().toLocaleDateString()}</Text>
            <Text style={{fontSize: 20}}>{event.location}</Text>
            </View>
           
            <Text style={{fontSize: 25}}>Event Overview</Text>
            <Text style={{fontSize: 18}}>{event.description}</Text>
            <View>
                <Text>For more information contact: </Text>
                <Text>{event.username}</Text>
            </View>
            <Pressable onPress={()=> modalStateChange()}>
            <Text>Close</Text>
        </Pressable>
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
        gap: 6
      },
})