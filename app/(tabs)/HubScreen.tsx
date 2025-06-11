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
  Image,
  TextInput
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const { width, height } = Dimensions.get('window');

// Using the same sample data from your existing screen
const sampleEvents = [
  {
    id: 1,
    title: 'Roadtrip to Miami',
    time: 'Fri, 5:00 PM',
    joined: 12,
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop',
    category: 'Travel'
  },
  {
    id: 2,
    title: 'Picnic at park',
    time: 'Tomorrow, 10 AM',
    joined: 15,
    image: 'https://images.unsplash.com/photo-1551632811-561732d1e306?w=400&h=300&fit=crop',
    category: 'Outdoor'
  },
  {
    id: 3,
    title: 'Hiking',
    time: '20th Jan, 6 AM',
    joined: 8,
    image: 'https://images.unsplash.com/photo-1551632811-561732d1e306?w=400&h=300&fit=crop',
    category: 'Adventure'
  },
  {
    id: 4,
    title: 'Tennis',
    time: '3rd Jan, 5 PM',
    joined: 6,
    image: 'https://images.unsplash.com/photo-1554068865-24cecd4e34b8?w=400&h=300&fit=crop',
    category: 'Sports'
  },
  {
    id: 5,
    title: 'Housewarming',
    time: '2nd Jan, 7 PM',
    joined: 25,
    image: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=300&fit=crop',
    category: 'Social'
  },
  {
    id: 6,
    title: 'Game night',
    time: '2nd Jan, 8 PM',
    joined: 18,
    image: 'https://images.unsplash.com/photo-1606092195730-5d7b9af1efc5?w=400&h=300&fit=crop',
    category: 'Gaming'
  },
  {
    id: 7,
    title: 'Potluck lunch',
    time: '5th Jan, 12 PM',
    joined: 22,
    image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400&h=300&fit=crop',
    category: 'Food'
  },
  {
    id: 8,
    title: 'Escape room',
    time: '22nd Jan, 10 AM',
    joined: 10,
    image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop',
    category: 'Adventure'
  }
]
const communities = [
  {
    id: 1,
    name: 'The Backpackers',
    description: 'Adventure seekers unite',
    members: 1247,
    image: 'https://images.unsplash.com/photo-1551632436-cbf8dd35adfa?w=400&h=300&fit=crop',
    isJoined: false
  },
  {
    id: 2,
    name: 'Nightwalkers',
    description: 'Late night explorers',
    members: 856,
    image: 'https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=400&h=300&fit=crop',
    isJoined: true
  },
  {
    id: 3,
    name: 'Urban Explorers',
    description: 'City adventures await',
    members: 2103,
    image: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=300&fit=crop',
    isJoined: false
  }
];

const mapLocations = [
  { id: 1, count: 87, x: 60, y: 40 },
  { id: 2, count: 122, x: 180, y: 80 },
  { id: 3, count: 134, x: 120, y: 140 }
];

const HubScreen = () => {
  const [searchText, setSearchText] = useState('');
  const navigation = useNavigation();

  useEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);

  const handleProfilePress = () => {
    navigation.navigate('Profile');
  };

  const handleEventPress = (event) => {
    // Navigate to event details or back to swipe screen
    navigation.navigate('Event', { event });
  };

  const handleCommunityPress = (community) => {
    // Navigate to community details
    navigation.navigate('Community', { communityId: community.id });
    console.log('Community pressed:', community.name);
  };

  const handleJoinCommunity = (communityId) => {
    // Handle joining/leaving community
    console.log('Toggle join for community:', communityId);
  };

  const renderExploreCard = (event, index) => (
    <TouchableOpacity
      key={event.id}
      style={[
        styles.exploreCard,
        index === 0 ? styles.largeCard : styles.smallCard
      ]}
      onPress={() => handleEventPress(event)}
    >
      <Image source={{ uri: event.image }} style={styles.exploreCardImage} />
      <View style={styles.exploreCardOverlay}>
        <View style={styles.participantsBadge}>
          <Ionicons name="people" size={12} color="#fff" />
          <Text style={styles.participantsText}>{event.participants}</Text>
        </View>
        <View style={styles.exploreCardContent}>
          <Text style={styles.exploreCardTitle}>{event.title}</Text>
          <Text style={styles.exploreCardSubtitle}>{event.date} • {event.time}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderCommunityCard = (community) => (
    <TouchableOpacity
      key={community.id}
      style={styles.communityCard}
      onPress={() => handleCommunityPress(community)}
    >
      <Image source={{ uri: community.image }} style={styles.communityCardImage} />
      <View style={styles.communityCardOverlay}>
        <View style={styles.communityCardContent}>
          <Text style={styles.communityCardTitle}>{community.name}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderMapPin = (location) => (
    <View
      key={location.id}
      style={[
        styles.mapPin,
        { left: location.x, top: location.y }
      ]}
    >
      <View style={styles.mapPinIcon}>
        <Ionicons name="people" size={12} color="#fff" />
        <Text style={styles.mapPinText}>{location.count}</Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Hub</Text>
        
        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color="#999" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Explore events near you"
            placeholderTextColor="#999"
            value={searchText}
            onChangeText={setSearchText}
          />
        </View>
      </View>

      <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        {/* Explore Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Explore</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Explore')}>
              <Text style={styles.seeAllText}>See all</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.exploreGrid}>
            <View style={styles.exploreColumn}>
              {renderExploreCard(sampleEvents[0], 0)}
            </View>
            <View style={styles.exploreColumn}>
              {renderExploreCard(sampleEvents[1], 1)}
              {renderExploreCard(sampleEvents[2], 2)}
            </View>
          </View>
        </View>

        {/* Map Section */}
        <View style={styles.section}>
          <View style={styles.mapContainer}>
            <View style={styles.mapBackground}>
              {/* Simplified map background */}
              <View style={styles.mapRoad} />
              <View style={[styles.mapRoad, styles.mapRoadVertical]} />
              <View style={styles.mapPark} />
              
              {/* Map pins */}
              {mapLocations.map(renderMapPin)}
              
              {/* Open Map Button */}
              <TouchableOpacity style={styles.openMapButton}>
                <Text style={styles.openMapText}>Open the Map</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Communities Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Communities</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Communities')}>
              <Text style={styles.seeAllText}>See all</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.communitiesGrid}>
            {communities.slice(0, 2).map(renderCommunityCard)}
          </View>
        </View>

        {/* Join or Create Section */}
        <View style={styles.section}>
          <View style={styles.joinCreateCard}>
            <View style={styles.joinCreateContent}>
              <Text style={styles.joinCreateTitle}>Join or create</Text>
              <Text style={styles.joinCreateSubtitle}>exclusive private communities</Text>
              
              <View style={styles.joinCreateButtons}>
                <TouchableOpacity style={styles.joinButton}>
                  <Ionicons name="log-in-outline" size={16} color="#000" />
                  <Text style={styles.joinButtonText}>Join</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.createButton}>
                  <Text style={styles.createButtonText}>Create New</Text>
                </TouchableOpacity>
              </View>
            </View>
            
            <View style={styles.joinCreateIllustration}>
              <View style={[styles.illustrationBlock, { backgroundColor: '#FF6B6B' }]} />
              <View style={[styles.illustrationBlock, { backgroundColor: '#4ECDC4' }]} />
              <View style={[styles.illustrationBlock, { backgroundColor: '#45B7D1' }]} />
            </View>
          </View>
        </View>
      </ScrollView>

    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 15,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 15,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0F0F0',
    borderRadius: 25,
    paddingHorizontal: 15,
    paddingVertical: 12,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  scrollContainer: {
    flex: 1,
  },
  section: {
    marginBottom: 25,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#000',
  },
  seeAllText: {
    fontSize: 16,
    color: '#FF6B6B',
    fontWeight: '500',
  },
  exploreGrid: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 10,
  },
  exploreColumn: {
    flex: 1,
    gap: 10,
  },
  exploreCard: {
    borderRadius: 15,
    overflow: 'hidden',
  },
  largeCard: {
    height: 220,
  },
  smallCard: {
    height: 105,
  },
  exploreCardImage: {
    width: '100%',
    height: '100%',
  },
  exploreCardOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.3)',
    padding: 15,
    justifyContent: 'space-between',
  },
  participantsBadge: {
    alignSelf: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.6)',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  participantsText: {
    color: '#fff',
    fontSize: 12,
    marginLeft: 4,
    fontWeight: '500',
  },
  exploreCardContent: {
    alignSelf: 'stretch',
  },
  exploreCardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  exploreCardSubtitle: {
    fontSize: 12,
    color: '#fff',
    opacity: 0.9,
  },
  mapContainer: {
    paddingHorizontal: 20,
  },
  mapBackground: {
    height: 200,
    backgroundColor: '#E8F4FD',
    borderRadius: 15,
    position: 'relative',
    overflow: 'hidden',
  },
  mapRoad: {
    position: 'absolute',
    height: 3,
    backgroundColor: '#D0D0D0',
    top: 100,
    left: 0,
    right: 0,
  },
  mapRoadVertical: {
    width: 3,
    height: '100%',
    top: 0,
    left: 120,
    right: 'auto',
  },
  mapPark: {
    position: 'absolute',
    width: 60,
    height: 60,
    backgroundColor: '#C8E6C9',
    borderRadius: 30,
    top: 20,
    left: 20,
  },
  mapPin: {
    position: 'absolute',
  },
  mapPinIcon: {
    backgroundColor: '#9C27B0',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  mapPinText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
    marginLeft: 4,
  },
  openMapButton: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: '#000',
    paddingVertical: 12,
    borderRadius: 25,
    alignItems: 'center',
  },
  openMapText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  communitiesGrid: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 10,
  },
  communityCard: {
    flex: 1,
    height: 120,
    borderRadius: 15,
    overflow: 'hidden',
  },
  communityCardImage: {
    width: '100%',
    height: '100%',
  },
  communityCardOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.4)',
    padding: 15,
    justifyContent: 'flex-end',
  },
  communityCardContent: {
    alignSelf: 'stretch',
  },
  communityCardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  joinCreateCard: {
    marginHorizontal: 20,
    backgroundColor: '#2C2C2C',
    borderRadius: 15,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  joinCreateContent: {
    flex: 1,
  },
  joinCreateTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  joinCreateSubtitle: {
    fontSize: 14,
    color: '#999',
    marginBottom: 15,
  },
  joinCreateButtons: {
    flexDirection: 'row',
    gap: 10,
  },
  joinButton: {
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  joinButtonText: {
    color: '#000',
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 4,
  },
  createButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#666',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  createButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
  joinCreateIllustration: {
    flexDirection: 'row',
    gap: 5,
  },
  illustrationBlock: {
    width: 20,
    height: 30,
    borderRadius: 4,
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});


export default HubScreen;