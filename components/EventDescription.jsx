import {Alert, Image, Pressable, StyleSheet, Text, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import firestore, {onSnapshot} from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import Entypo from 'react-native-vector-icons/Entypo';
import Fontisto from 'react-native-vector-icons/Fontisto';
import Share from 'react-native-share';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
const EventDescription = ({event, modalStateChange, navigation}) => {
  const [alreadyRegistered, setAlreadyRegistered] = useState(false);
  const [currentUserId, setCurrentUserId] = useState('');
  const [dateHasPassed, setDateHasPassed] = useState(false);
  useEffect(() => {
    const currentDate = new Date();
    if (event.date.toDate() <= currentDate) {
      setDateHasPassed(true);
      console.log('date has passed');
    }
  }, []);
  function handleShare() {
    const eventDetails = `
    
📅 Event Date: ${event.date.toDate().toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    })}
📌 Event Title: ${event.title}
📍 Location: ${event.location}
📧 Contact Email: ${event.email}
ℹ️ Event Description: ${event.description}
📸 Image: ${event.imgUrl}`;
    const options = {
      message: eventDetails,
      recipient: '919988461194',
    };
    Share.open(options)
      .then(res => console.log(res))
      .catch(error => console.log(error));
  }

  useEffect(() => {
    const unsubscribe = auth().onAuthStateChanged(async user => {
      if (user) {
        setCurrentUserId(user.uid);
        const registrationQuery = await firestore()
          .collection('registrations')
          .where('eventId', '==', event.eventId)
          .where('userId', '==', user.uid)
          .get();

        if (!registrationQuery.empty) {
          setAlreadyRegistered(true);
        }
      }
      return () => unsubscribe();
    });
  }, [event.eventId]);
  return (
    <SafeAreaView>
      <View>
        <Image
          source={{uri: event.imgUrl}}
          style={{width: '100%', height: '43%'}}></Image>

        <View style={styles.card}>
          <View
            style={{
              width: '100%',
              flexDirection: 'row',
              alignItems: 'center',
              gap: 12,
              justifyContent: 'space-between',
            }}>
            <Text style={{fontSize: 25, fontWeight: 500}}>{event.title}</Text>
            <View style={{marginBottom: 8}}>
              <Pressable onPress={handleShare}>
                <Entypo name="share-alternative" size={23} />
              </Pressable>
            </View>
          </View>
          <View
            style={{
              flexDirection: 'row',
              width: '100%',
              justifyContent: 'space-between',
            }}>
            <Pressable>
              <Text style={{fontSize: 17, color: '#9CA3AF'}}>
                {event.date.toDate().toLocaleDateString('en-US', {
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </Text>
            </Pressable>
            <Pressable>
              <Text style={{fontSize: 17, color: '#9CA3AF'}}>
                <Entypo name="location-pin" size={19} color="red" />
                {event.location}
              </Text>
            </Pressable>
          </View>

          <Text style={{fontSize: 23}}>Event Overview:</Text>
          <Text style={{fontSize: 17, color: '#9CA3AF', textAlign: 'justify'}}>
            {event.description}
          </Text>
          {alreadyRegistered && !dateHasPassed && (
            <Text
              style={{
                fontSize: 15,
                color: '#1659ce',
                textAlign: 'justify',
                textDecorationLine: 'underline',
              }}
              onPress={() => {
                navigation.navigate('Feedback', {
                  event: event,
                  currentUserId: currentUserId,
                });
                modalStateChange();
              }}>
              Share your feedback!!!
            </Text>
          )}
          <View
            style={{
              justifyContent: 'flex-end',
              left: 25,
              bottom: 15,
              position: 'absolute',
            }}>
            <View style={{marginTop: 50}}>
              <Text style={{fontSize: 20}}>For more information : </Text>
              <View
                style={{
                  flexDirection: 'row',
                  width: '100%',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}>
                <Text style={{fontSize: 17, color: '#9CA3AF'}}>
                  {event.username}
                </Text>
                <View
                  style={{flexDirection: 'row', alignItems: 'center', gap: 3}}>
                  <Text>
                    <Fontisto
                      name="email"
                      size={19}
                      style={{marginTop: 4, color: '#9CA3AF'}}
                    />
                  </Text>
                  <Text style={{fontSize: 17, color: '#9CA3AF'}}>
                    {event.email}
                  </Text>
                </View>
              </View>
            </View>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'center',
                paddingHorizontal: 10,
                marginTop: 4,
                marginBottom: 4,
                gap: 20,
              }}>
              <View>
                {alreadyRegistered ? (
                  dateHasPassed ? (
                    <View>
                      <Pressable
                        onPress={() => {
                          Alert.alert(
                            'You have already registered for this event',
                          );
                          navigation.navigate('Feedback', {
                            event: event,
                            currentUserId: currentUserId,
                            
                          });
                          modalStateChange();
                        }}
                        style={[
                          styles.btn,
                          {backgroundColor: '#FDE68A', padding: 4, width: 170},
                        ]}>
                        <Text style={{fontSize: 19, color: '#DAA520'}}>
                          Feedback
                        </Text>
                      </Pressable>
                    </View>
                  ) : (
                    <View>
                      <Pressable
                        onPress={() => {
                          Alert.alert(
                            'You have already registered for this event',
                          );
                          modalStateChange();
                        }}
                        style={[
                          styles.btn,
                          {backgroundColor: '#BBF7D0', padding: 4, width: 170},
                        ]}>
                        <Text style={{fontSize: 20, color: '#065F46'}}>
                          Registered
                        </Text>
                      </Pressable>
                    </View>
                  )
                ) : (
                  <View>
                    <Pressable
                      onPress={() => {
                        navigation.navigate('Event Registration', {
                          event: event,
                        });
                        modalStateChange();
                      }}
                      style={[styles.btn, {backgroundColor: '#BBF7D0'}]}>
                      <Text style={{fontSize: 20, color: '#065F46'}}>
                        Register
                      </Text>
                    </Pressable>
                  </View>
                )}
              </View>

              <Pressable onPress={() => modalStateChange()} style={styles.btn}>
                <Text style={{fontSize: 20, color: '#991B1B'}}>Close</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default EventDescription;

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'white',
    width: '100%',
    height: '61%',
    borderRadius: 15,
    padding: 20,
    marginTop: -30,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 3},
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
    gap: 10,
  },
  btn: {
    height: 50,
    width: 140,
    backgroundColor: '#FECACA',
    marginTop: 10,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
