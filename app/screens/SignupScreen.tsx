import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Text, ScrollView, Image, TouchableOpacity } from 'react-native';
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
  const [surname, setSurname] = useState('');
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
          isValidated: false, //Unless Formateur code is valid: Phase 3
          isFormateur: false
        })
        set(ref_d(database, `userdata/${auth.currentUser.uid}/name/`), {
          prenom: name,
          nom: surname
        })
        // NewUserTabs since isValidated=false
        navigation.navigate('UserTabs')
        navigation.push('RGPD');
    
    }).catch(error => alert(error.message))

  };

  return (
    <View style={styles.container}>
      <Image
        source={require('../../assets/images/logoEsculappl.png')}
        alt="Anatomical illustration"
        style={styles.image}
      />
      {/* <Image source={require('../../assets/images/logoEsculappl.png')} style={styles.logo} /> */}

      <Text style={styles.title}>Esculappl</Text>
      <Text style={styles.subtitle}>Appli de Formations de Médecine Manuelle</Text>
      <Text style={styles.version}></Text>
      
      <TextInput
        style={styles.input}
        placeholder="Prénom"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={styles.input}
        placeholder="Nom"
        value={surname}
        onChangeText={setSurname}
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
        placeholder="Mot de passe"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <TextInput
        style={styles.input}
        placeholder="Confirmer le mot de passe"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
      />
      
      <TouchableOpacity style={styles.button} onPress={handleSignup}>
        <Text style={styles.buttonText}>Se connecter</Text>
      </TouchableOpacity>
      
      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Login')}>
        <Text style={styles.buttonText}>J'ai déjà un compte: me connecter</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#0000A0',
  },
  image: {
    width: 200,
    height: 150,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: 'white',
    textAlign: 'center',
    marginBottom: 5,
  },
  version: {
    fontSize: 14,
    color: 'white',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    height: 40,
    backgroundColor: 'white',
    borderRadius: 5,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  button: {
    width: '100%',
    height: 40,
    backgroundColor: '#4CAF50', // A more muted green color
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    marginBottom: 10,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default SignupScreen;