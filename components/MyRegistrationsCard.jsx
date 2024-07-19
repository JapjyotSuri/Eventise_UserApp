import {Image, Modal, Pressable, StyleSheet, Text, View} from 'react-native';
import React, {useState} from 'react';
import EventDescription from './EventDescription';
import Entypo from 'react-native-vector-icons/Entypo';
import Octicons from 'react-native-vector-icons/Octicons'
const MyRegistrationsCard = ({event,navigation,status}) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  function modalStateChange() {
    setIsModalVisible(false);
  }
  function TextColor(status){
    switch(status){
        case 'Approved':
            return  'green';
        case 'Rejected':
            return 'red';
        case 'pending':
            return 'yellow';

    }
  }
  return (
    <View>
      <Pressable onPress={() => setIsModalVisible(true)}>
        <View style={styles.card}>
          <View style={{flexDirection: 'row', width: '100%', gap: 10}}>
            <Image
              source={{uri: event.imgUrl}}
              style={{height: 85, width: 120, borderRadius: 10}}></Image>
            <View
              style={{
                width: '70%',
                flexDirection: 'column',
                justifyContent: 'center',
                gap: 5,
              }}>
              <Text style={{color: 'grey', fontSize: 15}}>
                {event.date
                  .toDate()
                  .toLocaleDateString('en-US', {
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric',
                  })}
              </Text>
              <Text style={{fontSize: 18, fontWeight: 500}}>{event.title}</Text>
              <View style={{flexDirection: 'row', width: '90%',justifyContent: 'space-between',alignItems: 'center'}}>
              <Text style={{color: 'grey', fontSize: 15}}>
                <Entypo name="location-pin" size={16} color="red" />
                {event.location}
              </Text>
              <View style={{flexDirection: 'row',alignItems: 'center',gap: 2.5}}>
                <Octicons name="dot-fill" size={24} color={TextColor(status)}/>
              <Text style={{color: TextColor(status), fontSize: 15}}>{status}</Text>
              </View>
              </View>
            </View>
          </View>
        </View>
      </Pressable>
      <Modal
        visible={isModalVisible}
        onRequestClose={() => setIsModalVisible(false)}
        animationType="slide"
        presentationStyle="pageSheet">
        <EventDescription event={event} modalStateChange={modalStateChange} navigation={navigation} />
      </Modal>
    </View>
  );
};

export default MyRegistrationsCard;

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#f3f3ff',
    width: '92%',
    height: 'auto',
    marginHorizontal: 14,
    marginVertical: 8,
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
    borderRadius: 10,
    shadowColor: 'rgba(0, 0, 0, 0.20)',
    shadowOffset: {width: 0, height: 3},
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 5,
  },
});
