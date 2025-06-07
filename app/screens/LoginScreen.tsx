import React, { useEffect, useState, useRef } from 'react';
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
  Platform,
  Dimensions,
  PanGestureHandler,
  Animated,
} from 'react-native';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { ref as ref_d, onValue } from 'firebase/database';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { auth, database } from '../../firebase';

const { width, height } = Dimensions.get('window');

const ModernLoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(true);
  const [userRoles, setUserRoles] = useState({});
  const [uid, setUid] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [currentScreen, setCurrentScreen] = useState(0);
  const [showLoginForm, setShowLoginForm] = useState(false);
  const scrollViewRef = useRef(null);

  // Image mapping object (RECOMMENDED APPROACH)
  const imageMap = {
    1: require('../../assets/images/login/image1.png'),
    2: require('../../assets/images/login/image2.png'),
    3: require('../../assets/images/login/image3.png'),
  };

  // Onboarding screens data
  const onboardingScreens = [
    {
      id: 1,
      title: "A bubbly hello from",
      titleHighlight: "WalkingPal",
      subtitle: "The offline socialising app designed for humans, by humans.",
      image: imageMap[1], // Direct reference
    },
    {
      id: 2,
      title: "Meet people",
      titleHighlight: "nearby,",
      subtitle: "without the cringe",
      description: "This isn't networking. It's more like, 'You bored?' 'Same.' Where we vibing?",
      image: imageMap[2], // Direct reference
    },
    {
      id: 3,
      title: "Your Next",
      titleHighlight: "Hangout",
      subtitle: "Starts Here",
      description: "Wait, start, attack, or just vibe silently — you set the plan, we do the awkward small talk breaking.",
      image: imageMap[3], // Direct reference
    }
  ];

  useEffect(() => {
    auth.onAuthStateChanged(function(user) {
      checkCachedUser();
    });
  }, []);

  const checkCachedUser = async () => {
    try {
      const cachedUid = await AsyncStorage.getItem('userUid');
      console.log('cache:', cachedUid);
      if (cachedUid) {
        const user = auth.currentUser;
        if (user && user.uid === cachedUid) {
          fetchUserRolesAndNavigate(cachedUid);
        } else if (user) {
          try {
            await auth.signOut();
            await AsyncStorage.removeItem('userUid');
            setLoading(false);
          } catch (error) {
            console.error('Error logging out:', error);
          }
        } else {
          await AsyncStorage.removeItem('userUid');
          setLoading(false);
        }
      } else {
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
        navigation.navigate('UserTabs', { userRoles: data, formateur: true, validated: 'true' });
      } else {
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

  const handleScroll = (event) => {
    const slideSize = width;
    const index = Math.round(event.nativeEvent.contentOffset.x / slideSize);
    setCurrentScreen(index);
  };

  const renderOnboardingScreen = (screen, index) => {
    console.log('rendering screen:', screen);
    
    return (
      <View key={screen.id} style={[styles.onboardingScreen, { width }]}>
        {/* Image */}
        <Image
          source={screen.image}
          style={styles.onboardingImage}
        />

        {/* Content */}
        <View style={styles.onboardingContent}>
          <Text style={styles.onboardingTitle}>
            {screen.title} <Text style={styles.highlightText}>{screen.titleHighlight}</Text>
          </Text>
          {screen.subtitle && (
            <Text style={styles.onboardingSubtitle}>{screen.subtitle}</Text>
          )}
          {screen.description && (
            <Text style={styles.onboardingDescription}>{screen.description}</Text>
          )}
        </View>


      </View>
    );
  };

  const renderLoginForm = () => (
    <View style={styles.loginFormContainer}>
      {/* Header with back button */}
      <View style={styles.loginHeader}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => setShowLoginForm(false)}
        >
          <Ionicons name="arrow-back" size={24} color="#2C3E50" />
        </TouchableOpacity>
        <Text style={styles.loginHeaderText}>Sign in page</Text>
      </View>

      {/* Decorative Elements for Login */}
      <View style={styles.decorativeContainer}>
        <View style={[styles.floatingElement, styles.loginElement1]}>
          <Ionicons name="cafe" size={24} color="#FF6B6B" />
        </View>
        <View style={[styles.floatingElement, styles.loginElement2]}>
          <Ionicons name="bicycle" size={20} color="#4ECDC4" />
        </View>
        <View style={[styles.floatingElement, styles.loginElement3]}>
          <Ionicons name="musical-notes" size={18} color="#45B7D1" />
        </View>
        <View style={[styles.floatingElement, styles.loginElement4]}>
          <Ionicons name="camera" size={22} color="#96CEB4" />
        </View>
        <View style={[styles.floatingElement, styles.loginElement5]}>
          <Ionicons name="game-controller" size={20} color="#FFEAA7" />
        </View>
      </View>

      {/* Main Content */}
      <View style={styles.loginMainContent}>
        <View style={styles.heroSection}>
          <Text style={styles.heroTitle}>
            Your Next <Text style={styles.highlightText}>Hangout</Text>
          </Text>
          <Text style={styles.heroSubtitle}>Starts Here</Text>
          <Text style={styles.description}>
            Wait, start, attack, or just vibe silently — you set the plan, 
            we do the awkward small talk breaking.
          </Text>
        </View>

        <View style={styles.formContainer}>
          <View style={styles.inputContainer}>
            <View style={styles.countryCode}>
              <Text style={styles.flagEmoji}>🇮🇳</Text>
              <Text style={styles.countryCodeText}>+91</Text>
            </View>
            <TextInput
              style={styles.phoneInput}
              placeholder="Enter Mobile Number"
              placeholderTextColor="#999"
              value={email}
              onChangeText={setEmail}
              keyboardType="phone-pad"
            />
          </View>

          <TouchableOpacity 
            style={styles.continueButton}
            onPress={handleLogin}
          >
            <Text style={styles.continueButtonText}>Continue</Text>
          </TouchableOpacity>

          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>or</Text>
            <View style={styles.dividerLine} />
          </View>

          <View style={styles.socialButtons}>
            <TouchableOpacity style={styles.socialButton}>
              <Ionicons name="logo-google" size={24} color="#DB4437" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.socialButton}>
              <Ionicons name="mail" size={24} color="#EA4335" />
            </TouchableOpacity>
          </View>

          <Text style={styles.termsText}>
            By continuing, I agree with the <Text style={styles.linkText}>terms & conditions, privacy policy</Text>
          </Text>
        </View>

        <View style={styles.bottomSection}>
          <Text style={styles.accountText}>
            Don't have an account?{' '}
            <TouchableOpacity>
              <Text style={styles.signUpText}>Sign Up</Text>
            </TouchableOpacity>
          </Text>
        </View>
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FF6B6B" />
      </View>
    );
  }

  if (showLoginForm) {
    return (
      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {renderLoginForm()}
        </ScrollView>
      </KeyboardAvoidingView>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      >
        {onboardingScreens.map((screen, index) => renderOnboardingScreen(screen, index))}
      </ScrollView>

      <View style={styles.pageIndicatorContainer}>
        {onboardingScreens.map((_, index) => (
          <View
            key={index}
            style={[
              styles.pageIndicator,
              currentScreen === index && styles.activePageIndicator
            ]}
          />
        ))}
      </View>
      
        {/* Action Button */}
        <View style={styles.actionContainer}>
          <TouchableOpacity 
            style={styles.getStartedButton}
            onPress={() => setShowLoginForm(true)}
          >
            <Text style={styles.getStartedButtonText}>Get started</Text>
          </TouchableOpacity>
          
          <View style={styles.signInContainer}>
            <Text style={styles.signInText}>Already have an account? </Text>
            <TouchableOpacity onPress={() => setShowLoginForm(true)}>
              <Text style={styles.signInLink}>Sign in</Text>
            </TouchableOpacity>
          </View>
        </View>
      {/* Page Indicators */}
      
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  scrollContent: {
    flexGrow: 1,
  },
  onboardingScreen: {
    flex: 1,
    paddingHorizontal: 24,
  },
  onboardingImage: {
    width: '100%',
    height: height * 0.4,
    resizeMode: 'cover',
  },
  floatingElement: {
    position: 'absolute',
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  onboardingContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: height * 0.15,
    zIndex: 2,
  },
  onboardingTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#2C3E50',
    textAlign: 'center',
    marginBottom: 8,
  },
  highlightText: {
    color: '#FF6B6B',
  },
  onboardingSubtitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#2C3E50',
    textAlign: 'center',
    marginBottom: 16,
  },
  onboardingDescription: {
    fontSize: 16,
    color: '#7F8C8D',
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: 20,
  },
  actionContainer: {
    paddingBottom: 50,
    alignItems: 'center',
  },
  getStartedButton: {
    backgroundColor: '#2C3E50',
    borderRadius: 12,
    height: 56,
    paddingHorizontal: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    minWidth: 200,
  },
  getStartedButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  signInContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  signInText: {
    fontSize: 14,
    color: '#7F8C8D',
  },
  signInLink: {
    fontSize: 14,
    color: '#FF6B6B',
    fontWeight: '600',
  },
  pageIndicatorContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingBottom: 30,
  },
  pageIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#E9ECEF',
    marginHorizontal: 4,
  },
  activePageIndicator: {
    backgroundColor: '#2C3E50',
    width: 24,
  },
  // Login Form Styles
  loginFormContainer: {
    flex: 1,
  },
  loginHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 20,
    zIndex: 3,
  },
  backButton: {
    marginRight: 16,
  },
  loginHeaderText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2C3E50',
  },
  loginMainContent: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 20,
    zIndex: 2,
  },
  loginElement1: {
    top: 60,
    left: 30,
  },
  loginElement2: {
    top: 120,
    right: 40,
  },
  loginElement3: {
    top: 180,
    left: 60,
  },
  loginElement4: {
    top: 80,
    right: 100,
  },
  loginElement5: {
    top: 200,
    right: 20,
  },
  heroSection: {
    alignItems: 'center',
    marginBottom: 40,
    marginTop: 40,
  },
  heroTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#2C3E50',
    textAlign: 'center',
    marginBottom: 8,
  },
  heroSubtitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#2C3E50',
    textAlign: 'center',
    marginBottom: 16,
  },
  description: {
    fontSize: 16,
    color: '#7F8C8D',
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: 20,
  },
  formContainer: {
    marginBottom: 30,
  },
  inputContainer: {
    flexDirection: 'row',
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    marginBottom: 20,
    paddingHorizontal: 16,
    alignItems: 'center',
    height: 56,
  },
  countryCode: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 12,
    paddingRight: 12,
    borderRightWidth: 1,
    borderRightColor: '#E9ECEF',
  },
  flagEmoji: {
    fontSize: 20,
    marginRight: 8,
  },
  countryCodeText: {
    fontSize: 16,
    color: '#2C3E50',
    fontWeight: '500',
  },
  phoneInput: {
    flex: 1,
    fontSize: 16,
    color: '#2C3E50',
  },
  continueButton: {
    backgroundColor: '#2C3E50',
    borderRadius: 12,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  continueButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#E9ECEF',
  },
  dividerText: {
    color: '#7F8C8D',
    paddingHorizontal: 16,
    fontSize: 14,
  },
  socialButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 24,
  },
  socialButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#F8F9FA',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  termsText: {
    fontSize: 12,
    color: '#7F8C8D',
    textAlign: 'center',
    lineHeight: 18,
  },
  linkText: {
    color: '#FF6B6B',
    textDecorationLine: 'underline',
  },
  bottomSection: {
    alignItems: 'center',
    paddingBottom: 30,
  },
  accountText: {
    fontSize: 14,
    color: '#7F8C8D',
  },
  signUpText: {
    color: '#FF6B6B',
    fontWeight: '600',
  },
});

export default ModernLoginScreen;