import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Text, ScrollView } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { auth, firebase, storage, database } from '../../firebase'
import { ref as ref_d, set, get, onValue } from 'firebase/database'
import { browserLocalPersistence, browserSessionPersistence, 
  getReactNativePersistence, createUserWithEmailAndPassword, 
  setPersistence, signInWithEmailAndPassword } from 'firebase/auth'

//   import { auth, firebase, storage, database } from '../../firebase'
// import { ref as ref_d, set, get, onValue } from 'firebase/database'
const SignupScreen = ({ navigation }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [domain, setDomain] = useState('');
  const [practice, setPractice] = useState('');

  const handleSignup = () => {
    // Implement your signup logic here
    // console.log('Signup attempt with:', { name, email, password, domain, practice });
    createUserWithEmailAndPassword(auth, email, password)
    .then(userCredentials => {
        const user = userCredentials.user;
        console.log('Registered with: ', user.email);
        // set user roles here
        set(ref_d(database, `userdata/${auth.currentUser.uid}/role/`), {
          isAdmin: false,
          isValidated: false,
          isFormateur: false
        })
        // NewUserTabs since isValidated=false
        navigation.navigate('UserTabs')
        navigation.push('RGPD', { userRoles: data, formateur: true, validated: 'true' });
    
    }).catch(error => alert(error.message))

  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Sign Up</Text>
      <TextInput
        style={styles.input}
        placeholder="Full Name"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <TextInput
        style={styles.input}
        placeholder="Confirm Password"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
      />
      <TextInput
        style={styles.input}
        placeholder="Domain of Practice"
        value={domain}
        onChangeText={setDomain}
      />
      <Picker
        selectedValue={practice}
        style={styles.picker}
        onValueChange={(itemValue) => setPractice(itemValue)}
      >
        <Picker.Item label="Select Medical Practice" value="" />
        <Picker.Item label="General Medicine" value="general" />
        <Picker.Item label="Pediatrics" value="pediatrics" />
        <Picker.Item label="Cardiology" value="cardiology" />
        {/* Add more medical practices as needed */}
      </Picker>
      <Button title="Sign Up" onPress={handleSignup} />
      <Button title="Already have an account? Log In" onPress={() => navigation.navigate('Login')} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  picker: {
    height: 50,
    marginBottom: 10,
  },
});

export default SignupScreen;