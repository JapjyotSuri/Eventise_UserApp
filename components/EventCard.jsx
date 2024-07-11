import {Image, Modal, Pressable, StyleSheet, Text, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import EventDescription from './EventDescription';

const EventCard = ({event,userEmail}) => {
  const [isModalVisible,setIsModalVisible]=useState(false);
  function modalStateChange(){
    setIsModalVisible(false);
}
  return (
    <View>
      <Pressable onPress={() => setIsModalVisible(true)}>
    <View style={styles.card} >
      <View style={{flexDirection: 'row', width: '100%', gap: 10}}>
        <Image
          source={{uri: event.imgUrl}}
          style={{height: 85, width: 120, borderRadius: 10}}></Image>
        <View
          style={{
            width: '70%',
            flexDirection: 'column',
            justifyContent: 'center',
            gap: 5
          }}>
          <Text style={{color: 'grey', fontSize: 15}}>
            {event.date.toDate().toLocaleDateString('en-US', { month: 'long', day: 'numeric',year: 'numeric' })}
          </Text>
          <Text style={{fontSize: 18,fontWeight: 500}}>{event.title}</Text>
          <Text style={{color: 'grey',fontSize: 15}}>{event.location}</Text>
        </View>
      </View>
    </View>
    </Pressable>
    <Modal visible={isModalVisible} onRequestClose={() => setIsModalVisible(false)} animationType='slide' presentationStyle='pageSheet'>
      <EventDescription event={event} modalStateChange={modalStateChange} userEmail={userEmail}/>
    </Modal>

    </View>
  );
};

export default EventCard;

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#f3f3ff',
    width: '92%',
    height: 'auto',
    marginHorizontal: 14,
    marginVertical:8,
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
    borderRadius: 10,
    shadowColor: 'rgba(0, 0, 0, 0.20)',
    shadowOffset: {width: 0, height: 3},
    shadowOpacity: 1,
    shadowRadius: 7,
    elevation: 5,
  },
});