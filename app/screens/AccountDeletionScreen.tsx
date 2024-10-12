import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { auth, firebase, storage, database } from '../../firebase';
import { ref as ref_d, set, get, onValue, update } from 'firebase/database';

import {
  EmailAuthProvider,
  getAuth,
  reauthenticateWithCredential,
} from 'firebase/auth'
const AccountDeletionScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleDeleteAccount = async () => {
    const user = auth.currentUser
    if (email !== user.email) {
      Alert.alert("Erreur", "L'adresse e-mail ne correspond pas à celle du compte actuel.");
      return;
    }

    try {
      const credential = EmailAuthProvider.credential(email, password);
      await reauthenticateWithCredential(user, credential);
      console.log(`/userdata/${user.uid}`)
      const path = `/userdata/${user.uid}`
      const userRef = ref_d(database, path);
      await update(userRef, { accountExists: "Compte supprimé via l'application" })
        .then(async () => {
          console.log('test')
          await user.delete();
          Alert.alert("Compte supprimé", "Votre compte a été supprimé avec succès.");
          navigation.navigate("Login");
        })
        .catch((error) => {
          Alert.alert("Erreur", "Impossible de supprimer le compte. Veuillez réessayer plus tard.");
        });
    
      
    } catch (error) {
      Alert.alert("Erreur", `Impossible de supprimer le compte. ${error}`);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Supprimer votre compte</Text>
      <Text style={styles.description}>
        Cette action est irréversible. Veuillez confirmer votre identité en saisissant votre adresse e-mail et votre mot de passe.
      </Text>
      <TextInput
        style={styles.input}
        placeholder="Adresse e-mail"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Mot de passe"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <TouchableOpacity style={styles.deleteButton} onPress={handleDeleteAccount}>
        <Text style={styles.deleteButtonText}>Supprimer le compte</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.cancelButton} onPress={() => navigation.goBack()}>
        <Text style={styles.cancelButtonText}>Annuler</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f0f0f0',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
    color: '#666',
  },
  input: {
    backgroundColor: 'white',
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
    fontSize: 16,
  },
  deleteButton: {
    backgroundColor: '#ff3b30',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 10,
  },
  deleteButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  cancelButton: {
    backgroundColor: '#007aff',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default AccountDeletionScreen;