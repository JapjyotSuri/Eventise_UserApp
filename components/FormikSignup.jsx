import {
  Alert,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import React from 'react';
import {Formik} from 'formik';
import * as Yup from 'yup';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
const FormikLogin = ({navigation}) => {
  async function signUpFunc(values) {
    try {
      const userCredential = await auth().createUserWithEmailAndPassword(
        values.email,
        values.password,
      );
      console.log('values');
      const user = userCredential.user;
      const userData = {
        uid: user.uid,
        name: values.name,
        email: values.email,
        role: 1,
        isEmailVerified: false,
      };
      await firestore().collection('users').doc(user.uid).set(userData);
      Alert.alert('User created ' + values.email);

      navigation.navigate('Login');
    } catch (error) {
      console.log(error);
      Alert.alert(error.nativeErrorMessage);
    }
  }

  //validation logic
  const SignupValidationSchema = Yup.object().shape({
    name: Yup.string().required('Name is required'),
    email: Yup.string()
      .email('Please enter valid email')
      .required('Email address is required'),

    password: Yup.string()
      .min(8, 'Should be min of 8 characters')
      .required('password is required')
      .matches(
        /^(?=.*[a-z])(?=.*\d)[a-z\d]{8,}$/,
        'Must Contain 8 Characters, One Lowercase and One Number',
      ),

    confirmpassword: Yup.string()
      .min(8, 'Should be min of 8 characters')
      .required('Confirm Password is required')
      .matches(
        /^(?=.*[a-z])(?=.*\d)[a-z\d]{8,}$/,
        'Must Contain 8 Characters, One Lowercase and One Number ',
      ),
  });

  return (
    <ScrollView>
      <View style={{justifyContent: 'center', alignItems: 'center'}}>
        <View style={{justifyContent: 'flex-start', alignItems: 'center'}}>
          <Image
            source={require('./LoginSignupBackgroundNobg.png')}
            style={styles.image}></Image>
        </View>
        <View style={{justifyContent: 'center', width: '88%'}}>
          <Text
            style={{
              fontSize: 20,
              fontWeight: 'bold',
              marginBottom: 15,
              color: '#1659ce',
            }}>
            Hello there,Lets get started!!!
          </Text>
        </View>

        <Formik
          initialValues={{
            name: '',
            email: '',
            password: '',
            confirmpassword: '',
          }}
          validationSchema={SignupValidationSchema}
          onSubmit={values => {
            console.log(values);
            signUpFunc(values);
            navigation.navigate('Login');
          }}>
          {({values, errors, touched, handleChange, handleSubmit}) => (
            <>
              <View>
                <TextInput
                  style={styles.input}
                  placeholder="name"
                  value={values.name}
                  onChangeText={handleChange('name')}
                />
              </View>
              {errors.name && touched.name && <Text style={{color: 'red'}}>{errors.name}</Text>}
              <View>
                <TextInput
                  style={styles.input}
                  placeholder="Email"
                  value={values.email}
                  onChangeText={handleChange('email')}
                />
              </View>
              {errors.email && touched.email && <Text style={{color: 'red'}}>{errors.email}</Text>}

              <View>
                <TextInput
                  style={styles.input}
                  placeholder="Password"
                  value={values.password}
                  onChangeText={handleChange('password')}
                  secureTextEntry={true}
                />
              </View>
              {errors.password && touched.password && (
                <Text style={{color: 'red'}}>{errors.password}</Text>
              )}
              <View>
                <TextInput
                  style={styles.input}
                  placeholder="Confirm Password"
                  value={values.confirmpassword}
                  onChangeText={handleChange('confirmpassword')}
                  secureTextEntry={true}
                />
              </View>
              {errors.confirmpassword && touched.confirmpassword && (
                <Text style={{color: 'red'}}>{errors.confirmpassword}</Text>
              )}
              <Pressable style={styles.btn} onPress={handleSubmit}>
                <Text
                  style={{fontSize: 17, color: 'white', fontWeight: 'bold'}}>
                  Sign up
                </Text>
              </Pressable>
              <View
                style={{
                  flexDirection: 'row',
                  marginTop: 10,
                  justifyContent: 'flex-start',
                }}>
                <Text>Already have an account? </Text>
                <Pressable onPress={() => navigation.navigate('Login')}>
                  <Text style={{color: '#1659ce'}}>Login</Text>
                </Pressable>
              </View>
            </>
          )}
        </Formik>
      </View>
    </ScrollView>
  );
};

export default FormikLogin;

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
  image: {
    height: 300,
    width: 300,
  },
});
