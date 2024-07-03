import { Alert, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native'
import React from 'react'
import { Formik } from 'formik'
import { SafeAreaView } from 'react-native-safe-area-context'
import * as Yup from 'yup'
import auth from '@react-native-firebase/auth'
import firestore from '@react-native-firebase/firestore'
const FormikLogin = ({ navigation }) => {

  async function signUpFunc(values) {


    try {
      const userCredential = await auth().createUserWithEmailAndPassword(values.email, values.password)
      console.log('values')
      const user = userCredential.user;
      const userData = {
        uid: user.uid,
        name: values.name,
        email: values.email,
        role: 1,
        isEmailVerified: false,

      }
      await firestore().collection('users').doc(user.uid).set(userData);
      Alert.alert("User created " + values.email)

      navigation.navigate('Login')
    }
    catch (error) {
      console.log(error)
      Alert.alert(error.nativeErrorMessage)
    }
  }




  //validation logic
  const SignupValidationSchema = Yup.object().shape({
    name: Yup.string().required('Name is required'),
    email: Yup.string().email('Please enter valid email').required('Email address is required'),

    password: Yup.string()
      .min(8, 'Should be min of 8 characters')
      .required('password is required').matches(
        /^(?=.*[a-z])(?=.*\d)[a-z\d]{8,}$/,
        "Must Contain 8 Characters, One Lowercase and One Number"
      ),

    confirmpassword: Yup.string()
      .min(8, 'Should be min of 8 characters')
      .required('Confirm Password is required').matches(
        /^(?=.*[a-z])(?=.*\d)[a-z\d]{8,}$/,
        "Must Contain 8 Characters, One Lowercase and One Number "
      )
  })

  return (
    <ScrollView>
      <SafeAreaView >
        <View style={{ justifyContent: 'center', alignItems: 'center' }}>
          <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Hello there,Lets get started</Text>
          <Formik
            initialValues={{ name: '', email: '', password: '', confirmpassword: '' }}
            validationSchema={SignupValidationSchema}
            onSubmit={(values) => {
              console.log(values)
              signUpFunc(values);
              navigation.navigate('Login')
            }}
          >
            {({
              values,
              errors,
              touched,
              handleChange,
              handleSubmit,

            }) => (
              <>
                <View>
                  <TextInput style={styles.input} placeholder='name' value={values.name} onChangeText={handleChange('name')} />
                </View>
                {(errors.name && touched.name) && <Text>{errors.name}</Text>}
                <View>
                  <TextInput style={styles.input} placeholder='Email' value={values.email} onChangeText={handleChange('email')} />
                </View>
                {(errors.email && touched.email) && <Text>{errors.email}</Text>}

                <View>
                  <TextInput style={styles.input} placeholder='Password' value={values.password} onChangeText={handleChange('password')} secureTextEntry={true} />
                </View>
                {(errors.password && touched.password) && <Text>{errors.password}</Text>}
                <View>
                  <TextInput style={styles.input} placeholder='Confirm Password' value={values.confirmpassword} onChangeText={handleChange('confirmpassword')} secureTextEntry={true} />
                </View>
                {(errors.confirmpassword && touched.confirmpassword) && <Text>{errors.confirmpassword}</Text>}
                <Pressable style={styles.btn} onPress={handleSubmit}><Text style={{ fontSize: 17, color: 'white', fontWeight: 'bold' }}>Sign up</Text></Pressable>
                <View style={{ flexDirection: 'row', marginTop: 10, justifyContent: 'flex-start' }}>
                  <Text>Already have an account? </Text>
                  <Pressable onPress={() => navigation.navigate('Login')}><Text style={{ color: '#5D3FD3' }}>Login</Text></Pressable>
                </View>
              </>
            )}
          </Formik>
        </View>
      </SafeAreaView>
    </ScrollView>
  )
}

export default FormikLogin

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
  }
})