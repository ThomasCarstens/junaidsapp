import React, { useEffect, useState } from 'react';
import { 
  View, 
  TextInput, 
  StyleSheet, 
  Text, 
  Image, 
  TouchableOpacity, 
  KeyboardAvoidingView,
  ScrollView,
  Platform
} from 'react-native';
import { auth, database } from '../../firebase';
import { ref as ref_d, set } from 'firebase/database';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { Ionicons } from '@expo/vector-icons';

const SignupScreen = ({ navigation }) => {
  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  useEffect(() => {
    navigation.setOptions({
      headerShown: true,
      title: 'Créer un compte',
      headerStyle: {
        backgroundColor: '#00008B',
      },
      headerTintColor: '#fff',
      headerTitleStyle: {
        fontWeight: 'bold',
      },
    });
  }, [navigation]);
  const handleSignup = () => {
    if (password !== confirmPassword) {
      alert("Les mots de passe ne correspondent pas.");
      return;
    }

    createUserWithEmailAndPassword(auth, email, password)
      .then(userCredentials => {
        const user = userCredentials.user;
        console.log('Registered with: ', user.email);
        set(ref_d(database, `userdata/${user.uid}/role/`), {
          isAdmin: false,
          isValidated: false,
          isFormateur: false
        });
        set(ref_d(database, `userdata/${user.uid}/name/`), {
          prenom: name,
          nom: surname
        });
        navigation.navigate('UserTabs');
        navigation.push('RGPD');
      })
      .catch(error => alert(error.message));
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <ScrollView 
        contentContainerStyle={styles.scrollViewContent}
        keyboardShouldPersistTaps="handled"
      >
        <Image
          source={require('../../assets/images/logoEsculappl.png')}
          style={styles.logo}
        />
        <Text style={styles.title}>Esculappl</Text>
        <Text style={styles.subtitle}>Appli de Formations de Médecine Manuelle</Text>
        
        <View style={styles.formContainer}>
          <Text style={styles.inputLabel}>Prénom</Text>
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={setName}
          />
          
          <Text style={styles.inputLabel}>Nom</Text>
          <TextInput
            style={styles.input}
            value={surname}
            onChangeText={setSurname}
          />
          
          <Text style={styles.inputLabel}>Email</Text>
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          
          <Text style={styles.inputLabel}>Mot de passe</Text>
          <View style={styles.passwordContainer}>
            <TextInput
              style={styles.passwordInput}
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
            />
            <TouchableOpacity
              style={styles.eyeIcon}
              onPress={() => setShowPassword(!showPassword)}
            >
              <Ionicons
                name={showPassword ? 'eye-off' : 'eye'}
                size={24}
                color="#00008B"
              />
            </TouchableOpacity>
          </View>
          
          <Text style={styles.inputLabel}>Confirmer le mot de passe</Text>
          <View style={styles.passwordContainer}>
            <TextInput
              style={styles.passwordInput}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry={!showConfirmPassword}
            />
            <TouchableOpacity
              style={styles.eyeIcon}
              onPress={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              <Ionicons
                name={showConfirmPassword ? 'eye-off' : 'eye'}
                size={24}
                color="#00008B"
              />
            </TouchableOpacity>
          </View>
          
          <TouchableOpacity style={styles.button} onPress={handleSignup}>
            <Text style={styles.buttonText}>S'inscrire</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.secondaryButton} onPress={() => navigation.navigate('Login')}>
            <Text style={styles.secondaryButtonText}>J'ai déjà un compte: me connecter</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#00008B',
  },
  scrollViewContent: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  logo: {
    width: 150,
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
    marginBottom: 20,
  },
  formContainer: {
    width: '100%',
  },
  inputLabel: {
    color: 'white',
    marginBottom: 5,
    fontWeight: 'bold',
  },
  input: {
    width: '100%',
    height: 40,
    backgroundColor: 'white',
    borderRadius: 5,
    marginBottom: 15,
    paddingHorizontal: 10,
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    backgroundColor: 'white',
    borderRadius: 5,
  },
  passwordInput: {
    flex: 1,
    height: 40,
    paddingHorizontal: 10,
  },
  eyeIcon: {
    padding: 10,
  },
  button: {
    width: '100%',
    height: 40,
    backgroundColor: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    marginBottom: 10,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  secondaryButton: {
    width: '100%',
    height: 40,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
  },
  secondaryButtonText: {
    color: '#00008B',
    fontWeight: 'bold',
  },
});

export default SignupScreen;