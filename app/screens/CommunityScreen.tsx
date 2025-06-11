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
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';

const { width, height } = Dimensions.get('window');

const communities = [
  {
    id: 1,
    name: 'Weekend backpackers',
    description: 'This is a community where we hangout in weekends, by going for a hike or camping.',
    members: 26,
    image: 'https://images.unsplash.com/photo-1551632436-cbf8dd35adfa?w=400&h=300&fit=crop',
    isJoined: false,
    createdBy: 'Phil',
    createdDate: '20 May 2025',
    membersList: [
      { id: 1, name: 'Phil', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face' },
      { id: 2, name: 'Jack', image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face' },
      { id: 3, name: 'Bella', image: 'https://images.unsplash.com/photo-1494790108755-2616c4b3afd3?w=100&h=100&fit=crop&crop=face' },
      { id: 4, name: 'Joey', image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face' },
      { id: 5, name: 'Maria', image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face' },
      { id: 6, name: 'Lora', image: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=100&h=100&fit=crop&crop=face' }
    ],
    events: [
      {
        id: 1,
        title: 'Sunset Trail Hike',
        location: 'Mission Peak',
        time: 'Sat • 6:00 PM',
        image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=200&fit=crop'
      },
      {
        id: 2,
        title: 'Ace north mountain',
        location: 'North Bay',
        time: 'Sun • 7:00 AM',
        image: 'https://images.unsplash.com/photo-1464822759844-d150baef493e?w=400&h=200&fit=crop'
      },
      {
        id: 3,
        title: 'North trail',
        location: 'Bay Area',
        time: 'Mon • 8:00 AM',
        image: 'https://images.unsplash.com/photo-1551632811-561732d1e306?w=400&h=200&fit=crop'
      }
    ],
    announcements: [
      {
        id: 1,
        title: 'Group Photo Album Drop! Photos From last trip - Glacier Off-Hike',
        author: 'Bella',
        time: 'June 24 • 7:00 PM',
        type: 'photo'
      },
      {
        id: 2,
        title: 'Nectar Friendly Hike This Weekend! Join us for a Not first - perfect for first-timers!',
        author: 'Jack',
        time: 'June 25 • 10:30 PM',
        type: 'event'
      },
      {
        id: 3,
        title: 'After the Hike, join us for a cozy campfire session with snacks & stories.',
        author: 'Joey',
        time: 'June 25 • 11:00 PM',
        type: 'info'
      },
      {
        id: 4,
        title: 'Only 3 spots left for Hidden Lake Trail!',
        author: 'Luke',
        time: 'June 26 • 2:00 AM',
        type: 'alert'
      },
      {
        id: 5,
        title: 'New route for this weekend\'s Waterfall Escape Hike - now starting from Valley Base Camp.',
        author: 'Maria',
        time: 'June 26 • 5:00 AM',
        type: 'update'
      }
    ]
  },
  {
    id: 2,
    name: 'Nightwalkers',
    description: 'Late night explorers and night photography enthusiasts.',
    members: 856,
    image: 'https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=400&h=300&fit=crop',
    isJoined: true,
    createdBy: 'Alex',
    createdDate: '15 Apr 2025',
    membersList: [],
    events: [],
    announcements: []
  },
  {
    id: 3,
    name: 'Urban Explorers',
    description: 'City adventures and urban photography community.',
    members: 2103,
    image: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=300&fit=crop',
    isJoined: false,
    createdBy: 'Sarah',
    createdDate: '10 Mar 2025',
    membersList: [],
    events: [],
    announcements: []
  }
];

const CommunityScreen = () => {
  const [activeTab, setActiveTab] = useState('About');
  const [community, setCommunity] = useState(communities[0]); // Default to first community
  const navigation = useNavigation();
  const route = useRoute();

  useEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
    
    // If community ID is passed via route params, find and set that community
    if (route.params?.communityId) {
      const selectedCommunity = communities.find(c => c.id === route.params.communityId);
      if (selectedCommunity) {
        setCommunity(selectedCommunity);
      }
    }
  }, [navigation, route.params]);

  const toggleJoinCommunity = () => {
    setCommunity(prev => ({
      ...prev,
      isJoined: !prev.isJoined,
      members: prev.isJoined ? prev.members - 1 : prev.members + 1
    }));
  };

  const renderMemberItem = ({ item }) => (
    <View style={styles.memberItem}>
      <Image source={{ uri: item.image }} style={styles.memberImage} />
      <Text style={styles.memberName}>{item.name}</Text>
    </View>
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
    <View style={styles.announcementItem}>
      <Text style={styles.announcementTitle}>{item.title}</Text>
      <Text style={styles.announcementMeta}>{item.author} • {item.time}</Text>
    </View>
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
            <TouchableOpacity onPress={() => navigation.goBack()}>
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
            {community.isJoined ? 'Joined' : 'Join now JV'}
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
    backgroundColor: '#f0f0f0',
  },
  joinButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  joinedButtonText: {
    color: '#666',
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
});

export default CommunityScreen;