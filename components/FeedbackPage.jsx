import { Pressable, StyleSheet, Text, TextInput, View ,SafeAreaView} from 'react-native'
import React from 'react'
import { Formik } from 'formik'
import { AirbnbRating, Rating } from 'react-native-ratings'
import firestore from '@react-native-firebase/firestore'
import EventCard from './EventCard'
const FeedbackPage = ({route}) => {
    const {event,currentUserId}=route.params;
    async function handleFeedbackSubmit(values){
        if(currentUserId){
       try{
            await firestore().collection('feedbacks').add({
            eventId: event.eventId,
            userId: currentUserId,
            title: values.title,
            description: values.description,
            rating: values.rating
            })
            console.log("successfully added")
       }
       catch(error){
         console.log("error occured",error)
       }
    }
    console.log("eventId: ",event.eventId) 
    console.log("current user id",currentUserId)
    }
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
    <View style={{flex: 1,justifyContent: 'center',alignItems: 'start',backgroundColor:'white',flexDirection: 'column',}}>
      <View style={{width: '100%'}}>
        <EventCard event={event}/>
       </View>
      
      <View style={{height: '80%',marginLeft: 20,justifyContent: 'start',alignItems: 'start' ,marginTop: 10}}> 
       
      <Formik
        initialValues={{title: '',description: '',rating: 0}}
        onSubmit={(values) => {
            console.log(values);
            handleFeedbackSubmit(values)
        }}
       
      >
      {({values,handleChange,handleSubmit,setFieldValue}) => (
        <>
        <View  style={{marginTop: 5}}>
            <Text style={styles.label}>Rate your experience:</Text>
        </View>
        <View style={{marginTop: 5}}>
        <AirbnbRating
                count={5}
                reviews={["Terrible", "Bad", "Okay", "Good", "Great"]}
                defaultRating={0}
                size={30}
                showRating={false}
                onFinishRating={(rating) => setFieldValue('rating', rating)}
              />
        </View>
        <View  style={{marginTop: 5}}>
            <Text style={styles.label}>Title your feedback:</Text>
            </View>
          <View style={{marginTop: 5}}>
                <TextInput
                  style={styles.input}
                  placeholder="What's most important to know?"
                  value={values.title}
                  onChangeText={handleChange('title')}
                />
              </View>
              <View  style={{marginTop: 5}}>
            <Text style={styles.label}>Write your feedback:</Text>
            </View>
          
              <View style={{marginTop: 5}}>
                <TextInput
                  style={[styles.input,{height: 'auto', minHeight: 90}]}
                  placeholder="What did you like or dislike? How was your experience?"
                  value={values.description}
                  onChangeText={handleChange('description')}
                  multiline={true}
                  textAlignVertical='top'
                />
              </View>
              <Pressable style={styles.btn} onPress={handleSubmit}>
                <Text style={{fontSize: 17, color: 'white', fontWeight: 'bold'}}>Submit</Text>
              </Pressable>
        </>
      )}
      </Formik>
      </View> 
    </View>
    </SafeAreaView>
  )
}

export default FeedbackPage

const styles = StyleSheet.create({
    input: {
        marginTop: 10,
        width: 350,
        height: 50,
        borderColor: 'black',
        borderWidth: 1,
        borderRadius: 5,
        paddingLeft: 10,
        alignItems: 'flex-start',
        fontSize: 16,
        
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
        fontWeight: '600'
    },
    // ratingContainer: {
    //     backgroundColor: '#f5f5f5',
    //     padding: 10,
    //     borderRadius: 10,
    //     alignItems: 'center', // Ensures the Rating component is centered
    //     marginBottom: 20, // Adds space below the rating component
    //   }, 
})