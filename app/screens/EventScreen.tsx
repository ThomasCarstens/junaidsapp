import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  SafeAreaView,
  StatusBar,
  Dimensions,
  Modal,
  Switch,
} from 'react-native';

const { width } = Dimensions.get('window');

const EventScreen = ({ navigation, route }) => {
  const { event } = route.params;
  const [isJoined, setIsJoined] = useState(event.status === 'Accepted');
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [emailPreferences, setEmailPreferences] = useState({
    acceptReject: false,
    updates: false,
    posts: false,
    reminders: false,
    urgentMessages: false,
  });
  const [joinCommunity, setJoinCommunity] = useState(false);

  const handleJoinEvent = () => {
    setShowJoinModal(true);
  };

  const handleConfirmJoin = () => {
    setShowJoinModal(false);
    // Here you would typically send the data to your backend
    console.log('Join event with preferences:', {
      notificationsEnabled,
      emailPreferences,
      joinCommunity
    });
    navigation.navigate('UnderConstruction', { event: event });
  };

  const handleGoBack = () => {
    navigation.goBack();
  };

  const updateEmailPreference = (key, value) => {
    setEmailPreferences(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const JoinEventModal = () => (
    <Modal
      visible={showJoinModal}
      animationType="slide"
      transparent={true}
      onRequestClose={() => setShowJoinModal(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <ScrollView showsVerticalScrollIndicator={false}>
            {/* Header */}
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>🎉 Almost there!</Text>
              <Text style={styles.modalSubtitle}>Just a few quick steps to join this amazing event</Text>
            </View>

            {/* Step 1: Profile Sharing */}
            <View style={styles.stepContainer}>
              <Text style={styles.stepIcon}>👤</Text>
              <View style={styles.stepContent}>
                <Text style={styles.stepTitle}>Step 1: Profile Review</Text>
                <Text style={styles.stepText}>
                  We'll share your profile with the organiser, who has 24 hours to accept or decline your request.
                </Text>
              </View>
            </View>

            {/* Step 2: Notifications */}
            <View style={styles.stepContainer}>
              <Text style={styles.stepIcon}>🔔</Text>
              <View style={styles.stepContent}>
                <Text style={styles.stepTitle}>Step 2: Stay Connected</Text>
                <Text style={styles.stepText}>
                  Enable notifications so you can respond to any questions from the organiser.
                </Text>
                <View style={styles.switchContainer}>
                  <Text style={styles.switchLabel}>Activate notifications</Text>
                  <Switch
                    value={notificationsEnabled}
                    onValueChange={setNotificationsEnabled}
                    trackColor={{ false: '#E0E0E0', true: '#FF6B9D' }}
                    thumbColor={notificationsEnabled ? '#FFFFFF' : '#FFFFFF'}
                  />
                </View>
              </View>
            </View>

            {/* Step 3: Email Preferences */}
            <View style={styles.stepContainer}>
              <Text style={styles.stepIcon}>📧</Text>
              <View style={styles.stepContent}>
                <Text style={styles.stepTitle}>Step 3: Email Updates</Text>
                <Text style={styles.stepText}>Choose what you'd like to receive via email:</Text>
                
                <View style={styles.checkboxContainer}>
                  <TouchableOpacity 
                    style={styles.checkboxRow}
                    onPress={() => updateEmailPreference('acceptReject', !emailPreferences.acceptReject)}
                  >
                    <View style={[styles.checkbox, emailPreferences.acceptReject && styles.checkboxChecked]}>
                      {emailPreferences.acceptReject && <Text style={styles.checkmark}>✓</Text>}
                    </View>
                    <Text style={styles.checkboxText}>Being accepted or rejected</Text>
                  </TouchableOpacity>

                  <TouchableOpacity 
                    style={styles.checkboxRow}
                    onPress={() => updateEmailPreference('updates', !emailPreferences.updates)}
                  >
                    <View style={[styles.checkbox, emailPreferences.updates && styles.checkboxChecked]}>
                      {emailPreferences.updates && <Text style={styles.checkmark}>✓</Text>}
                    </View>
                    <Text style={styles.checkboxText}>Time & location updates</Text>
                  </TouchableOpacity>

                  <TouchableOpacity 
                    style={styles.checkboxRow}
                    onPress={() => updateEmailPreference('posts', !emailPreferences.posts)}
                  >
                    <View style={[styles.checkbox, emailPreferences.posts && styles.checkboxChecked]}>
                      {emailPreferences.posts && <Text style={styles.checkmark}>✓</Text>}
                    </View>
                    <Text style={styles.checkboxText}>New event posts</Text>
                  </TouchableOpacity>

                  <TouchableOpacity 
                    style={styles.checkboxRow}
                    onPress={() => updateEmailPreference('reminders', !emailPreferences.reminders)}
                  >
                    <View style={[styles.checkbox, emailPreferences.reminders && styles.checkboxChecked]}>
                      {emailPreferences.reminders && <Text style={styles.checkmark}>✓</Text>}
                    </View>
                    <Text style={styles.checkboxText}>Event reminders</Text>
                  </TouchableOpacity>

                  <TouchableOpacity 
                    style={styles.checkboxRow}
                    onPress={() => updateEmailPreference('urgentMessages', !emailPreferences.urgentMessages)}
                  >
                    <View style={[styles.checkbox, emailPreferences.urgentMessages && styles.checkboxChecked]}>
                      {emailPreferences.urgentMessages && <Text style={styles.checkmark}>✓</Text>}
                    </View>
                    <Text style={styles.checkboxText}>Urgent messages from host</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>

            {/* Step 4: Community */}
            <View style={styles.stepContainer}>
              <Text style={styles.stepIcon}>🌟</Text>
              <View style={styles.stepContent}>
                <Text style={styles.stepTitle}>Bonus: Join the Community!</Text>
                <Text style={styles.stepText}>
                  We noticed you're not part of this event's community yet. Stay connected with all community posts and events!
                </Text>
                <View style={styles.switchContainer}>
                  <Text style={styles.switchLabel}>I wish to join the community</Text>
                  <Switch
                    value={joinCommunity}
                    onValueChange={setJoinCommunity}
                    trackColor={{ false: '#E0E0E0', true: '#4CAF50' }}
                    thumbColor={joinCommunity ? '#FFFFFF' : '#FFFFFF'}
                  />
                </View>
              </View>
            </View>

            {/* Important Note */}
            <View style={styles.noteContainer}>
              <Text style={styles.noteIcon}>ℹ️</Text>
              <Text style={styles.noteText}>
                You can cancel anytime, but we'll ask for a reason to help maintain high engagement on our platform.
              </Text>
            </View>

            {/* Action Buttons */}
            <View style={styles.modalActions}>
              <TouchableOpacity 
                style={styles.cancelButton} 
                onPress={() => setShowJoinModal(false)}
              >
                <Text style={styles.cancelButtonText}>Maybe Later</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.confirmButton} 
                onPress={handleConfirmJoin}
              >
                <Text style={styles.confirmButtonText}>Let's Go! 🚀</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header Image */}
        <View style={styles.headerContainer}>
          <Image 
            source={{ uri: event.image }}
            style={styles.headerImage}
          />
          <View style={styles.headerOverlay} />
          <View style={styles.headerTopBar}>
            <Text style={styles.eventTitle}>{event.title}</Text>
          </View>
          <TouchableOpacity style={styles.distanceButton}>
            <Text style={styles.distanceButtonText}>📍 {event.distance || '2.5 km'}</Text>
          </TouchableOpacity>
        </View>

        {/* Event Details Card */}
        <View style={styles.detailsCard}>
          {/* Date and Location */}
          <View style={styles.eventInfo}>
            <View style={styles.infoRow}>
              <Text style={styles.infoIcon}>📍</Text>
              <Text style={styles.infoText}>{event.location || 'Location not specified'}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoIcon}>⏰</Text>
              <Text style={styles.infoText}>{event.time || 'Time not specified'}</Text>
            </View>
          </View>

          {/* About Event */}
          <View style={styles.aboutSection}>
            <Text style={styles.sectionTitle}>About event</Text>
            <Text style={styles.aboutText}>
              {event.description || `Join us for an exciting ${event.title?.toLowerCase() || 'event'} experience! This event is perfect for both beginners and experienced participants.

Do arrive on time, bring sunscreen, and follow boat safety instructions.

Don't wear heels (they're not deck-friendly), get into disagreements or bring negativity onto the boat, expect the crew, and help keep the vibe relaxed and social.`}
            </Text>
          </View>

          {/* Visibility */}
          <View style={styles.visibilitySection}>
            <View style={styles.visibilityRow}>
              <Text style={styles.visibilityLabel}>👁 Visibility:</Text>
              <Text style={styles.visibilityValue}>Open to all</Text>
            </View>
            <View style={styles.visibilityRow}>
              <Text style={styles.visibilityLabel}>👥 Max Participants:</Text>
              <Text style={styles.visibilityValue}>{event.maxParticipants || '28'}</Text>
            </View>
            <View style={styles.visibilityRow}>
              <Text style={styles.visibilityLabel}>🎟 Entry:</Text>
              <Text style={styles.visibilityValue}>Free</Text>
            </View>
          </View>

          {/* Location Map */}
          <View style={styles.mapSection}>
            <Text style={styles.locationTitle}>{event.location || 'Location not specified'}</Text>
            <View style={styles.mapContainer}>
              <View style={styles.mapPlaceholder}>
                <View style={styles.mapPin}>
                  <Text style={styles.mapPinText}>📍</Text>
                </View>
              </View>
            </View>
          </View>

          {/* Host Information */}
          <View style={styles.hostSection}>
            <Text style={styles.hostTitle}>Hosted by</Text>
            <View style={styles.hostInfo}>
              <Image source={{ uri: event.image }} style={styles.hostImage} />
              <View style={styles.hostDetails}>
                <Text style={styles.hostName}>{event.host || 'Event Host'}</Text>
                <View style={styles.hostStats}>
                  <View style={styles.statItem}>
                    <Text style={styles.statNumber}>8</Text>
                    <Text style={styles.statLabel}>Events</Text>
                  </View>
                  <View style={styles.statItem}>
                    <Text style={styles.statNumber}>2</Text>
                    <Text style={styles.statLabel}>Reviews</Text>
                  </View>
                  <View style={styles.statItem}>
                    <Text style={styles.statNumber}>4.8</Text>
                    <Text style={styles.statLabel}>Rating</Text>
                  </View>
                </View>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Bottom Action Button */}
      <View style={styles.bottomContainer}>
        <TouchableOpacity 
          style={[styles.joinButton, isJoined && styles.joinedButton]} 
          onPress={handleJoinEvent}
        >
          <Text style={[styles.joinButtonText, isJoined && styles.joinedButtonText]}>
            {isJoined ? 'Joined ✓' : 'Join Event →'}
          </Text>
        </TouchableOpacity>
      </View>

      <JoinEventModal />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF8F5',
  },
  scrollView: {
    flex: 1,
  },
  headerContainer: {
    position: 'relative',
    height: 320,
  },
  headerImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  headerOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  headerTopBar: {
    position: 'absolute',
    top: 50,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    zIndex: 10,
  },
  eventTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  distanceButton: {
    position: 'absolute',
    bottom: 80,
    right: 20,
    backgroundColor: 'rgba(255,255,255,0.9)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  distanceButtonText: {
    color: '#333333',
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 4,
  },
  detailsCard: {
    backgroundColor: '#FFFFFF',
    margin: 16,
    borderRadius: 20,
    opacity: 0.95,
    padding: 24,
    shadowColor: '#FF6B9D',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  eventInfo: {
    marginBottom: 24,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  infoIcon: {
    fontSize: 16,
    marginRight: 12,
    width: 20,
  },
  infoText: {
    fontSize: 15,
    color: '#333333',
    fontWeight: '500',
  },
  aboutSection: {
    marginBottom: 24,
    backgroundColor: '#FFF0F899',
    padding: 16,
    borderRadius: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FF6B9D',
    marginBottom: 12,
  },
  aboutText: {
    fontSize: 14,
    color: '#666666',
    lineHeight: 22,
  },
  visibilitySection: {
    marginBottom: 24,
    backgroundColor: '#FFFACD50',
    padding: 16,
    borderRadius: 16,
  },
  visibilityRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  visibilityLabel: {
    fontSize: 14,
    color: '#666666',
  },
  visibilityValue: {
    fontSize: 14,
    color: '#333333',
    fontWeight: '500',
  },
  mapSection: {
    marginBottom: 24,
    backgroundColor: '#FFFACD50',
    padding: 16,
    borderRadius: 16,
  },
  locationTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#4CAF50',
    marginBottom: 12,
  },
  mapContainer: {
    height: 120,
    borderRadius: 12,
    overflow: 'hidden',
  },
  mapPlaceholder: {
    flex: 1,
    backgroundColor: '#E8F5E8',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  mapPin: {
    position: 'absolute',
    top: '40%',
    left: '50%',
    transform: [{ translateX: -10 }, { translateY: -10 }],
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mapPinText: {
    fontSize: 18,
  },
  hostSection: {
    marginBottom: 0,
    backgroundColor: '#FFFACD99',
    padding: 16,
    borderRadius: 16,
  },
  hostTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FF8C00',
    marginBottom: 16,
  },
  hostInfo: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  hostImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  hostDetails: {
    flex: 1,
  },
  hostName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 8,
  },
  hostStats: {
    flexDirection: 'row',
  },
  statItem: {
    alignItems: 'center',
    marginRight: 24,
  },
  statNumber: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FF8C00',
  },
  statLabel: {
    fontSize: 12,
    color: '#666666',
    marginTop: 2,
  },
  bottomContainer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#FFE4E1',
  },
  joinButton: {
    backgroundColor: '#FF6B9D',
    paddingVertical: 16,
    borderRadius: 28,
    alignItems: 'center',
    shadowColor: '#FF6B9D',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  joinedButton: {
    backgroundColor: '#4CAF50',
    shadowColor: '#4CAF50',
  },
  joinButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  joinedButtonText: {
    color: '#FFFFFF',
  },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    maxHeight: '90%',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 30,
  },
  modalHeader: {
    alignItems: 'center',
    marginBottom: 25,
    paddingTop: 10,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FF6B9D',
    marginBottom: 8,
  },
  modalSubtitle: {
    fontSize: 16,
    color: '#666666',
    textAlign: 'center',
    lineHeight: 22,
  },
  stepContainer: {
    flexDirection: 'row',
    marginBottom: 25,
    backgroundColor: '#FAFAFA',
    padding: 16,
    borderRadius: 16,
  },
  stepIcon: {
    fontSize: 24,
    marginRight: 15,
    marginTop: 2,
  },
  stepContent: {
    flex: 1,
  },
  stepTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#333333',
    marginBottom: 8,
  },
  stepText: {
    fontSize: 14,
    color: '#666666',
    lineHeight: 20,
    marginBottom: 12,
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 12,
    borderRadius: 12,
    marginTop: 8,
  },
  switchLabel: {
    fontSize: 14,
    color: '#333333',
    fontWeight: '500',
    flex: 1,
  },
  checkboxContainer: {
    marginTop: 8,
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    marginBottom: 6,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: '#E0E0E0',
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: {
    backgroundColor: '#FF6B9D',
    borderColor: '#FF6B9D',
  },
  checkmark: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  checkboxText: {
    fontSize: 14,
    color: '#333333',
    flex: 1,
  },
  noteContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFF3CD',
    padding: 15,
    borderRadius: 12,
    marginBottom: 25,
    borderLeftWidth: 4,
    borderLeftColor: '#FFC107',
  },
  noteIcon: {
    fontSize: 18,
    marginRight: 10,
  },
  noteText: {
    fontSize: 13,
    color: '#856404',
    flex: 1,
    lineHeight: 18,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    paddingVertical: 16,
    borderRadius: 25,
    alignItems: 'center',
    marginRight: 10,
  },
  cancelButtonText: {
    color: '#666666',
    fontSize: 16,
    fontWeight: '600',
  },
  confirmButton: {
    flex: 1,
    backgroundColor: '#FF6B9D',
    paddingVertical: 16,
    borderRadius: 25,
    alignItems: 'center',
    marginLeft: 10,
    shadowColor: '#FF6B9D',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
  },
  confirmButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
});

export default EventScreen;