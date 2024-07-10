import {Image, Modal, Pressable, StyleSheet, Text, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import EventDescription from './EventDescription';

const EventCard = ({event}) => {
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
          style={{height: 80, width: 100, borderRadius: 10}}></Image>
        <View
          style={{
            width: '70%',
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}>
          <Text style={{color: 'grey'}}>
            {event.date.toDate().toLocaleDateString()}
          </Text>
          <Text style={{fontSize: 20}}>{event.title}</Text>
          <Text style={{color: 'grey'}}>{event.location}</Text>
        </View>
      </View>
    </View>
    </Pressable>
    <Modal visible={isModalVisible} onRequestClose={() => setIsModalVisible(false)} animationType='slide' presentationStyle='pageSheet'>
      <EventDescription event={event} modalStateChange={modalStateChange}/>
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
    margin: 13,
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
