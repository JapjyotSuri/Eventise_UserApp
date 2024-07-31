import {
  Alert,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import React from 'react';
import {Formik} from 'formik';
import firestore from '@react-native-firebase/firestore';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import AntDesign from 'react-native-vector-icons/AntDesign';
import storage from '@react-native-firebase/storage';
import AsyncStorage from '@react-native-async-storage/async-storage';
import auth from '@react-native-firebase/auth';
const EditProfile = ({navigation, route}) => {
  const {name, email, currentUserUid} = route.params;
  async function updateDetails(values) {
    if (currentUserUid) {
      console.log('current user is', currentUserUid);
      try {
        await firestore().collection('users').doc(currentUserUid).update({
          name: values.name,
          email: values.email,
        });
        console.log('successfully updated data');
        Alert.alert('User data updated')
        navigation.navigate('Home')
      } catch (error) {
        console.log('error occured', error);
      }
    }
  }
  return (
    <View style={{flex: 1, justifyContent: 'center', justifyContent: ''}}>
      <View
        style={{
          height: '40%',
          backgroundColor: '#1659ce',
          justifyContent: 'flex-start',
          alignItems: 'center',
          flexDirection: 'column',
          gap: 30,
          padding: 20,
          paddingTop: 80,
        }}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            width: '100%',
          }}>
          <AntDesign
            onPress={() => navigation.navigate('My Registrations')}
            name="back"
            size={27}
            color="white"
          />
          <Text
            style={{
              color: 'white',
              fontSize: 20,
              fontWeight: 'bold',
            }}>
            Edit Profile
          </Text>
          <View
            style={{backgroundColor: 'white', padding: 4, borderRadius: 20}}>
            <AntDesign
              name="logout"
              style={{color: 'red', fontSize: 27}}
              onPress={async () => {
                await AsyncStorage.removeItem('KeepLoggedIn');
                await AsyncStorage.removeItem('Token');
                await auth().signOut();
                navigation.navigate('Login');
                navigation.navigate('Login');
              }}
            />
          </View>
        </View>
        <FontAwesome
          name="user-circle"
          size={100}
          color="white"
          style={styles.profilePic}
        />
      </View>
      <View style={styles.card}>
        <Formik
          initialValues={{name: name, email: email}}
          onSubmit={values => {
            console.log('values of form submission are', values);
            updateDetails(values);
          }}>
          {({values, handleChange, handleSubmit, handleBlur}) => (
            <>
              <View style={{marginTop: 5}}>
                <Text style={styles.label}>Name:</Text>
              </View>
              <View style={{marginTop: 5}}>
                <TextInput
                  style={styles.input}
                  value={values.name}
                  onChangeText={handleChange('name')}
                  onBlur={handleBlur('name')}></TextInput>
              </View>
              <View style={{marginTop: 5}}>
                <Text style={styles.label}>Email:</Text>
              </View>
              <View style={{marginTop: 5}}>
                <TextInput
                  style={styles.input}
                  value={values.email}
                  onChangeText={handleChange('email')}></TextInput>
              </View>
              <Pressable style={styles.btn} onPress={handleSubmit}>
                <Text
                  style={{fontSize: 17, color: 'white', fontWeight: 'bold'}}>
                  Edit Details
                </Text>
              </Pressable>
            </>
          )}
        </Formik>
      </View>
    </View>
  );
};

export default EditProfile;

const styles = StyleSheet.create({
  input: {
    minWidth: 100,

    height: 40,
    borderBottomColor: 'lightgrey',
    borderBottomWidth: 1,
    borderBottomRadius: 5,

    paddingLeft: 5,
    fontSize: 17,
    color: 'grey',
  },
  btn: {
    height: 50,
    width: 350,
    backgroundColor: '#1659ce',
    marginTop: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  label: {
    fontSize: 18,
    marginVertical: 5,
    fontWeight: '600',
  },
  card: {
    backgroundColor: 'white',
    width: '100%',
    // height: '65%',
    flex: 1,
    borderRadius: 30,
    padding: 20,
    marginTop: -30,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 3},
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
    paddingHorizontal: 20,
    paddingTop: 80,
  },
  profilePic: {
    shadowColor: 'rgba(0, 0, 0, 0.25)',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 1,
    shadowRadius: 4,
    elevation: 5,
  },
});
