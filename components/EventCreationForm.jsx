import { ActivityIndicator, Alert, Image, Pressable, StyleSheet, Text, TextInput, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Formik } from 'formik'
import auth,{firebase} from '@react-native-firebase/auth'
import { date } from 'yup'
import firestore from '@react-native-firebase/firestore' 
import DatePicker from 'react-native-date-picker'
import {launchImageLibrary} from 'react-native-image-picker';
import storage from '@react-native-firebase/storage';
const EventCreationForm = ({navigation,route}) => {
    const [selectedImage,setSelectedImage]=useState('');
    const [uploading,setUploading]=useState(false);
    const [transferred,setTransferred]=useState(0);
    const [urlOfImage,setUrl]=useState('');
    


   const {userId,name}=route.params;
    function handleGalleyOpen(){
        const options = {
            mediaType: 'photo',
            includeBase64: false,
            maxHeight: 2000,
            maxWidth: 2000,
          };
      
          launchImageLibrary(options, (response) => {
            if (response.didCancel) {
              console.log('User cancelled image picker');
            } else if (response.error) {
              console.log('Image picker error: ', response.error);
            } else {
              let imageUri = response.uri || response.assets?.[0]?.uri;//here I have used ?. it is called optional chaining in the case where response is null or undefined it will not throw an error and will give undefined as output
              console.log(imageUri)
              setSelectedImage(imageUri);
            }
          });
    }
    async function uploadImage(){
        if(selectedImage){
            setUploading(true);
            
            const uploaduri=selectedImage;
          let filename=uploaduri.substring(uploaduri.lastIndexOf('/')+1);//we are getting the file name using this as it is at the end after last /
          //Giving each image a unique file name as one image can be used mpre than once by different users but its name will get overwritten
          console.log(filename);
          const extension=filename.split('.').pop();//this contains the type of the image like jpg,png,etc
          console.log(extension);
          const name=filename.split('.').slice(0,-1).join('.');//this contains the name of the image
          console.log(name);
          filename=name+ Date.now() + '.' + extension;
          console.log(filename);
          const task= storage().ref(filename).putFile(uploaduri);
          task.on('state_changed', taskSnapshot => {
            console.log(`${taskSnapshot.bytesTransferred} transferred out of ${taskSnapshot.totalBytes}`);
            setTransferred(Math.round(taskSnapshot.bytesTransferred/taskSnapshot.totalBytes)*100);

          });
           try{
               await task;
               const urlImage = await storage().ref(filename).getDownloadURL();
               console.log(urlImage);
               setUrl(urlImage)
               setUploading(false);
               Alert.alert('Image has been uploaded successfully');
           } 
           catch(error){
                console.log(error);
           }
          }
    }
    async function newTaskFunc(values){
          console.log(values);
          console.log(userId);
          const url=`https://nominatim.openstreetmap.org/search?q=${values.location}&format=json&limit=1`
          try{
          const res=await fetch(url);
          const data=await res.json();
          console.log(data[0].lat);
          const location={lat: data[0].lat,lon: data[0].lon};
          console.log('Location',location);
          console.log('title',values.title);
          console.log('description',values.description);
          console.log('urlOfImage',urlOfImage)
          console.log('name',name)
          console.log('userId',userId)
            await firestore().collection('events').add({
                title: values.title,
                description: values.description,
                date: values.date,
                location: values.location,
                userId: userId,
                username: name,
                status: 'pending',
                imgUrl: urlOfImage,
                preciseLoaction: location,
    
              })
          }
          catch(error){
            console.log('error occured',error)
          }
         
    }
  return (
   <View>
   
    <Text style={{fontSize: 20, fontWeight: 'bold',marginVertical: 20}}>Create a new task:</Text>
    <Formik
                initialValues={{ title: '', description: '' ,date: new Date(),location: ''}}

                onSubmit={(values) => {
                    console.log(values)
                    newTaskFunc(values);
                    Alert.alert('task created')
                    navigation.navigate('Home')
                }}
            >
                {({
                    values,
                    errors,
                    touched,
                    handleChange,
                    handleSubmit,
                    setFieldValue

                }) => (
                    <View style={{ justifyContent: 'center', alignItems: 'center', width: '100%',}}>

                        <View>
                            <TextInput style={styles.input} placeholder='Title' value={values.title} onChangeText={handleChange('title')} />
                        </View>

                        <View>
                            <TextInput style={styles.input} placeholder='Description' value={values.description} onChangeText={handleChange('description')}  />
                        </View>
                        <View>
                            <DatePicker date={values.date} mode="date" onDateChange={(date)=> setFieldValue('date', date)}/>
                        </View>
                        <View>
                            <TextInput style={styles.input} placeholder='Location' value={values.location} onChangeText={handleChange('location')}  />
                        </View>
                        <View>
                        <View>
                             {selectedImage && <View><Image source={{uri: selectedImage}} style={{height: 100,width: 100}}></Image></View>}
                        </View>
                            <Pressable onPress={handleGalleyOpen} style={styles.btn}><Text>+ Add image from gallery</Text></Pressable>
                            <Pressable onPress={uploadImage}><Text>Upload image</Text></Pressable>
                            <View>
                                {uploading && 
                                <View>
                                   <Text>{transferred}% completed</Text>
                                   {/* <ActivityIndicator size={large}></ActivityIndicator> */}
                                </View>}
                            </View>
                        </View>
                        <View style={{ width: '100%' ,marginLeft: 50}}>
                            
                            <Pressable style={styles.btn} onPress={handleSubmit}><Text style={{ fontSize: 17, color: 'white', fontWeight: 'bold', }}>Create Task</Text></Pressable>

                            
                        </View>
                    </View>
                )}
            </Formik>
   </View>
  )
}

export default EventCreationForm

const styles = StyleSheet.create({
    
    input: {
        marginTop: 10,
        width: 350,
        height: 50,
        borderColor: 'black',
        borderWidth: 1,
        borderRadius: 5,
        paddingLeft: 10

    },
    btn: {
        height: 50,
        width: 350,
        backgroundColor: '#5D3FD3',
        marginTop: 10,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center'
    },
})
