import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  ActivityIndicator,
  KeyboardAvoidingView,
  ScrollView,
  Platform
} from 'react-native';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { ref as ref_d, onValue } from 'firebase/database';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { auth, database } from '../../firebase';

const LoginScreen = ({ navigation }) => {
  // State variables for form inputs and UI control
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(true);
  const [userRoles, setUserRoles] = useState({});
  const [uid, setUid] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Effect hook to check authentication state on component mount
  useEffect(() => {
    // Listen for authentication state changes
    auth.onAuthStateChanged(function(user) {
      checkCachedUser();
    });
  }, []);

  /**
   * Checks if there's a cached user and validates their session
   * Handles automatic login for returning users
   */
  const checkCachedUser = async () => {
    try {
      // Retrieve cached user UID from AsyncStorage
      const cachedUid = await AsyncStorage.getItem('userUid');
      console.log('Cached UID:', cachedUid);

      if (cachedUid) {
        const user = auth.currentUser;

        if (user && user.uid === cachedUid) {
          // User is still authenticated with the same UID - proceed with login
          fetchUserRolesAndNavigate(cachedUid);
        } else if (user) {
          // Different user is logged in - sign out and clear cache
          try {
            await auth.signOut();
            await AsyncStorage.removeItem('userUid');
            setLoading(false);
          } catch (error) {
            console.error('Error logging out previous user:', error);
          }
        } else {
          // Cached UID is invalid - clear cache and show login
          await AsyncStorage.removeItem('userUid');
          setLoading(false);
        }
      } else {
        // No cached user found - show login screen
        setLoading(false);
      }
    } catch (error) {
      console.error('Error checking cached user:', error);
      setLoading(false);
    }
  };

  /**
   * Fetches user roles from Firebase database and navigates to appropriate screen
   * @param {string} userId - The user's UID
   */
  const fetchUserRolesAndNavigate = (userId) => {
    const userDataRef = ref_d(database, `userdata/${userId}`);

    onValue(userDataRef, (snapshot) => {
      const data = snapshot.val();
      
      if (data) {
        console.log('User data downloaded:', data);
        
        // Navigate to user tabs with user data
        // Note: Admin functionality is currently commented out
        // if (data.role.isAdmin === true) {
        //   navigation.navigate('AdminTabs', { userRoles: data, formateur: true, validated: 'true' });
        // } else {
          navigation.navigate('UserTabs', { 
            userRoles: data, 
            formateur: true, 
            validated: 'true' 
          });
        // }
      } else {
        // No user data found in database - log out user
        handleLogout();
      }
      setLoading(false);
    });
  };

  /**
   * Handles user login with email and password
   * Caches user UID on successful login
   */
  const handleLogin = () => {
    setLoading(true);
    
    signInWithEmailAndPassword(auth, email, password)
      .then(async (userCredentials) => {
        const user = userCredentials.user;
        console.log('Successfully logged in with:', user.email);
        
        // Cache the user's UID for future automatic login
        await AsyncStorage.setItem('userUid', user.uid);
        
        // Fetch user data and navigate to main app
        fetchUserRolesAndNavigate(user.uid);
      })
      .catch(error => {
        // Display error message to user
        alert(error.message);
        setLoading(false);
      });
  };

  /**
   * Handles user logout
   * Clears cached user data and returns to login screen
   */
  const handleLogout = async () => {
    try {
      await auth.signOut();
      await AsyncStorage.removeItem('userUid');
      setLoading(false);
    } catch (error) {
      console.error('Error during logout:', error);
      setLoading(false);
    }
  };

  /**
   * Reusable button component renderer
   * @param {string} title - Button text
   * @param {function} onPress - Button press handler
   * @param {object} buttonStyle - Additional button styling
   * @param {object} textStyle - Additional text styling
   */
  const renderButton = (title, onPress, buttonStyle, textStyle) => (
    <TouchableOpacity
      style={[styles.button, styles.buttonShadow, buttonStyle]}
      onPress={onPress}
    >
      <Text style={[styles.buttonText, textStyle]}>{title}</Text>
    </TouchableOpacity>
  );

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#FFFFFF" />
      </View>
    );
  }

  // Main login screen render
  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <ScrollView 
        contentContainerStyle={styles.scrollViewContent}
        keyboardShouldPersistTaps="handled"
      >
        {/* App Logo */}
        <Image 
          source={require('../../assets/images/logo_placeholder.png')} 
          style={styles.logo2} 
        />
        
        {/* App Title and Tagline */}
        <View style={styles.titleContainer}>
          <Text style={styles.appTitle}>QalkingPal</Text>
          <Text style={styles.appSlogan}>Default Login Page for App Version</Text>
        </View>

        {/* Login Form */}
        <View style={styles.formContainer}>
          {/* Email Input */}
          <Text style={styles.inputLabel}>Email</Text>
          <TextInput
            style={styles.input}
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          {/* Password Input with Toggle Visibility */}
          <Text style={styles.inputLabel}>Mot de passe</Text>
          <View style={styles.passwordContainer}>
            <TextInput
              style={styles.passwordInput}
              placeholder="Mot de passe"
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

          {/* Primary Action Buttons */}
          <View style={styles.buttonRow}>
            {renderButton(
              "Se connecter", 
              handleLogin, 
              styles.primaryButton, 
              styles.primaryButtonText
            )}
            {renderButton(
              "Thanks to", 
              () => navigation.navigate('OrganizationsPartenaires'), 
              styles.primaryButton, 
              styles.primaryButtonText
            )}
          </View>

          {/* Secondary Action Buttons */}
          <View style={styles.buttonRow}>
            {renderButton(
              "Create an account", 
              () => navigation.navigate('Signup'), 
              styles.secondaryButton, 
              styles.secondaryButtonText
            )}
            {renderButton(
              "I forgot my password", 
              () => navigation.navigate('PasswordReset'), 
              styles.secondaryButton, 
              styles.secondaryButtonText
            )}
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

// Stylesheet with organized and commented styles
const styles = StyleSheet.create({
  // Main container with blue background
  container: {
    flex: 1,
    backgroundColor: '#00008B',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },

  // ScrollView content styling
  scrollViewContent: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
    paddingHorizontal: 20,
  },

  // App logo styling
  logo2: {
    width: 150,
    height: 150,
    marginBottom: 20,
    borderRadius: 30,
  },

  // Title container for app name and slogan
  titleContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },

  // Main app title
  appTitle: {
    color: '#FFFFFF',
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 5,
  },

  // App tagline/slogan
  appSlogan: {
    color: '#FFFFFF',
    fontSize: 16,
    textAlign: 'center',
  },

  // Form container
  formContainer: {
    width: '100%',
    marginBottom: 20,
    paddingHorizontal: 10,
  },

  // Input field labels
  inputLabel: {
    color: 'white',
    marginBottom: 8,
    marginTop: 10,
    fontWeight: 'bold',
    fontSize: 16,
  },

  // Standard text input styling
  input: {
    height: 50,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 15,
    paddingHorizontal: 15,
    backgroundColor: 'white',
    borderRadius: 8,
    fontSize: 16,
  },

  // Password input container (includes eye icon)
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    backgroundColor: 'white',
    borderRadius: 8,
    borderColor: 'gray',
    borderWidth: 1,
  },

  // Password input field (without eye icon)
  passwordInput: {
    flex: 1,
    height: 50,
    paddingHorizontal: 15,
    fontSize: 16,
  },

  // Eye icon for password visibility toggle
  eyeIcon: {
    padding: 15,
  },

  // Container for button rows
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },

  // Base button styling
  button: {
    padding: 18,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'space-evenly',
    flex: 1,
    marginHorizontal: 5,
    minHeight: 50,
    minWidth: 100,
  },

  // Button shadow effect
  buttonShadow: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },

  // Base button text styling
  buttonText: {
    fontWeight: 'bold',
    fontSize: 16,
  },

  // Primary button styling (green background)
  primaryButton: {
    backgroundColor: '#4CAF50',
  },

  // Primary button text (white)
  primaryButtonText: {
    color: '#FFFFFF',
  },

  // Secondary button styling (white background)
  secondaryButton: {
    backgroundColor: '#FFFFFF',
  },

  // Secondary button text (blue)
  secondaryButtonText: {
    color: '#00008B',
  },

  // Admin button container (currently unused but kept for future use)
  adminButtonContainer: {
    width: '100%',
    alignItems: 'center',
    marginTop: 20,
  },

  // Admin button styling (currently unused)
  adminButton: {
    backgroundColor: '#333',
    borderWidth: 1,
    borderColor: '#888',
    width: '50%',
  },

  // Admin button text styling (currently unused)
  adminButtonText: {
    color: 'white',
  },
});

export default LoginScreen;