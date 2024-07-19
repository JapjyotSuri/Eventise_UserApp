import {
  Alert,
  Image,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {Formik} from 'formik';
import * as Yup from 'yup';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
const EventRegistrationForm = ({navigation, route}) => {
  const [eventId, setEventId] = useState('');
  const [userId, setUserId] = useState('');
  const registrationFormValidation = Yup.object().shape({
    name: Yup.string().required('Name is required'),
    email: Yup.string()
      .email('Please enter valid Email')
      .required('Email is required'),
    PhoneNumber: Yup.string()
      .matches(/^[0-9]{10}$/, 'Phone number must be exactly 10 digits')
      .required('Phone number is required'),
  });
  const {event} = route.params;
  async function registerHandler(values) {
    try {
      console.log(eventId);
      console.log(userId);
      console.log(values);
      console.log(event);
      await firestore().collection('registrations').add({
        name: values.name,
        email: values.email,
        phoneNummber: values.PhoneNumber,
        userId: userId,
        eventId: eventId,
        status: 'pending',
      });
      Alert.alert('Event Registered Successfully');
    } catch (error) {
      console.log('error occured', error);
    }
  }
  async function getEventId() {
    try {
      const eventQuery = await firestore()
        .collection('events')
        .where('title', '==', event.title)
        .get();
      if (!eventQuery.empty) {
        const docEvent = eventQuery.docs[0];
        console.log(docEvent.id);
        setEventId(docEvent.id);
      } else {
        console.log('error occured eventQuery wrong');
      }
    } catch (error) {
      console.log('error occured');
    }
  }
  useEffect(() => {
    const unsubscribe = auth().onAuthStateChanged(user => {
      if (user) {
        setUserId(user.uid);
        console.log(event);
        getEventId();
      } else {
        Alert.alert('Sign in first');
      }
    });
    return () => unsubscribe();
  }, []);
  return (
    <View style={{alignItems: 'center', height: '100%'}}>
      <Image
        source={require('./Registerpagepicture.png')}
        style={{height: 300}}
        resizeMode="contain"></Image>
      <Formik
        initialValues={{
          name: '',
          email: '',
          PhoneNumber: '',
        }}
        onSubmit={values => {
          registerHandler(values);
          navigation.navigate('Home');
        }}
        validationSchema={registrationFormValidation}>
        {({values, errors, touched, handleChange, handleSubmit}) => (
          <>
            <View>
              <TextInput
                style={styles.input}
                placeholder="Name"
                value={values.name}
                onChangeText={handleChange('name')}
              />
            </View>
            <View style={{ width: '89%',justifyContent: 'flex-start',marginTop: 4}}>
            {errors.name && touched.name && <Text style={{color: 'red'}}>{errors.name}</Text>}
            </View>
            <View>
              <TextInput
                style={styles.input}
                placeholder="Email"
                value={values.email}
                onChangeText={handleChange('email')}
              />
            </View>
            <View style={{ width: '89%',justifyContent: 'flex-start',marginTop: 4}}>
            {errors.email && touched.email && <Text >{errors.email}</Text>}
            </View>
            
            <View>
              <TextInput
                style={styles.input}
                placeholder="Phone number"
                value={values.PhoneNumber}
                onChangeText={handleChange('PhoneNumber')}
              />
            </View>
            <View style={{ width: '89%',justifyContent: 'flex-start',marginTop: 4}}>
            {errors.PhoneNumber && touched.PhoneNumber && <Text >{errors.PhoneNumber}</Text>}
            </View>
           
            <View>
              <Pressable style={styles.btn} onPress={handleSubmit}>
                <Text
                  style={{fontSize: 17, color: 'white', fontWeight: 'bold'}}>
                  Register for Event
                </Text>
              </Pressable>
            </View>
          </>
        )}
      </Formik>
    </View>
  );
};

export default EventRegistrationForm;

const styles = StyleSheet.create({
  input: {
    marginTop: 10,
    width: 350,
    height: 50,
    borderColor: 'black',
    borderWidth: 1,
    borderRadius: 5,
    paddingLeft: 10,
  },
  btn: {
    height: 50,
    width: 350,
    backgroundColor: '#1659ce',
    marginTop: 10,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
