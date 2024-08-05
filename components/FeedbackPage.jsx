import {
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
  SafeAreaView,
  Image,
  Alert,
} from 'react-native';
import React, {useState} from 'react';
import {Formik} from 'formik';
import {AirbnbRating, Rating} from 'react-native-ratings';
import firestore from '@react-native-firebase/firestore';
import EventCard from './EventCard';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {launchImageLibrary} from 'react-native-image-picker';
import storage from '@react-native-firebase/storage';
const FeedbackPage = ({route,navigation}) => {
  const [selectedImage, setSelectedImage] = useState('');
  const [imageSelected, setImageSelected] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [transferred, setTransferred] = useState(0);
  const [urlOfImage, setUrl] = useState('');
  const [uploaded, setUploaded] = useState(false);
  const {event, currentUserId} = route.params;
  //setting default values for the airBnbrating to remove warning regarding default props
  const count = 5
  const reviews = ['Terrible', 'Bad', 'Okay', 'Good', 'Great']
  const defaultRating = 0
  const size=30
  const showRating=false
  

  async function handleFeedbackSubmit(values) {
    if (currentUserId) {
      try {
        await firestore().collection('feedbacks').add({
          eventId: event.eventId,
          userId: currentUserId,
          title: values.title,
          description: values.description,
          rating: values.rating,
          imgUrl: urlOfImage,
        });
        console.log('successfully added');
        Alert.alert('Feedback successfully submitted');
        navigation.navigate('Home');
      } catch (error) {
        console.log('error occured', error);
      }
    }
    console.log('eventId: ', event.eventId);
    console.log('current user id', currentUserId);
  }
  function handleGalleyOpen() {
    const options = {
      mediaType: 'photo',
      includeBase64: false,
      maxHeight: 2000,
      maxWidth: 2000,
    };

    launchImageLibrary(options, response => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('Image picker error: ', response.error);
      } else {
        let imageUri = response.uri || response.assets?.[0]?.uri; //here I have used ?. it is called optional chaining in the case where response is null or undefined it will not throw an error and will give undefined as output
        console.log(imageUri);
        setSelectedImage(imageUri);
        setImageSelected(true);
      }
    });
  }
  async function uploadImage() {
    if (selectedImage) {
      setUploading(true);
      const uploaduri = selectedImage;
      let filename = uploaduri.substring(uploaduri.lastIndexOf('/') + 1); //we are getting the file name using this as it is at the end after last /
      //Giving each image a unique file name as one image can be used mpre than once by different users but its name will get overwritten
      // console.log(filename);
      const extension = filename.split('.').pop(); //this contains the type of the image like jpg,png,etc
      // console.log(extension);
      const name = filename.split('.').slice(0, -1).join('.'); //this contains the name of the image
      //slice(0,-1) while exclude the last element from the above array formed by split
      // console.log(name);
      filename = name + Date.now() + '.' + extension;
      // console.log(filename);
      const task = storage().ref(filename).putFile(uploaduri);
      task.on('state_changed', taskSnapshot => {
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
  return (
    <SafeAreaView style={{flex: 1, backgroundColor: 'white'}}>
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'start',
          backgroundColor: 'white',
          flexDirection: 'column',
        }}>
        <View style={{width: '100%'}}>
          <EventCard event={event} />
        </View>

        <View
          style={{
            height: '80%',
            marginLeft: 20,
            justifyContent: 'start',
            alignItems: 'start',
            
          }}>
          <Formik
            initialValues={{title: '', description: '', rating: 0}}
            onSubmit={values => {
              console.log(values);
              handleFeedbackSubmit(values);
            }}>
            {({values, handleChange, handleSubmit, setFieldValue}) => (
              <>
                <View style={{marginTop: 3}}>
                  <Text style={styles.label}>Rate your experience:</Text>
                </View>
                <View style={{marginTop: 3}}>
                  <AirbnbRating
                    count={count}
                    reviews={reviews}
                    defaultRating={defaultRating}
                    size={size}
                    showRating={showRating}
                    onFinishRating={rating => setFieldValue('rating', rating)}
                  />
                </View>
                <View style={{marginTop: 5}}>
                  <Text style={styles.label}>Share a video or photo:</Text>
                </View>
                <View
                  style={{
                    marginTop: 3,
                    height: 120,
                    width: 355,
                    borderColor: 'gray',
                    borderWidth: 2,
                    borderRadius: 10,
                    borderStyle: 'dashed',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  {!imageSelected && (
                    <MaterialIcons
                      name="add-a-photo"
                      size={30}
                      color="gray"
                      onPress={() => handleGalleyOpen()}
                    />
                  )}
                  {imageSelected && (
                    <View
                      style={{
                        borderRadius: 20,
                        shadowColor: '#000',
                        shadowOffset: {width: 0, height: 3},
                        shadowOpacity: 0.3,
                        shadowRadius: 5,
                        elevation: 5,
                      }}>
                      <View>
                        <Image
                          source={{uri: selectedImage}}
                          style={{height: 100, width: 200, borderRadius: 10}}
                          resizeMode="fill"></Image>
                      </View>
                    </View>
                  )}
                </View>
                <View>
                  {uploaded === false && (
                    <View
                      style={{alignItems: 'center', justifyContent: 'center'}}>
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
                <View style={{marginTop: 5}}>
                  <Text style={styles.label}>Title your feedback:</Text>
                </View>
                <View style={{marginTop: 3}}>
                  <TextInput
                    style={styles.input}
                    placeholder="What's most important to know?"
                    value={values.title}
                    onChangeText={handleChange('title')}
                  />
                </View>
                <View style={{marginTop: 5}}>
                  <Text style={styles.label}>Write your feedback:</Text>
                </View>

                <View style={{marginTop: 3}}>
                  <TextInput
                    style={[styles.input, {height: 'auto', minHeight: 90}]}
                    placeholder="What did you like or dislike? How was your experience?"
                    value={values.description}
                    onChangeText={handleChange('description')}
                    multiline={true}
                    textAlignVertical="top"
                  />
                </View>
                <Pressable style={styles.btn} onPress={handleSubmit}>
                  <Text
                    style={{fontSize: 17, color: 'white', fontWeight: 'bold'}}>
                    Submit
                  </Text>
                </Pressable>
              </>
            )}
          </Formik>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default FeedbackPage;

const styles = StyleSheet.create({
  input: {
    marginTop: 3,
    width: 350,
    height: 50,
    borderWidth: 1,
    borderRadius: 5,
    paddingLeft: 10,
    alignItems: 'flex-start',
    fontSize: 16,
    borderColor: 'gray',
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
  label: {
    fontSize: 18,

    marginVertical: 5,
    fontWeight: '600',
  },
  
});
