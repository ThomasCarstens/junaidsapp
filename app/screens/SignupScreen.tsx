import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  FlatList,
  Image,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SignupScreen = () => {
  const [step, setStep] = useState('phone'); // 'phone', 'otp', 'name', 'onboarding'
  const [onboardingStep, setOnboardingStep] = useState(1);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [countryCode, setCountryCode] = useState('US');
  const [otp, setOtp] = useState('');
  const [firstName, setFirstName] = useState('');
  const [loading, setLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);

  // Onboarding form data
  const [onboardingData, setOnboardingData] = useState({
    dob: '',
    gender: '',
    relationshipStatus: '',
    occupation: '',
    homeTown: '',
    bio: '',
    profilePictureUrl: '',
    interests: [],
  });

  // Your API base URL - update this to match your server
  const API_BASE_URL = 'http://10.0.2.2:13370'; // Update this to your server URL

  // Predefined options
  const genderOptions = ['Male', 'Female', 'Non-Binary', 'Other'];
  const relationshipOptions = ['Single', 'In a relationship', 'Married', 'Divorced', 'Widowed', 'It\'s complicated'];
  const interestOptions = [
    'Sports', 'Music', 'Movies', 'Reading', 'Travel', 'Cooking', 'Photography', 
    'Gaming', 'Art', 'Technology', 'Fitness', 'Dancing', 'Writing', 'Nature',
    'Fashion', 'Food', 'Animals', 'Science', 'History', 'Politics'
  ];

  useEffect(() => {
    let interval;
    if (resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer(resendTimer - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [resendTimer]);

  const sendOTP = async () => {
    if (!phoneNumber.trim()) {
      Alert.alert('Error', 'Please enter your phone number');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/auth/send-otp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          phoneNumber: phoneNumber.trim(),
          countryCode: countryCode,
        }),
      });
      
      const data = await response.json();

      if (data.success) {
        console.log('OTP sent successfully:', data);
        setStep('otp');
        setResendTimer(60);
        Alert.alert('Success', 'OTP sent successfully!');
      } else {
        Alert.alert('Error', data.message || 'Failed to send OTP');
      }
    } catch (error) {
      console.error('Send OTP error:', error);
      Alert.alert('Error', 'Network error. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  const verifyOTP = async () => {
    if (!otp.trim() || otp.length !== 6) {
      Alert.alert('Error', 'Please enter a valid 6-digit OTP');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/auth/verify-otp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          phoneNumber: phoneNumber.trim(),
          otp: otp.trim(),
        }),
      });

      const data = await response.json();

      if (data.success) {
        await AsyncStorage.setItem('authToken', data.token);
        await AsyncStorage.setItem('userId', data.updatedUser.id.toString());
        console.log('OTP verified successfully:', data);
        console.log(`Bearer ${data.token ? data.token.substring(0, 20) + '...' : 'null'}`)
        if (data.isOnboardingComplete) {
          Alert.alert('Success', 'Login successful!');
          // Navigate to main app
        } else {
          setStep('name');
        }
      } else {
        Alert.alert('Error', data.message || 'Invalid OTP');
      }
    } catch (error) {
      console.error('Verify OTP error:', error);
      Alert.alert('Error', 'Network error. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  const completeNameStep = async () => {
    if (!firstName.trim()) {
      Alert.alert('Error', 'Please enter your first name');
      return;
    }

    setLoading(true);
    try {
      const token = await AsyncStorage.getItem('authToken');
      const userId = await AsyncStorage.getItem('userId');
      
      const response = await fetch(`${API_BASE_URL}/auth/update-profile`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          firstName: firstName.trim(),
        }),
      });

      const data = await response.json();

      if (data.success) {
        setStep('onboarding');
        setOnboardingStep(1);
      } else {
        Alert.alert('Error', data.message || 'Failed to update profile');
      }
    } catch (error) {
      console.error('Update profile error:', error);
      Alert.alert('Error', 'Network error. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  const updateOnboardingStep = async (stepData) => {
    setLoading(true);
    try {
      const token = await AsyncStorage.getItem('authToken');
      
      const requestBody = {
        step: onboardingStep,
        ...stepData,
      };
      
      console.log('Sending onboarding request:', {
        url: `${API_BASE_URL}/onboarding/update-step`,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token ? token.substring(0, 20) + '...' : 'null'}`,
        },
        body: requestBody,
      });
      
      const response = await fetch(`${API_BASE_URL}/onboarding/update-step`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(requestBody),
      });

      console.log('Response status:', response.status);
      console.log('Response headers:', response.headers);
      
      // Check if response is actually JSON
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const textResponse = await response.text();
        console.log('Non-JSON response received:', textResponse);
        Alert.alert('Error', 'Server returned an invalid response. Please check the server logs.');
        return;
      }

      const data = await response.json();
      console.log('Response data:', data);

      if (data.success) {
        if (onboardingStep < 9) {
          setOnboardingStep(onboardingStep + 1);
        } else {
          Alert.alert('Success', 'Onboarding completed!');
          // Navigate to main app
        }
      } else {
        Alert.alert('Error', data.message || 'Failed to update step');
      }
    } catch (error) {
      console.error('Update onboarding step error:', error);
      Alert.alert('Error', `Network error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleNext = () => {
    let stepData = {};
    let isValid = true;

    switch (onboardingStep) {
      case 1:
        if (!onboardingData.dob.trim()) {
          Alert.alert('Error', 'Please enter your date of birth');
          return;
        }
        stepData = { dob: onboardingData.dob };
        break;
      case 2:
        if (!onboardingData.gender) {
          Alert.alert('Error', 'Please select your gender');
          return;
        }
        stepData = { gender: onboardingData.gender };
        break;
      case 3:
        if (!onboardingData.relationshipStatus) {
          Alert.alert('Error', 'Please select your relationship status');
          return;
        }
        stepData = { relationshipStatus: onboardingData.relationshipStatus };
        break;
      case 4:
        stepData = { occupation: onboardingData.occupation };
        break;
      case 5:
        stepData = { homeTown: onboardingData.homeTown };
        break;
      case 6:
        stepData = { bio: onboardingData.bio };
        break;
      case 7:
        stepData = { profilePictureUrl: onboardingData.profilePictureUrl };
        break;
      case 8:
        if (onboardingData.interests.length === 0) {
          Alert.alert('Error', 'Please select at least one interest');
          return;
        }
        stepData = { interests: onboardingData.interests };
        break;
      case 9:
        stepData = {};
        break;
    }

    updateOnboardingStep(stepData);
  };

  const updateOnboardingField = (field, value) => {
    setOnboardingData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const toggleInterest = (interest) => {
    const currentInterests = onboardingData.interests;
    if (currentInterests.includes(interest)) {
      updateOnboardingField('interests', currentInterests.filter(i => i !== interest));
    } else {
      updateOnboardingField('interests', [...currentInterests, interest]);
    }
  };

  const renderPhoneStep = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.title}>What's your mobile number? 📱</Text>
      <Text style={styles.subtitle}>
        We'll send you a verification code to confirm your phone number.
      </Text>
      
      <View style={styles.phoneInputContainer}>
        <TextInput
          style={styles.countryInput}
          value={countryCode}
          onChangeText={setCountryCode}
          placeholder="US"
          maxLength={2}
        />
        <TextInput
          style={styles.phoneInput}
          value={phoneNumber}
          onChangeText={setPhoneNumber}
          placeholder="Enter your phone number"
          keyboardType="phone-pad"
          maxLength={15}
        />
      </View>
      
      <TouchableOpacity
        style={styles.primaryButton}
        onPress={sendOTP}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Continue</Text>
        )}
      </TouchableOpacity>
    </View>
  );

  const renderOTPStep = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.title}>Enter the 6-digit code sent to</Text>
      <Text style={styles.phoneDisplay}>{phoneNumber}</Text>
      
      <TextInput
        style={styles.otpInput}
        value={otp}
        onChangeText={setOtp}
        placeholder="Enter OTP"
        keyboardType="number-pad"
        maxLength={6}
        textAlign="center"
      />
      
      <TouchableOpacity
        style={styles.primaryButton}
        onPress={verifyOTP}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Verify</Text>
        )}
      </TouchableOpacity>
      
      <TouchableOpacity
        style={styles.secondaryButton}
        onPress={sendOTP}
        disabled={loading || resendTimer > 0}
      >
        <Text style={styles.secondaryButtonText}>
          {resendTimer > 0 ? `Resend in ${resendTimer}s` : 'Resend OTP'}
        </Text>
      </TouchableOpacity>
    </View>
  );

  const renderNameStep = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.title}>What's your first name? 😊</Text>
      <Text style={styles.subtitle}>
        This is how you'll appear to other users.
      </Text>
      
      <TextInput
        style={styles.nameInput}
        value={firstName}
        onChangeText={setFirstName}
        placeholder="Enter your first name"
        maxLength={50}
      />
      
      <TouchableOpacity
        style={styles.primaryButton}
        onPress={completeNameStep}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Continue</Text>
        )}
      </TouchableOpacity>
    </View>
  );

  const renderOnboardingStep = () => {
    const progressPercentage = (onboardingStep / 9) * 100;

    const renderStepContent = () => {
      switch (onboardingStep) {
        case 1:
          return (
            <View style={styles.stepContainer}>
              <Text style={styles.title}>What's your Date of Birth? 🎂</Text>
              <Text style={styles.subtitle}>We use this to match you with age-appropriate people.</Text>
              
              <TextInput
                style={styles.input}
                value={onboardingData.dob}
                onChangeText={(text) => updateOnboardingField('dob', text)}
                placeholder="YYYY-MM-DD"
                maxLength={10}
              />
            </View>
          );

        case 2:
          return (
            <View style={styles.stepContainer}>
              <Text style={styles.title}>What's your gender? 👤</Text>
              <Text style={styles.subtitle}>This helps us create better matches for you.</Text>
              
              <View style={styles.optionsContainer}>
                {genderOptions.map((option) => (
                  <TouchableOpacity
                    key={option}
                    style={[
                      styles.optionButton,
                      onboardingData.gender === option && styles.selectedOption
                    ]}
                    onPress={() => updateOnboardingField('gender', option)}
                  >
                    <Text style={[
                      styles.optionText,
                      onboardingData.gender === option && styles.selectedOptionText
                    ]}>
                      {option}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          );

        case 3:
          return (
            <View style={styles.stepContainer}>
              <Text style={styles.title}>Your relationship status? 💕</Text>
              <Text style={styles.subtitle}>Let others know your current status.</Text>
              
              <View style={styles.optionsContainer}>
                {relationshipOptions.map((option) => (
                  <TouchableOpacity
                    key={option}
                    style={[
                      styles.optionButton,
                      onboardingData.relationshipStatus === option && styles.selectedOption
                    ]}
                    onPress={() => updateOnboardingField('relationshipStatus', option)}
                  >
                    <Text style={[
                      styles.optionText,
                      onboardingData.relationshipStatus === option && styles.selectedOptionText
                    ]}>
                      {option}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          );

        case 4:
          return (
            <View style={styles.stepContainer}>
              <Text style={styles.title}>What do you do for living? 💼</Text>
              <Text style={styles.subtitle}>Tell us about your profession (optional).</Text>
              
              <TextInput
                style={styles.input}
                value={onboardingData.occupation}
                onChangeText={(text) => updateOnboardingField('occupation', text)}
                placeholder="e.g. Software Engineer, Teacher, Student"
                maxLength={100}
              />
            </View>
          );

        case 5:
          return (
            <View style={styles.stepContainer}>
              <Text style={styles.title}>Where's your home town? 🏠</Text>
              <Text style={styles.subtitle}>Share where you're from (optional).</Text>
              
              <TextInput
                style={styles.input}
                value={onboardingData.homeTown}
                onChangeText={(text) => updateOnboardingField('homeTown', text)}
                placeholder="e.g. New York, London, Tokyo"
                maxLength={100}
              />
            </View>
          );

        case 6:
          return (
            <View style={styles.stepContainer}>
              <Text style={styles.title}>Tell us about yourself 📝</Text>
              <Text style={styles.subtitle}>Write a short bio to introduce yourself (optional).</Text>
              
              <TextInput
                style={[styles.input, styles.bioInput]}
                value={onboardingData.bio}
                onChangeText={(text) => updateOnboardingField('bio', text)}
                placeholder="Write something interesting about yourself..."
                multiline
                numberOfLines={4}
                maxLength={500}
              />
            </View>
          );

        case 7:
          return (
            <View style={styles.stepContainer}>
              <Text style={styles.title}>Add a profile picture 📸</Text>
              <Text style={styles.subtitle}>Share a photo URL (optional).</Text>
              
              <TextInput
                style={styles.input}
                value={onboardingData.profilePictureUrl}
                onChangeText={(text) => updateOnboardingField('profilePictureUrl', text)}
                placeholder="https://example.com/your-photo.jpg"
              />
            </View>
          );

        case 8:
          return (
            <View style={styles.stepContainer}>
              <Text style={styles.title}>What are your interests? 🎯</Text>
              <Text style={styles.subtitle}>Select topics you're passionate about.</Text>
              
              <FlatList
                data={interestOptions}
                numColumns={2}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={[
                      styles.interestButton,
                      onboardingData.interests.includes(item) && styles.selectedInterest
                    ]}
                    onPress={() => toggleInterest(item)}
                  >
                    <Text style={[
                      styles.interestText,
                      onboardingData.interests.includes(item) && styles.selectedInterestText
                    ]}>
                      {item}
                    </Text>
                  </TouchableOpacity>
                )}
                keyExtractor={(item) => item}
                style={styles.interestsList}
              />
            </View>
          );

        case 9:
          return (
            <View style={styles.stepContainer}>
              <Text style={styles.title}>You're all set! 🎉</Text>
              <Text style={styles.subtitle}>Welcome to our community! Ready to get started?</Text>
            </View>
          );

        default:
          return null;
      }
    };

    return (
      <View style={styles.onboardingContainer}>
        {/* Progress Bar */}
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${progressPercentage}%` }]} />
          </View>
          <Text style={styles.progressText}>Step {onboardingStep} of 9</Text>
        </View>

        <ScrollView contentContainerStyle={styles.scrollContainer}>
          {renderStepContent()}
        </ScrollView>

        {/* Navigation Buttons */}
        <View style={styles.navigationContainer}>
          {onboardingStep > 1 && (
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => setOnboardingStep(onboardingStep - 1)}
            >
              <Text style={styles.backButtonText}>Back</Text>
            </TouchableOpacity>
          )}
          
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={handleNext}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>
                {onboardingStep === 9 ? 'Complete' : 'Next'}
              </Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      {step === 'phone' && renderPhoneStep()}
      {step === 'otp' && renderOTPStep()}
      {step === 'name' && renderNameStep()}
      {step === 'onboarding' && renderOnboardingStep()}
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  onboardingContainer: {
    flex: 1,
  },
  progressContainer: {
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 20,
  },
  progressBar: {
    height: 4,
    backgroundColor: '#e0e0e0',
    borderRadius: 2,
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#007AFF',
    borderRadius: 2,
  },
  progressText: {
    textAlign: 'center',
    color: '#666',
    fontSize: 14,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
  },
  stepContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
    color: '#333',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    color: '#666',
    marginBottom: 30,
    paddingHorizontal: 20,
  },
  phoneInputContainer: {
    flexDirection: 'row',
    marginBottom: 30,
    width: '100%',
  },
  countryInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 15,
    fontSize: 16,
    marginRight: 10,
    width: 80,
    textAlign: 'center',
  },
  phoneInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 15,
    fontSize: 16,
  },
  phoneDisplay: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 30,
  },
  otpInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 15,
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
    width: 200,
    letterSpacing: 10,
  },
  nameInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 15,
    fontSize: 16,
    marginBottom: 30,
    width: '100%',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 15,
    fontSize: 16,
    width: '100%',
    marginBottom: 20,
  },
  bioInput: {
    height: 100,
    textAlignVertical: 'top',
  },
  optionsContainer: {
    width: '100%',
  },
  optionButton: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 15,
    marginBottom: 10,
    alignItems: 'center',
  },
  selectedOption: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  optionText: {
    fontSize: 16,
    color: '#333',
  },
  selectedOptionText: {
    color: '#fff',
    fontWeight: '600',
  },
  interestsList: {
    width: '100%',
  },
  interestButton: {
    flex: 0.48,
    margin: '1%',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 20,
    padding: 12,
    alignItems: 'center',
  },
  selectedInterest: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  interestText: {
    fontSize: 14,
    color: '#333',
  },
  selectedInterestText: {
    color: '#fff',
    fontWeight: '600',
  },
  navigationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 40,
    paddingTop: 20,
  },
  primaryButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 25,
    minWidth: 120,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  backButton: {
    paddingVertical: 15,
    paddingHorizontal: 20,
  },
  backButtonText: {
    color: '#007AFF',
    fontSize: 16,
  },
  secondaryButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  secondaryButtonText: {
    color: '#007AFF',
    fontSize: 14,
  },
});

export default SignupScreen;