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
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SignupScreen = () => {
  const [step, setStep] = useState('phone'); // 'phone', 'otp', 'name'
  const [phoneNumber, setPhoneNumber] = useState('');
  const [countryCode, setCountryCode] = useState('US');
  const [otp, setOtp] = useState('');
  const [firstName, setFirstName] = useState('');
  const [loading, setLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);

  // Your API base URL - update this to match your server
  const API_BASE_URL = 'http://10.0.2.2:13370'; // Update this to your server URL

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
        setResendTimer(60); // 60 seconds cooldown
        Alert.alert('Success', 'OTP sent successfully!');
      } else {
        Alert.alert('Error', data.message || 'Failed to send OTP');
      }
    } catch (error) {
      console.log('Body', typeof(phoneNumber.trim()), typeof(countryCode));
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
        // Store the token
        await AsyncStorage.setItem('authToken', data.token);
        await AsyncStorage.setItem('userId', data.updatedUser.id.toString());
        
        // Check if onboarding is complete
        if (data.isOnboardingComplete) {
          // Navigate to main app
          Alert.alert('Success', 'Login successful!');
          // Add your navigation logic here
          // navigation.navigate('MainApp');
        } else {
          // Continue with onboarding
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

  const completeOnboarding = async () => {
    if (!firstName.trim()) {
      Alert.alert('Error', 'Please enter your first name');
      return;
    }

    setLoading(true);
    try {
      const token = await AsyncStorage.getItem('authToken');
      
      // You'll need to create an endpoint in your controller to update user profile
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
        Alert.alert('Success', 'Profile updated successfully!');
        // Navigate to main app
        // navigation.navigate('MainApp');
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
      <Text style={styles.title}>Enter the 4-digit code sent to</Text>
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
        onPress={completeOnboarding}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Complete</Text>
        )}
      </TouchableOpacity>
    </View>
  );

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {step === 'phone' && renderPhoneStep()}
        {step === 'otp' && renderOTPStep()}
        {step === 'name' && renderNameStep()}
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
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
  primaryButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 25,
    minWidth: 120,
    alignItems: 'center',
    marginBottom: 15,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
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