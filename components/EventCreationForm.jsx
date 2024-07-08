import { Alert, Pressable, StyleSheet, Text, TextInput, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Formik } from 'formik'
import auth,{firebase} from '@react-native-firebase/auth'
import { date } from 'yup'
import firestore from '@react-native-firebase/firestore' 
import DatePicker from 'react-native-date-picker'
const EventCreationForm = ({navigation,route}) => {
   const {userId,name}=route.params;
   
    async function newTaskFunc(values){
          console.log(values);
          console.log(name);
          await firestore().collection('events').add({
            title: values.title,
            description: values.description,
            date: values.data,
            location: values.location,
            userId: userId,
            username: name,
          })
    }
  return (
   <View>
    <Text>Create a new task:</Text>
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

                }) => (
                    <View style={{ justifyContent: 'center', alignItems: 'center', width: '100%',}}>

                        <View>
                            <TextInput style={styles.input} placeholder='Title' value={values.title} onChangeText={handleChange('title')} />
                        </View>

                        <View>
                            <TextInput style={styles.input} placeholder='Description' value={values.description} onChangeText={handleChange('description')}  />
                        </View>
                        <View>
                            <DatePicker date={values.date} mode="date" onDataChange={(date)=> setFieldValue('date', date)}/>
                        </View>
                        <View>
                            <TextInput style={styles.input} placeholder='Location' value={values.location} onChangeText={handleChange('location')}  />
                        </View>
                        <>
                        </>
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
