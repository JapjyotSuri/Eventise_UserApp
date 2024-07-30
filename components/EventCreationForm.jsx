import {
  Alert,
  Image,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import React, {useState} from 'react';
import {Formik} from 'formik';
import firestore from '@react-native-firebase/firestore';
import DatePicker from 'react-native-date-picker';
import {launchImageLibrary} from 'react-native-image-picker';
import storage from '@react-native-firebase/storage';
import * as Yup from 'yup';
import Ionicons from 'react-native-vector-icons/Ionicons';
const EventCreationForm = ({navigation, route}) => {
  const [selectedImage, setSelectedImage] = useState('');
  const [uploading, setUploading] = useState(false);
  const [transferred, setTransferred] = useState(0);
  const [urlOfImage, setUrl] = useState('');
  const [uploaded, setUploaded] = useState(false);
  const EventCreationValidation = Yup.object().shape({
    title: Yup.string().required('Name is required'),
    description: Yup.string().required('Name is required'),
    location: Yup.string().required('Name is required'),
  });
  const {userId, name, email} = route.params;
  function handleGalleyOpen() {
    const options = {
      mediaType: 'photo',
      includeBase64: false,//We dont want to include the base64 representation of the image in the response
      maxHeight: 2000,
      maxWidth: 2000,
    };

    launchImageLibrary(options, response => {
      if (response.didCancel) {//if the user closes the gallery without selecting an image
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('Image picker error: ', response.error);
      } else {
        console.log('response from launch gallery function',response)
        let imageUri = response.uri || response.assets?.[0]?.uri; //here I have used ?. it is called optional chaining in the case where response is null or undefined it will not throw an error and will give undefined as output
        console.log(imageUri);
        setSelectedImage(imageUri);
      }
    });
  }
  async function uploadImage() {
    if (selectedImage) {
      setUploading(true);
      const uploaduri = selectedImage;
      let filename = uploaduri.substring(uploaduri.lastIndexOf('/') + 1); //we are getting the file name using this as it is at the end after last /
      //Giving each image a unique file name as one image can be used more than once by different users but its name will get overwritten
      console.log(filename);
      const extension = filename.split('.').pop(); //this contains the type of the image like jpg,png,etc which is at the part after dot
      console.log(extension);
      const name = filename.split('.').slice(0, -1).join('.'); //this contains the name of the image
      console.log(name);
      filename = name + Date.now() + '.' + extension;//Here we are making a name for the file unique as it now contains the current timestamp the image was uploaded
      console.log(filename);
      const task = storage().ref(filename).putFile(uploaduri);
      task.on('state_changed', taskSnapshot => {//this we have made to show how much percent of the uplaoding is done based on bytes transfered
        console.log(
          `${taskSnapshot.bytesTransferred} transferred out of ${taskSnapshot.totalBytes}`,
        );
        setTransferred(
          Math.round(taskSnapshot.bytesTransferred / taskSnapshot.totalBytes) *
            100,
        );
      });
      try {
        await task;
        const urlImage = await storage().ref(filename).getDownloadURL();
        console.log(urlImage);
        setUrl(urlImage);
        setUploading(false);
        Alert.alert('Image has been uploaded successfully');
        setUploaded(true);
      } catch (error) {
        console.log(error);
      }
    }
  }
  async function newTaskFunc(values) {
    console.log(values);
    console.log(userId);
    const url = `https://nominatim.openstreetmap.org/search?q=${values.location}&format=json&limit=1`;
    try {
      const res = await fetch(url);
      const data = await res.json();
      console.log(data[0].lat);
      const location = {lat: data[0].lat, lon: data[0].lon};
      console.log('Location', location);
      console.log('title', values.title);
      console.log('description', values.description);
      console.log('urlOfImage', urlOfImage);
      console.log('name', name);
      console.log('userId', userId);
      await firestore().collection('events').add({
        title: values.title,
        description: values.description,
        date: values.date,
        location: values.location,
        userId: userId,
        username: name,
        status: 'Pending',
        imgUrl: urlOfImage,
        preciseLoaction: location,
        email: email,
      });
    } catch (error) {
      console.log('error occured', error);
    }
  }
  return (
    <View>
      <Text
        style={{
          fontSize: 20,
          fontWeight: 'bold',
          color: '#1659ce',
          marginLeft: 15,
        }}>
        Create a new Event:
      </Text>
      <Formik
        initialValues={{
          title: '',
          description: '',
          date: new Date(),
          location: '',
        }}
        validationSchema={EventCreationValidation}
        onSubmit={values => {
          console.log(values);
          newTaskFunc(values);
          Alert.alert('Event created');
          navigation.navigate('Home');
        }}>
        {({
          values,
          errors,
          touched,
          handleChange,
          handleSubmit,
          setFieldValue,
        }) => (
          <View
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              width: '100%',
            }}>
            <View>
              <TextInput
                style={styles.input}
                placeholder="Title"
                value={values.title}
                onChangeText={handleChange('title')}
              />
            </View>
            <View style={{width: '100%', marginLeft: 50, marginTop: 5}}>
              {errors.title && touched.title && (
                <Text style={{color: 'red'}}>{errors.title}</Text>
              )}
            </View>
            <View>
              <TextInput
                style={styles.input}
                placeholder="Description"
                value={values.description}
                onChangeText={handleChange('description')}
              />
            </View>
            <View style={{width: '100%', marginLeft: 50, marginTop: 5}}>
              {errors.description && touched.description && (
                <Text style={{color: 'red'}}>{errors.description}</Text>
              )}
            </View>
            <View>
              <DatePicker
                date={values.date}
                minimumDate={new Date()}
                mode="date"
                onDateChange={date => setFieldValue('date', date)}
              />
            </View>
            <View>
              <TextInput
                style={styles.input}
                placeholder="Location"
                value={values.location}
                onChangeText={handleChange('location')}
              />
            </View>
            <View style={{width: '100%', marginLeft: 50, marginTop: 5}}>
              {errors.location && touched.location && (
                <Text style={{color: 'red'}}>{errors.location}</Text>
              )}
            </View>
            <View>
              <View
                style={{
                  marginTop: 5,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                {selectedImage && (
                  <View
                    style={{
                      borderRadius: 20,
                      shadowColor: '#000',
                      shadowOffset: {width: 0, height: 3},
                      shadowOpacity: 0.3,
                      shadowRadius: 5,
                      elevation: 5,
                      height: 140,
                      width: 140,
                    }}>
                    <View>
                      <Image
                        source={{uri: selectedImage}}
                        style={{height: 140, width: 140, borderRadius: 10}}
                        resizeMode="cover"></Image>
                    </View>
                  </View>
                )}
              </View>
              <Pressable onPress={handleGalleyOpen} style={styles.btn}>
                <Text
                  style={{fontSize: 17, color: 'white', fontWeight: 'bold'}}>
                  + Add image from gallery
                </Text>
              </Pressable>

              {uploaded === false && (
                <View style={{alignItems: 'center', justifyContent: 'center'}}>
                  <Pressable onPress={uploadImage} style={styles.btn}>
                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 5,
                      }}>
                      <Text
                        style={{
                          fontSize: 17,
                          color: 'white',
                          fontWeight: 'bold',
                        }}>
                        <Ionicons
                          name="cloud-upload-sharp"
                          size={25}
                          color="white"
                          style={{fontWeight: 'bold'}}
                        />
                      </Text>
                      <Text
                        style={{
                          fontSize: 17,
                          color: 'white',
                          fontWeight: 'bold',
                        }}>
                        Upload image{' '}
                      </Text>
                      <Text
                        style={{
                          fontSize: 17,
                          color: 'white',
                          fontWeight: 'bold',
                        }}>
                        {' '}
                        {uploading && <Text>{transferred}%</Text>}
                      </Text>
                    </View>
                  </Pressable>
                </View>
              )}
              {uploaded === true && (
                <View>
                  <Pressable onPress={uploadImage} style={styles.btn}>
                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 5,
                      }}>
                      <Text
                        style={{
                          fontSize: 17,
                          color: 'white',
                          fontWeight: 'bold',
                        }}>
                        <Ionicons
                          name="cloud-upload-sharp"
                          size={25}
                          color="white"
                          style={{fontWeight: 'bold'}}
                        />
                      </Text>
                      <Text
                        style={{
                          fontSize: 17,
                          color: 'white',
                          fontWeight: 'bold',
                        }}>
                        Image uploaded
                      </Text>
                    </View>
                  </Pressable>
                </View>
              )}
            </View>
            <View style={{width: '100%', marginLeft: 50}}>
              <Pressable style={styles.btn} onPress={handleSubmit}>
                <Text
                  style={{fontSize: 17, color: 'white', fontWeight: 'bold'}}>
                  Create Event
                </Text>
              </Pressable>
            </View>
          </View>
        )}
      </Formik>
    </View>
  );
};

export default EventCreationForm;

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
    height: 45,
    width: 350,
    backgroundColor: '#1659ce',
    marginTop: 10,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
