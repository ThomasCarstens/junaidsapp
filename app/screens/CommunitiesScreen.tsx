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
  },
  {
    id: 4,
    name: 'Spiritualists',
    description: 'Mindful journeys together',
    members: 743,
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop',
    isJoined: false
  },
  {
    id: 5,
    name: 'Rock n roll',
    description: 'Music lovers unite',
    members: 1892,
    image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=300&fit=crop',
    isJoined: true
  },
  {
    id: 6,
    name: 'Nightingales',
    description: 'Night photography enthusiasts',
    members: 654,
    image: 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=400&h=300&fit=crop',
    isJoined: false
  },
  {
    id: 7,
    name: 'Health & fitness',
    description: 'Stay active together',
    members: 3210,
    image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop',
    isJoined: false
  },
  {
    id: 8,
    name: 'Tech bros',
    description: 'Technology and innovation',
    members: 987,
    image: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=300&fit=crop',
    isJoined: true
  },
  {
    id: 9,
    name: 'Bowling sundays',
    description: 'Weekend bowling fun',
    members: 432,
    image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop',
    isJoined: false
  }
];

const CommunitiesScreen = () => {
  const [searchText, setSearchText] = useState('');
  const [filteredCommunities, setFilteredCommunities] = useState(communities);
  const [joinedCommunities, setJoinedCommunities] = useState(communities);
  const navigation = useNavigation();

  useEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);

  useEffect(() => {
    if (searchText.trim() === '') {
      setFilteredCommunities(joinedCommunities);
    } else {
      const filtered = joinedCommunities.filter(community =>
        community.name.toLowerCase().includes(searchText.toLowerCase()) ||
        community.description.toLowerCase().includes(searchText.toLowerCase())
      );
      setFilteredCommunities(filtered);
    }
  }, [searchText, joinedCommunities]);

  const handleCommunityPress = (community) => {
    console.log('Community pressed:', community.name);
  };

  const handleJoinToggle = (communityId) => {
    setJoinedCommunities(prev => 
      prev.map(community => 
        community.id === communityId 
          ? { ...community, isJoined: !community.isJoined }
          : community
      )
    );
  };

  const renderCommunityCard = (community) => (
    <TouchableOpacity
      key={community.id}
      style={styles.communityCard}
      onPress={() => handleCommunityPress(community)}
    >
      <Image source={{ uri: community.image }} style={styles.communityCardImage} />
      <View style={styles.communityCardOverlay}>
        <View style={styles.joinedBadge}>
          {community.isJoined && (
            <View style={styles.joinedIndicator}>
              <Ionicons name="checkmark" size={12} color="#fff" />
              <Text style={styles.joinedText}>Joined</Text>
            </View>
          )}
        </View>
        <View style={styles.communityCardContent}>
          <Text style={styles.communityCardTitle}>{community.name}</Text>
          <Text style={styles.communityCardDescription}>{community.description}</Text>
          <View style={styles.membersContainer}>
            <Ionicons name="people" size={14} color="#fff" />
            <Text style={styles.membersText}>{community.members.toLocaleString()} members</Text>
          </View>
        </View>
      </View>
      <TouchableOpacity 
        style={[styles.joinButton, community.isJoined && styles.joinedButton]}
        onPress={() => handleJoinToggle(community.id)}
      >
        <Text style={[styles.joinButtonText, community.isJoined && styles.joinedButtonText]}>
          {community.isJoined ? 'Joined' : 'Join'}
        </Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Communities</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#999" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search communities..."
          placeholderTextColor="#999"
          value={searchText}
          onChangeText={setSearchText}
        />
      </View>

      <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        {/* Communities Grid */}
        <View style={styles.communitiesGrid}>
          {filteredCommunities.map((community, index) => (
            <View key={community.id} style={[
              styles.communityColumn,
              index % 2 === 0 ? styles.leftColumn : styles.rightColumn
            ]}>
              {renderCommunityCard(community)}
            </View>
          ))}
        </View>

        {/* Join or Create Section */}
        <View style={styles.section}>
          <View style={styles.joinCreateCard}>
            <View style={styles.joinCreateContent}>
              <Text style={styles.joinCreateTitle}>Join or create</Text>
              <Text style={styles.joinCreateSubtitle}>exclusive private communities</Text>
              
              <View style={styles.joinCreateButtons}>
                <TouchableOpacity style={styles.joinActionButton}>
                  <Ionicons name="log-in-outline" size={16} color="#000" />
                  <Text style={styles.joinActionButtonText}>Join</Text>
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 15,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0F0F0',
    borderRadius: 25,
    paddingHorizontal: 15,
    paddingVertical: 12,
    marginHorizontal: 20,
    marginBottom: 20,
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
  communitiesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 15,
  },
  communityColumn: {
    width: '50%',
    paddingHorizontal: 5,
    marginBottom: 15,
  },
  leftColumn: {},
  rightColumn: {},
  communityCard: {
    borderRadius: 15,
    overflow: 'hidden',
    height: 160,
    position: 'relative',
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
    justifyContent: 'space-between',
  },
  joinedBadge: {
    alignSelf: 'flex-end',
    height: 20,
  },
  joinedIndicator: {
    backgroundColor: 'rgba(76, 175, 80, 0.9)',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  joinedText: {
    color: '#fff',
    fontSize: 11,
    marginLeft: 4,
    fontWeight: '500',
  },
  communityCardContent: {
    alignSelf: 'stretch',
  },
  communityCardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  communityCardDescription: {
    fontSize: 12,
    color: '#fff',
    opacity: 0.9,
    marginBottom: 6,
  },
  membersContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  membersText: {
    color: '#fff',
    fontSize: 11,
    marginLeft: 4,
    opacity: 0.8,
  },
  joinButton: {
    position: 'absolute',
    bottom: 12,
    right: 12,
    backgroundColor: '#fff',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
  },
  joinedButton: {
    backgroundColor: 'rgba(76, 175, 80, 0.9)',
  },
  joinButtonText: {
    color: '#000',
    fontSize: 12,
    fontWeight: '600',
  },
  joinedButtonText: {
    color: '#fff',
  },
  section: {
    marginTop: 20,
    marginBottom: 25,
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
  joinActionButton: {
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  joinActionButtonText: {
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
});

export default CommunitiesScreen;