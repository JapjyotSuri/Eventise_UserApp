import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native'
import React from 'react'
import { Formik } from 'formik'
import firestore from '@react-native-firebase/firestore'
const EditProfile = ({navigation,route}) => {
    const {name,email,currentUser}=route.params;
    async function updateDetails(values){
       if(currentUser){
        console.log("current user is",currentUser.uid);
        try{
            await firestore().collection('users').doc(currentUser.uid).update({
                name: values.name,
                email: values.email
            });
            console.log("successfully updated data")
        }
        catch(error){
            console.log("error occured",error)
        }
       }
    }
  return (
    <View style={{flex: 1,justifyContent: 'center', paddingLeft: 10}}>
      <Text>Edit Profile</Text>
      <Formik
      initialValues={{name: name,email: email}}
      onSubmit={values => {
        console.log("values of form submission are",values)
        updateDetails(values)
      }}>
        {
        (
            {
                values,
                handleChange,
                handleSubmit,
                handleBlur
              }
        ) => (
            <>
            <View >
            <Text style={styles.label}>Name:</Text>
            </View>
            <View>
            <TextInput style={styles.input} value={values.name} onChangeText={handleChange('name')} onBlur={handleBlur('name')}></TextInput>
            </View>
            <View >
            <Text style={styles.label}>Email:</Text>
            </View>
            <View>
            <TextInput style={styles.input} value={values.email} onChangeText={handleChange('email')}></TextInput>
            </View>
            <Pressable style={styles.btn} onPress={handleSubmit}>
                <Text  style={{fontSize: 17, color: 'white', fontWeight: 'bold'}}>Edit Details</Text>
            </Pressable>
            </>
        )
      }
        </Formik>
    </View>
  )
}

export default EditProfile

const styles = StyleSheet.create({
    input: {
        // marginTop: 10,
        minWidth: 100,
        // height: 50,
        // borderColor: 'black',
        // borderWidth: 1,
        // borderRadius: 5,
        // paddingLeft: 10,
        height: 40,
    borderBottomColor: 'lightgrey',
    borderBottomWidth: 1,
    borderBottomRadius: 5,
    paddingLeft: 5,
    fontSize: 20,
    color: 'grey'
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
        fontSize: 21,
        color: 'grey',
        marginVertical: 5,
      },
})