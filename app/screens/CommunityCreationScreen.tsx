import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, SafeAreaView, StatusBar } from 'react-native';

const CommunityCreationScreen = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [communityName, setCommunityName] = useState('');
  const [inviteType, setInviteType] = useState('open');
  
  const steps = [
    {
      title: "What is your community about",
      subtitle: "Community name",
      placeholder: "This is a community where the biggest fans of something can come together.",
      showTextInput: true
    },
    {
      title: "So, who's invited?",
      subtitle: "",
      placeholder: "",
      showTextInput: false
    },
    {
      title: "Add a profile for your community",
      subtitle: "",
      placeholder: "Add a cover image & tell other members what your community is about.",
      showTextInput: false
    }
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const BackIcon = () => (
    <View style={styles.iconContainer}>
      <Text style={styles.backIcon}>‹</Text>
    </View>
  );

  const PlusIcon = () => (
    <View style={styles.plusIconContainer}>
      <Text style={styles.plusIcon}>+</Text>
    </View>
  );

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <View style={styles.stepContent}>
            <Text style={styles.subtitle}>{steps[currentStep].subtitle}</Text>
            <TextInput
              style={styles.textInput}
              value={communityName}
              onChangeText={setCommunityName}
              placeholder=""
              multiline
            />
            <Text style={styles.placeholder}>{steps[currentStep].placeholder}</Text>
          </View>
        );
      
      case 1:
        return (
          <View style={styles.stepContent}>
            <TouchableOpacity 
              style={[styles.option, inviteType === 'open' && styles.selectedOption]}
              onPress={() => setInviteType('open')}
            >
              <Text style={styles.optionText}>Open to all</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.option, inviteType === 'invite' && styles.selectedOption]}
              onPress={() => setInviteType('invite')}
            >
              <Text style={styles.optionText}>Invite only</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.option, inviteType === 'location' && styles.selectedOption]}
              onPress={() => setInviteType('location')}
            >
              <Text style={styles.optionText}>Location Based</Text>
            </TouchableOpacity>
          </View>
        );
      
      case 2:
        return (
          <View style={styles.stepContent}>
            <View style={styles.profileContainer}>
              <View style={styles.profileImagePlaceholder}>
                <PlusIcon />
              </View>
              <Text style={styles.profileText}>{steps[currentStep].placeholder}</Text>
            </View>
          </View>
        );
      
      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      {/* Header */}
      <View style={styles.header}>
        {currentStep > 0 && (
          <TouchableOpacity onPress={handleBack} style={styles.backButton}>
            <BackIcon />
          </TouchableOpacity>
        )}
        <Text style={styles.stepIndicator}>{currentStep + 1}/3</Text>
      </View>

      {/* Content */}
      <View style={styles.content}>
        <Text style={styles.title}>{steps[currentStep].title}</Text>
        
        {renderStepContent()}
      </View>

      {/* Bottom Button */}
      <View style={styles.bottomContainer}>
        <TouchableOpacity 
          style={[
            styles.proceedButton,
            (currentStep === 0 && !communityName.trim()) && styles.disabledButton
          ]}
          onPress={handleNext}
          disabled={currentStep === 0 && !communityName.trim()}
        >
          <Text style={styles.proceedButtonText}>Proceed</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  backButton: {
    padding: 5,
  },
  iconContainer: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backIcon: {
    fontSize: 24,
    color: '#000',
    fontWeight: 'bold',
  },
  plusIconContainer: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  plusIcon: {
    fontSize: 40,
    color: '#999',
    fontWeight: '300',
  },
  stepIndicator: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    position: 'absolute',
    right: 20,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 30,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 30,
    lineHeight: 30,
  },
  stepContent: {
    flex: 1,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    marginBottom: 15,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    padding: 15,
    fontSize: 16,
    minHeight: 100,
    textAlignVertical: 'top',
    marginBottom: 15,
  },
  placeholder: {
    fontSize: 14,
    color: '#999',
    lineHeight: 20,
  },
  option: {
    padding: 20,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    marginBottom: 15,
  },
  selectedOption: {
    borderColor: '#ff6b6b',
    backgroundColor: '#fff5f5',
  },
  optionText: {
    fontSize: 16,
    color: '#000',
    fontWeight: '500',
  },
  profileContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  profileImagePlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  profileText: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    lineHeight: 20,
    paddingHorizontal: 40,
  },
  bottomContainer: {
    padding: 20,
    paddingBottom: 30,
  },
  proceedButton: {
    backgroundColor: '#ff6b6b',
    paddingVertical: 18,
    borderRadius: 25,
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: '#ccc',
  },
  proceedButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default CommunityCreationScreen;