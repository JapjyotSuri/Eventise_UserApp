import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native'
import React from 'react'
import { Formik } from 'formik'
const FeedbackPage = () => {
    async function handleFeedbackSubmit(values){
        
    }
  return (
    <View style={{flex: 1,justifyContent: 'center',alignItems: 'start',marginLeft: 20}}>
        
      
      <Formik
        initialValues={{title: '',description: ''}}
        onSubmit={(values) => {
            console.log(values);
            handleFeedbackSubmit(values)
        }}
       
      >
      {({values,handleChange,handleSubmit}) => (
        <>
        <View >
            <Text style={styles.label}>Title your feedback:</Text>
            </View>
          <View>
                <TextInput
                  style={styles.input}
                  placeholder="What's most important to know?"
                  value={values.title}
                  onChangeText={handleChange('title')}
                />
              </View>
              <View >
            <Text style={styles.label}>Write your feedback:</Text>
            </View>
          
              <View>
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
})