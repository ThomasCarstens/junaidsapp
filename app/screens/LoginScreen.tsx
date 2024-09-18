// import React from 'react';
// import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { auth, storage, database } from '../../firebase'
import { getDownloadURL, list, ref } from 'firebase/storage'
import React, { useEffect, useState } from 'react';
import { View, Text, Image, TouchableOpacity, TextInput, Button, StyleSheet, ActivityIndicator } from 'react-native';
import { signInWithEmailAndPassword } from 'firebase/auth';
// import { auth, database } from '../../firebase';
import { ref as ref_d, onValue } from 'firebase/database';
import AsyncStorage from '@react-native-async-storage/async-storage';


const LoginScreen = ({ navigation }) => {
  const renderButton = (title, phase, phaseName, onPress) => (
    <TouchableOpacity
      style={[styles.button, styles.buttonShadow]}
      onPress={onPress}
    >
      <Text style={styles.buttonTitle}>{title}</Text>
      <Text style={styles.buttonPhase}>{` ${phase} `}</Text>
    </TouchableOpacity>
  );
   const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(true);
  const [userRoles, setUserRoles] = useState({});
  const [uid, setUid] = useState('');

  useEffect(() => {
    auth.onAuthStateChanged(function(user) {
      checkCachedUser();
    });
  }, []);

  const checkCachedUser = async () => {
    try {
      const cachedUid = await AsyncStorage.getItem('userUid');
      console.log('cache:', cachedUid)
      if (cachedUid) {
        // User UID found in cache, check if still valid
        const user = auth.currentUser;

        if (user && user.uid === cachedUid) {
          // User is still logged in
          fetchUserRolesAndNavigate(cachedUid);
        } else {
          // Cached UID is no longer valid
          await AsyncStorage.removeItem('userUid');
          setLoading(false);
        }
      } else {
        // No cached UID found
        setLoading(false);
      }
    } catch (error) {
      console.error('Error checking cached user:', error);
      setLoading(false);
    }
  };

  const fetchUserRolesAndNavigate = (userId) => {
    const gameFileRef = ref_d(database, `userdata/${userId}`);
    
    onValue(gameFileRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        console.log('Userdata downloaded:', data);
        setUserRoles(data);
        navigation.navigate('UserTabs', { userRoles: data, formateur: true, validated: 'true' });
      } else {
        // No user data found, log out and show login screen
        handleLogout();
      }
      setLoading(false);
    });
  };

  const handleLogin = () => {
    setLoading(true);
    signInWithEmailAndPassword(auth, email, password)
      .then(async (userCredentials) => {
        const user = userCredentials.user;
        console.log('Logged in with:', user.email);
        // Cache the user's UID
        await AsyncStorage.setItem('userUid', user.uid);
        fetchUserRolesAndNavigate(user.uid);
      })
      .catch(error => {
        alert(error.message);
        setLoading(false);
      });
  };

  const handleLogout = async () => {
    try {
      await auth.signOut();
      await AsyncStorage.removeItem('userUid');
      setLoading(false);
    } catch (error) {
      console.error('Error logging out:', error);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }
  return (
    <View style={styles.container}>
      <Image source={require('../../assets/images/logoEsculappl.png')} style={styles.logo} />
      <View style={styles.titleContainer}>
        <Text style={styles.appTitle}>Esculappl</Text>
        <Text style={styles.appSlogan}>Appli de Formations de Médecine Manuelle</Text>
      </View>
      <Text style={styles.versionText}>Version « premieres images »</Text>
      <View style={styles.buttonContainer}>
        <View style={styles.buttonRow}>
        {/* {renderButton(
            "Vos formations",
            "",
            "Phase Etudiante",
            () => navigation.navigate('RestrainedTabs')
          )} */}
          {renderButton(
            "Accès Admin",
            "",
            "Phase Universitaire",
            () => navigation.navigate('AdminTabs')
          )}

        </View>
        {renderButton(
          "Partenaires",
          "",
          "",
          () => navigation.navigate('OrganizationsPartenaires')
        )}
        {/* {renderButton(
          "Accès Etudiant",
          "Phase 2",
          "Phase Etudiante",
          () => navigation.navigate('UserTabs')
        )}


        <View style={styles.buttonRow}>
        {renderButton(
          "Accès Formateur",
          "Phase 3",
          "Phase Formateurs connus",
          () => navigation.navigate('FormateurTabs')
        )}
        {renderButton(
          "Exemple d'Inscription de Formateur",
          "Phase 4",
          "Phase Formateurs inconnus",
          () => navigation.navigate('NewUserTabs')
        )} */}
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
      <Button title="Login" onPress={handleLogin} />
      <Button title="Sign Up" onPress={() => navigation.navigate('Signup')} />
      <Button title="Reset Password" onPress={() => navigation.navigate('PasswordReset')} />
      <Button title="Background Info" onPress={() => navigation.navigate('BackgroundInfo')} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#00008B', // Dark blue background
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  logo: {
    width: 150,
    height: 250,
    marginBottom: 20,
    marginTop:20,
    borderRadius:30,
  },
  titleContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  appTitle: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: 'bold',
  },
  appSlogan: {
    color: '#FFFFFF',
    fontSize: 18,
  },
  versionText: {
    color: '#FFFFFF',
    fontSize: 16,
    marginBottom: 30,
  },
  buttonContainer: {
    width: '100%',
    alignItems: 'flex-start'
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  button: {
    backgroundColor: '#FFFFFF',//#EAE0AE
    padding: 10,
    marginBottom: 10,
    marginLeft: 10,
    borderRadius: 30,
    alignItems: 'center',
    width: '48%',
  },
  buttonShadow: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  buttonTitle: {
    color: '#00008B',
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 5,
  },
  buttonPhase: {
    color: '#343432',
    fontSize: 14,
    fontStyle: "italic",
  },
});

export default LoginScreen;





