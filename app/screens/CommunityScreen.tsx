import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  StatusBar,
  ImageBackground,
  Image,
  FlatList
} from 'react-native';

import { useNavigation, useRoute } from '@react-navigation/native';

import {

  Modal,
  TextInput,
  Switch,
  Alert
} from 'react-native';

const { width, height } = Dimensions.get('window');

// const communities = [
//   {
//     id: 1,
//     name: 'Weekend backpackers',
//     description: 'This is a community where we hangout in weekends, by going for a hike or camping.',
//     members: 26,
//     image: 'https://images.unsplash.com/photo-1551632436-cbf8dd35adfa?w=400&h=300&fit=crop',
//     isJoined: false,
//     createdBy: 'Phil',
//     createdDate: '20 May 2025',
//     membersList: [
//       { id: 1, name: 'Phil', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face' },
//       { id: 2, name: 'Jack', image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face' },
//       { id: 3, name: 'Bella', image: 'https://images.unsplash.com/photo-1494790108755-2616c4b3afd3?w=100&h=100&fit=crop&crop=face' },
//       { id: 4, name: 'Joey', image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face' },
//       { id: 5, name: 'Maria', image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face' },
//       { id: 6, name: 'Lora', image: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=100&h=100&fit=crop&crop=face' }
//     ],
//     events: [
//       {
//         id: 1,
//         title: 'Sunset Trail Hike',
//         location: 'Mission Peak',
//         time: 'Sat • 6:00 PM',
//         image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=200&fit=crop'
//       },
//       {
//         id: 2,
//         title: 'Ace north mountain',
//         location: 'North Bay',
//         time: 'Sun • 7:00 AM',
//         image: 'https://images.unsplash.com/photo-1464822759844-d150baef493e?w=400&h=200&fit=crop'
//       },
//       {
//         id: 3,
//         title: 'North trail',
//         location: 'Bay Area',
//         time: 'Mon • 8:00 AM',
//         image: 'https://images.unsplash.com/photo-1551632811-561732d1e306?w=400&h=200&fit=crop'
//       }
//     ],
//     announcements: [
//       {
//         id: 1,
//         title: 'Group Photo Album Drop! Photos From last trip - Glacier Off-Hike',
//         author: 'Bella',
//         time: 'June 24 • 7:00 PM',
//         type: 'photo'
//       },
//       {
//         id: 2,
//         title: 'Nectar Friendly Hike This Weekend! Join us for a Not first - perfect for first-timers!',
//         author: 'Jack',
//         time: 'June 25 • 10:30 PM',
//         type: 'event'
//       },
//       {
//         id: 3,
//         title: 'After the Hike, join us for a cozy campfire session with snacks & stories.',
//         author: 'Joey',
//         time: 'June 25 • 11:00 PM',
//         type: 'info'
//       },
//       {
//         id: 4,
//         title: 'Only 3 spots left for Hidden Lake Trail!',
//         author: 'Luke',
//         time: 'June 26 • 2:00 AM',
//         type: 'alert'
//       },
//       {
//         id: 5,
//         title: 'New route for this weekend\'s Waterfall Escape Hike - now starting from Valley Base Camp.',
//         author: 'Maria',
//         time: 'June 26 • 5:00 AM',
//         type: 'update'
//       }
//     ]
//   },
//   {
//     id: 2,
//     name: 'Nightwalkers',
//     description: 'Late night explorers and night photography enthusiasts.',
//     members: 856,
//     image: 'https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=400&h=300&fit=crop',
//     isJoined: true,
//     createdBy: 'Alex',
//     createdDate: '15 Apr 2025',
//     membersList: [],
//     events: [],
//     announcements: []
//   },
//   {
//     id: 3,
//     name: 'Urban Explorers',
//     description: 'City adventures and urban photography community.',
//     members: 2103,
//     image: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=300&fit=crop',
//     isJoined: false,
//     createdBy: 'Sarah',
//     createdDate: '10 Mar 2025',
//     membersList: [],
//     events: [],
//     announcements: []
//   }
// ];


// Mock communities data
const communities = [
  {
    id: 1,
    name: "Urban Photography Club",
    description: "A community for photographers passionate about capturing urban landscapes and street photography. We organize weekly walks, monthly challenges, and share tips on equipment and techniques.",
    image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=400",
    createdBy: "Sarah Chen",
    createdDate: "March 2023",
    members: 142,
    isJoined: false,
    membersList: [
      { id: 1, name: "Alex Johnson", image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100" },
      { id: 2, name: "Maria Garcia", image: "https://images.unsplash.com/photo-1494790108755-2616b332c8f0?w=100" },
      { id: 3, name: "David Kim", image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100" }
    ],
    events: [
      {
        id: 1,
        title: "Downtown Photo Walk",
        location: "City Center",
        time: "2 PM - 5 PM",
        image: "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=200"
      }
    ],
    announcements: [
      {
        id: 1,
        title: "New monthly challenge announced: Reflections in Architecture",
        author: "Sarah Chen",
        time: "2 hours ago"
      }
    ],
    rules: "1. Respect all members and their work\n2. Share constructive feedback only\n3. No spam or self-promotion\n4. Keep discussions photography-related\n5. Be punctual for organized events",
    communityQuestions: [
      "What's your favorite time of day to photograph urban landscapes?",
      "Which camera lens do you find most versatile for street photography?",
      "What's the most challenging aspect of urban photography for you?",
      "How do you approach strangers when taking street portraits?",
      "What post-processing software do you prefer and why?"
    ]
  }
];

// Mock Ionicons component
const Ionicons = ({ name, size, color }) => (
  <View style={{
    width: size,
    height: size,
    backgroundColor: color,
    borderRadius: size / 2,
    opacity: 0.3
  }} />
);

const CommunityScreen = () => {
  const [activeTab, setActiveTab] = useState('About');
  const [community, setCommunity] = useState(communities[0]);
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [joinFormData, setJoinFormData] = useState({
    notificationsEnabled: false,
    communityQuestion: '',
    questionAnswer: '',
    rulesAccepted: false,
    emailConsent: {
      acceptReject: false,
      updates: false,
      newPosts: false,
      reminders: false,
      urgentMessages: false
    },
    joinCommunity: false
  });

  const randomQuestion = community.communityQuestions[Math.floor(Math.random() * community.communityQuestions.length)];

  useEffect(() => {
    setJoinFormData(prev => ({
      ...prev,
      communityQuestion: randomQuestion
    }));
  }, []);

  const toggleJoinCommunity = () => {
    setShowJoinModal(true);
  };

  const handleJoinSubmit = () => {
    // Validate form
    if (!joinFormData.rulesAccepted) {
      Alert.alert("Please accept the community rules to continue");
      return;
    }
    if (!joinFormData.questionAnswer.trim()) {
      Alert.alert("Please answer the community question");
      return;
    }

    // Process join request
    setCommunity(prev => ({
      ...prev,
      isJoined: true,
      members: prev.members + 1
    }));
    
    setShowJoinModal(false);
    Alert.alert("Join Request Sent!", "Your request has been sent to the organizer. You'll hear back within 24 hours!");
  };

  const renderMemberItem = ({ item }) => (
    <TouchableOpacity style={styles.eventItem}>
      <View style={styles.memberItem}>
        <Image source={{ uri: item.image }} style={styles.memberImage} />
        <Text style={styles.memberName}>{item.name}</Text>
      </View>
    </TouchableOpacity>
  );

  const renderEventItem = ({ item }) => (
    <TouchableOpacity style={styles.eventItem}>
      <Image source={{ uri: item.image }} style={styles.eventImage} />
      <View style={styles.eventInfo}>
        <Text style={styles.eventTitle}>{item.title}</Text>
        <Text style={styles.eventLocation}>{item.location}</Text>
        <Text style={styles.eventTime}>{item.time}</Text>
      </View>
    </TouchableOpacity>
  );

  const renderAnnouncementItem = ({ item }) => (
    <TouchableOpacity style={styles.eventItem}>
      <View style={styles.announcementItem}>
        <Text style={styles.announcementTitle}>{item.title}</Text>
        <Text style={styles.announcementMeta}>{item.author} • {item.time}</Text>
      </View>
    </TouchableOpacity>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'About':
        return (
          <View style={styles.tabContent}>
            <Text style={styles.aboutDescription}>{community.description}</Text>
            <View style={styles.memberSection}>
              <Text style={styles.sectionTitle}>Members ({community.members})</Text>
              <FlatList
                data={community.membersList}
                renderItem={renderMemberItem}
                keyExtractor={(item) => item.id.toString()}
                numColumns={1}
                scrollEnabled={false}
              />
            </View>
          </View>
        );
      case 'Events':
        return (
          <View style={styles.tabContent}>
            <Text style={styles.sectionTitle}>Upcoming ({community.events.length})</Text>
            <FlatList
              data={community.events}
              renderItem={renderEventItem}
              keyExtractor={(item) => item.id.toString()}
              scrollEnabled={false}
            />
            <Text style={styles.sectionTitle}>All events ({community.events.length})</Text>
          </View>
        );
      case 'Announce':
        return (
          <View style={styles.tabContent}>
            <FlatList
              data={community.announcements}
              renderItem={renderAnnouncementItem}
              keyExtractor={(item) => item.id.toString()}
              scrollEnabled={false}
            />
          </View>
        );
      default:
        return null;
    }
  };

  const JoinModal = () => (
    <Modal
      visible={showJoinModal}
      animationType="slide"
      presentationStyle="pageSheet"
    >
      <SafeAreaView style={styles.modalContainer}>
        <View style={styles.modalHeader}>
          <Text style={styles.modalTitle}>Join Community 🎉</Text>
          <TouchableOpacity onPress={() => setShowJoinModal(false)}>
            <Text style={styles.closeButton}>✕</Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.modalContent} showsVerticalScrollIndicator={false}>
          {/* Step 1: Profile Sharing */}
          <View style={styles.stepContainer}>
            <Text style={styles.stepTitle}>📋 Step 1: Profile Review</Text>
            <Text style={styles.stepDescription}>
              To join this community, we'll share your profile with the organizer. They have 24 hours to accept or decline your request.
            </Text>
          </View>

          {/* Step 2: Notifications */}
          <View style={styles.stepContainer}>
            <Text style={styles.stepTitle}>🔔 Step 2: Enable Notifications</Text>
            <Text style={styles.stepDescription}>
              Stay connected! The organizer might send you questions or updates.
            </Text>
            <View style={styles.switchContainer}>
              <Text style={styles.switchLabel}>Enable notifications</Text>
              <Switch
                value={joinFormData.notificationsEnabled}
                onValueChange={(value) => 
                  setJoinFormData(prev => ({ ...prev, notificationsEnabled: value }))
                }
                trackColor={{ false: '#767577', true: '#FF6B6B' }}
              />
            </View>
          </View>

          {/* Step 3: Community Question */}
          <View style={styles.stepContainer}>
            <Text style={styles.stepTitle}>❓ Step 3: Community Question</Text>
            <Text style={styles.questionText}>{joinFormData.communityQuestion}</Text>
            <TextInput
              style={styles.textInput}
              placeholder="Share your thoughts..."
              multiline
              numberOfLines={3}
              value={joinFormData.questionAnswer}
              onChangeText={(text) => 
                setJoinFormData(prev => ({ ...prev, questionAnswer: text }))
              }
            />
          </View>

          {/* Step 4: Rules */}
          <View style={styles.stepContainer}>
            <Text style={styles.stepTitle}>📜 Step 4: Community Rules</Text>
            <View style={styles.rulesContainer}>
              <Text style={styles.rulesText}>{community.rules}</Text>
            </View>
            <View style={styles.checkboxContainer}>
              <TouchableOpacity 
                style={styles.checkbox}
                onPress={() => 
                  setJoinFormData(prev => ({ ...prev, rulesAccepted: !prev.rulesAccepted }))
                }
              >
                <Text style={styles.checkboxText}>
                  {joinFormData.rulesAccepted ? '✅' : '☐'}
                </Text>
              </TouchableOpacity>
              <Text style={styles.checkboxLabel}>I have read and agree to the community rules</Text>
            </View>
          </View>

          {/* Step 5: Email Communications */}
          <View style={styles.stepContainer}>
            <Text style={styles.stepTitle}>📧 Step 5: Email Preferences</Text>
            <Text style={styles.stepDescription}>Choose what you'd like to receive via email:</Text>
            
            {[
              { key: 'acceptReject', label: 'Being accepted or rejected in the event' },
              { key: 'updates', label: 'Updates to time and location' },
              { key: 'newPosts', label: 'New posts regarding the event' },
              { key: 'reminders', label: 'Event reminders' },
              { key: 'urgentMessages', label: 'Urgent messages from host' }
            ].map((item) => (
              <View key={item.key} style={styles.switchContainer}>
                <Text style={styles.switchLabel}>{item.label}</Text>
                <Switch
                  value={joinFormData.emailConsent[item.key]}
                  onValueChange={(value) => 
                    setJoinFormData(prev => ({
                      ...prev,
                      emailConsent: { ...prev.emailConsent, [item.key]: value }
                    }))
                  }
                  trackColor={{ false: '#767577', true: '#FF6B6B' }}
                />
              </View>
            ))}
          </View>

          {/* Step 6: Join Community */}
          <View style={styles.stepContainer}>
            <Text style={styles.stepTitle}>🌟 Bonus: Join the Community</Text>
            <Text style={styles.stepDescription}>
              We noticed you're not part of this community yet. While you can join events individually, 
              staying connected through the community page helps you discover more events and connect with like-minded people!
            </Text>
            <View style={styles.switchContainer}>
              <Text style={styles.switchLabel}>I wish to join the community</Text>
              <Switch
                value={joinFormData.joinCommunity}
                onValueChange={(value) => 
                  setJoinFormData(prev => ({ ...prev, joinCommunity: value }))
                }
                trackColor={{ false: '#767577', true: '#FF6B6B' }}
              />
            </View>
          </View>

          {/* Important Note */}
          <View style={styles.noteContainer}>
            <Text style={styles.noteTitle}>📝 Important Note</Text>
            <Text style={styles.noteText}>
              You can always cancel your participation, but we'll ask for a specific reason 
              to help maintain high engagement levels on our platform.
            </Text>
          </View>

          {/* Submit Button */}
          <TouchableOpacity 
            style={styles.submitButton} 
            onPress={handleJoinSubmit}
          >
            <Text style={styles.submitButtonText}>Send Join Request 🚀</Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      {/* Header with background image */}
      <ImageBackground
        source={{ uri: community.image }}
        style={styles.headerBackground}
        imageStyle={styles.headerImage}
      >
        <View style={styles.headerOverlay}>
          <View style={styles.headerTop}>
            <TouchableOpacity>
              <Ionicons name="chevron-back" size={24} color="#fff" />
            </TouchableOpacity>
            <View style={styles.headerActions}>
              <TouchableOpacity style={styles.headerAction}>
                <Ionicons name="share-outline" size={20} color="#fff" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.headerAction}>
                <Ionicons name="ellipsis-vertical" size={20} color="#fff" />
              </TouchableOpacity>
            </View>
          </View>
          
          <View style={styles.communityInfo}>
            <View style={styles.communityIcon}>
              <Ionicons name="people" size={40} color="#999" />
            </View>
            <Text style={styles.communityName}>{community.name}</Text>
            <Text style={styles.communityMeta}>
              Created by {community.createdBy} • {community.createdDate}
            </Text>
          </View>
        </View>
      </ImageBackground>

      {/* Join Button */}
      <View style={styles.joinButtonContainer}>
        <TouchableOpacity
          style={[
            styles.joinButton,
            community.isJoined && styles.joinedButton
          ]}
          onPress={toggleJoinCommunity}
        >
          <Text style={[
            styles.joinButtonText,
            community.isJoined && styles.joinedButtonText
          ]}>
            {community.isJoined ? 'Joined ✓' : 'Join Community'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Tabs */}
      <View style={styles.tabsContainer}>
        {['About', 'Events', 'Announce'].map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[
              styles.tab,
              activeTab === tab && styles.activeTab
            ]}
            onPress={() => setActiveTab(tab)}
          >
            <Text style={[
              styles.tabText,
              activeTab === tab && styles.activeTabText
            ]}>
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Tab Content */}
      <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        {renderTabContent()}
      </ScrollView>

      <JoinModal />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  headerBackground: {
    height: 250,
    width: '100%',
  },
  headerImage: {
    resizeMode: 'cover',
  },
  headerOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    padding: 20,
    justifyContent: 'space-between',
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 20,
  },
  headerActions: {
    flexDirection: 'row',
  },
  headerAction: {
    marginLeft: 15,
  },
  communityInfo: {
    alignItems: 'center',
  },
  communityIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  communityName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 5,
  },
  communityMeta: {
    fontSize: 14,
    color: '#fff',
    opacity: 0.8,
    textAlign: 'center',
  },
  joinButtonContainer: {
    padding: 20,
    backgroundColor: '#fff',
  },
  joinButton: {
    backgroundColor: '#FF6B6B',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 25,
    alignSelf: 'center',
  },
  joinedButton: {
    backgroundColor: '#4CAF50',
  },
  joinButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  joinedButtonText: {
    color: '#fff',
  },
  tabsContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    backgroundColor: '#fff',
  },
  tab: {
    flex: 1,
    paddingVertical: 15,
    alignItems: 'center',
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#FF6B6B',
  },
  tabText: {
    fontSize: 16,
    color: '#666',
  },
  activeTabText: {
    color: '#FF6B6B',
    fontWeight: '600',
  },
  scrollContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  tabContent: {
    padding: 20,
  },
  aboutDescription: {
    fontSize: 16,
    color: '#333',
    lineHeight: 24,
    marginBottom: 30,
  },
  memberSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  memberItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  memberImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 15,
  },
  memberName: {
    fontSize: 16,
    color: '#333',
  },
  eventItem: {
    flexDirection: 'row',
    marginBottom: 15,
    backgroundColor: '#f8f9fa',
    borderRadius: 10,
    overflow: 'hidden',
  },
  eventImage: {
    width: 80,
    height: 80,
  },
  eventInfo: {
    flex: 1,
    padding: 12,
    justifyContent: 'center',
  },
  eventTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  eventLocation: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
  },
  eventTime: {
    fontSize: 12,
    color: '#999',
  },
  announcementItem: {
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  announcementTitle: {
    fontSize: 15,
    color: '#333',
    lineHeight: 20,
    marginBottom: 5,
  },
  announcementMeta: {
    fontSize: 12,
    color: '#999',
  },
  
  // Modal Styles
  modalContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  closeButton: {
    fontSize: 24,
    color: '#666',
    fontWeight: 'bold',
  },
  modalContent: {
    flex: 1,
    padding: 20,
  },
  stepContainer: {
    marginBottom: 25,
    padding: 20,
    backgroundColor: '#f8f9fa',
    borderRadius: 15,
    borderLeftWidth: 4,
    borderLeftColor: '#FF6B6B',
  },
  stepTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  stepDescription: {
    fontSize: 16,
    color: '#666',
    lineHeight: 22,
    marginBottom: 15,
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  switchLabel: {
    flex: 1,
    fontSize: 15,
    color: '#333',
    marginRight: 10,
  },
  questionText: {
    fontSize: 16,
    color: '#333',
    fontStyle: 'italic',
    backgroundColor: '#e3f2fd',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    padding: 15,
    fontSize: 16,
    textAlignVertical: 'top',
    backgroundColor: '#fff',
  },
  rulesContainer: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  rulesText: {
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    marginRight: 10,
  },
  checkboxText: {
    fontSize: 18,
  },
  checkboxLabel: {
    flex: 1,
    fontSize: 15,
    color: '#333',
  },
  noteContainer: {
    backgroundColor: '#fff3cd',
    padding: 20,
    borderRadius: 15,
    marginBottom: 25,
    borderLeftWidth: 4,
    borderLeftColor: '#ffc107',
  },
  noteTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#856404',
    marginBottom: 8,
  },
  noteText: {
    fontSize: 14,
    color: '#856404',
    lineHeight: 20,
  },
  submitButton: {
    backgroundColor: '#FF6B6B',
    paddingVertical: 16,
    borderRadius: 25,
    alignItems: 'center',
    marginBottom: 30,
    shadowColor: '#FF6B6B',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
export default CommunityScreen;