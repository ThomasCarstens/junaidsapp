import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Animated,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  StatusBar,
  Image
} from 'react-native';
import { PanGestureHandler } from 'react-native-gesture-handler';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const { width, height } = Dimensions.get('window');

// Sample events data
const sampleEvents = [
  {
    id: 1,
    title: 'Roadtrip to Miami',
    name: 'Aliana, 21',
    time: '5:00 PM',
    date: 'Fri',
    distance: '200m away',
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=600&fit=crop',
    category: 'Travel',
    joined: 12,
    details: {
      location: 'Miami Beach, Florida',
      fullDate: 'Friday, 5:00 PM',
      description: 'Join us for an epic road trip to Miami! We\'ll explore the vibrant nightlife, beautiful beaches, and amazing food scene. Perfect for adventure seekers looking to make new friends.',
      visibility: 'Open to all',
      participants: 12,
      remaining: 'Only 3 spots remaining'
    }
  },
  {
    id: 2,
    title: 'Picnic at park',
    name: 'Marcus, 28',
    time: '10:00 AM',
    date: 'Tomorrow',
    distance: '450m away',
    image: 'https://images.unsplash.com/photo-1551632811-561732d1e306?w=400&h=600&fit=crop',
    category: 'Outdoor',
    joined: 15,
    details: {
      location: 'Central Park, NYC',
      fullDate: 'Tomorrow, 10:00 AM',
      description: 'Relaxing picnic in the park with good food, games, and great company. Bring your favorite dish to share and enjoy a peaceful day outdoors.',
      visibility: 'Open to all',
      participants: 15,
      remaining: '6 spots available'
    }
  },
  {
    id: 3,
    title: 'Hiking Adventure',
    name: 'Luna, 26',
    time: '6:00 AM',
    date: '20th Jan',
    distance: '800m away',
    image: 'https://images.unsplash.com/photo-1551632436-cbf8dd35adfa?w=400&h=600&fit=crop',
    category: 'Adventure',
    joined: 8,
    details: {
      location: 'Mountain Trail, California',
      fullDate: '20th Jan, 6:00 AM',
      description: 'Early morning hike to catch the sunrise from the summit. Moderate difficulty level, perfect for nature lovers and fitness enthusiasts.',
      visibility: 'Open to all',
      participants: 8,
      remaining: '4 spots left'
    }
  },
  {
    id: 4,
    title: 'Tennis Match',
    name: 'Raven, 24',
    time: '5:00 PM',
    date: '3rd Jan',
    distance: '1.2km away',
    image: 'https://images.unsplash.com/photo-1554068865-24cecd4e34b8?w=400&h=600&fit=crop',
    category: 'Sports',
    joined: 6,
    details: {
      location: 'City Tennis Courts',
      fullDate: '3rd Jan, 5:00 PM',
      description: 'Friendly tennis matches for all skill levels. Rackets available for rent. Come play and improve your game!',
      visibility: 'Open to all',
      participants: 6,
      remaining: 'Plenty of space available'
    }
  },
  {
    id: 5,
    title: 'Housewarming Party',
    name: 'Orion, 30',
    time: '7:00 PM',
    date: '2nd Jan',
    distance: '350m away',
    image: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=600&fit=crop',
    category: 'Social',
    joined: 25,
    details: {
      location: 'Downtown Apartment',
      fullDate: '2nd Jan, 7:00 PM',
      description: 'Celebrating my new place! Join us for food, drinks, music, and good vibes. Let\'s make this a night to remember.',
      visibility: 'Open to all',
      participants: 25,
      remaining: '12 spots remaining'
    }
  },
  {
    id: 6,
    title: 'Game Night',
    name: 'Sage, 27',
    time: '8:00 PM',
    date: '2nd Jan',
    distance: '600m away',
    image: 'https://images.unsplash.com/photo-1606092195730-5d7b9af1efc5?w=400&h=600&fit=crop',
    category: 'Gaming',
    joined: 18,
    details: {
      location: 'Community Center',
      fullDate: '2nd Jan, 8:00 PM',
      description: 'Board games, card games, and video games! All skill levels welcome. Snacks and drinks provided.',
      visibility: 'Open to all',
      participants: 18,
      remaining: '9 spots available'
    }
  }
];

// Sample communities data
const communities = [
  {
    id: 1,
    name: 'The Backpackers',
    description: 'Adventure seekers unite',
    members: 1247,
    image: 'https://images.unsplash.com/photo-1551632436-cbf8dd35adfa?w=400&h=600&fit=crop',
    isJoined: true,
    category: 'Travel'
  },
  {
    id: 2,
    name: 'Nightwalkers',
    description: 'Late night explorers',
    members: 856,
    image: 'https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=400&h=600&fit=crop',
    isJoined: true,
    category: 'Adventure'
  },
  {
    id: 3,
    name: 'Urban Explorers',
    description: 'City adventures await',
    members: 2103,
    image: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=600&fit=crop',
    isJoined: true,
    category: 'Urban'
  },
  {
    id: 4,
    name: 'Fitness Friends',
    description: 'Stay active together',
    members: 892,
    image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=600&fit=crop',
    isJoined: false,
    category: 'Fitness'
  },
  {
    id: 5,
    name: 'Foodies United',
    description: 'Culinary adventures',
    members: 1543,
    image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400&h=600&fit=crop',
    isJoined: true,
    category: 'Food'
  }
];

// Sample people data
const membersList = [
  { 
    id: 1, 
    name: 'Phil', 
    age: 28,
    distance: '200m away',
    interests: ['Travel', 'Photography'],
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=600&fit=crop&crop=face',
    bio: 'Adventure seeker and travel enthusiast. Always looking for the next great experience!'
  },
  { 
    id: 2, 
    name: 'Jack', 
    age: 25,
    distance: '450m away',
    interests: ['Sports', 'Fitness'],
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=600&fit=crop&crop=face',
    bio: 'Fitness coach and sports lover. Let\'s stay active and have fun together!'
  },
  { 
    id: 3, 
    name: 'Bella', 
    age: 23,
    distance: '300m away',
    interests: ['Art', 'Music'],
    image: 'https://images.unsplash.com/photo-1494790108755-2616c4b3afd3?w=400&h=600&fit=crop&crop=face',
    bio: 'Artist and music lover. Always up for creative adventures and cultural events.'
  },
  { 
    id: 4, 
    name: 'Joey', 
    age: 30,
    distance: '600m away',
    interests: ['Gaming', 'Tech'],
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=600&fit=crop&crop=face',
    bio: 'Tech enthusiast and gamer. Love exploring new technologies and meeting fellow geeks!'
  },
  { 
    id: 5, 
    name: 'Maria', 
    age: 26,
    distance: '800m away',
    interests: ['Food', 'Cooking'],
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=600&fit=crop&crop=face',
    bio: 'Food lover and home chef. Always excited to try new restaurants and share recipes!'
  },
  { 
    id: 6, 
    name: 'Lora', 
    age: 29,
    distance: '1km away',
    interests: ['Nature', 'Hiking'],
    image: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=400&h=600&fit=crop&crop=face',
    bio: 'Nature lover and hiking enthusiast. Let\'s explore the great outdoors together!'
  }
];

const HomeScreen = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showDetails, setShowDetails] = useState(false);
  const [activeTab, setActiveTab] = useState('All');
  
  const pan = useRef(new Animated.ValueXY()).current;
  const scale = useRef(new Animated.Value(1)).current;
  const nextCardScale = useRef(new Animated.Value(0.9)).current;
  const nextCardOpacity = useRef(new Animated.Value(0.7)).current;

  const navigation = useNavigation();

  // Get current data based on active tab
  const getCurrentData = () => {
    switch (activeTab) {
      case 'Events':
        return sampleEvents;
      case 'People':
        return membersList;
      case 'Backpackers':
        return sampleEvents.filter(event => ['Travel', 'Adventure'].includes(event.category));
      case 'Nightwalkers':
        return sampleEvents.filter(event => event.time.includes('PM') || event.time.includes('AM'));
      case 'Urban Explorers':
        return sampleEvents.filter(event => ['Urban', 'Social'].includes(event.category));
      case 'Foodies':
        return sampleEvents.filter(event => event.category === 'Food');
      default: // 'All'
        return [...sampleEvents, ...communities.map(c => ({...c, type: 'community'})), ...membersList.map(p => ({...p, type: 'person'}))];
    }
  };

  const currentData = getCurrentData();
  const currentItem = currentData[currentIndex];

  // Get available tabs (joined communities + default tabs)
  const getAvailableTabs = () => {
    const defaultTabs = ['All', 'Events', 'People'];
    const joinedCommunityTabs = communities
      .filter(community => community.isJoined)
      .map(community => community.name);
    
    return [...defaultTabs, ...joinedCommunityTabs];
  };

  const availableTabs = getAvailableTabs();

  useEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);

  useEffect(() => {
    // Reset index when tab changes
    setCurrentIndex(0);
    setShowDetails(false);
    pan.setValue({ x: 0, y: 0 });
    scale.setValue(1);
  }, [activeTab]);

  const handleProfilePress = () => {
    navigation.navigate('Profile');
  };

  const resetPosition = () => {
    Animated.spring(pan, {
      toValue: { x: 0, y: 0 },
      useNativeDriver: false,
    }).start();
    
    Animated.spring(scale, {
      toValue: 1,
      useNativeDriver: false,
    }).start();
  };

  const forceSwipe = (direction) => {
    const x = direction === 'right' ? width : -width;
    Animated.timing(pan, {
      toValue: { x, y: 0 },
      duration: 250,
      useNativeDriver: false,
    }).start(() => onSwipeComplete(direction));
  };

  const onSwipeComplete = (direction) => {
    pan.setValue({ x: 0, y: 0 });
    scale.setValue(1);
    setCurrentIndex(currentIndex + 1);
    setShowDetails(false);
    
    // Animate next card
    Animated.parallel([
      Animated.spring(nextCardScale, {
        toValue: 1,
        useNativeDriver: false,
      }),
      Animated.spring(nextCardOpacity, {
        toValue: 1,
        useNativeDriver: false,
      })
    ]).start(() => {
      nextCardScale.setValue(0.9);
      nextCardOpacity.setValue(0.7);
    });
  };

  const getCardStyle = () => {
    const rotate = pan.x.interpolate({
      inputRange: [-width * 1.5, 0, width * 1.5],
      outputRange: ['-20deg', '0deg', '20deg'],
    });

    return {
      ...pan.getLayout(),
      transform: [{ rotate }, { scale }]
    };
  };

  const getNextCardStyle = () => {
    return {
      transform: [
        { scale: nextCardScale },
      ],
      opacity: nextCardOpacity,
    };
  };

  const renderEventCard = (event, isNext = false) => {
    return (
      <Animated.View
        style={[
          styles.card,
          isNext ? getNextCardStyle() : getCardStyle(),
          isNext && styles.nextCard
        ]}
      >
        <View style={styles.imageContainer}>
          <Image 
            source={{ uri: event.image }}
            style={styles.imageBackground}
          />
          <View style={styles.distanceBadge}>
            <Ionicons name="location" size={12} color="#fff" />
            <Text style={styles.distanceText}>{event.distance}</Text>
          </View>
          
          <View style={styles.cardContent}>
            <Text style={styles.eventTitle}>{event.title}</Text>
            <Text style={styles.eventName}>{event.name}</Text>
            <View style={styles.timeContainer}>
              <Text style={styles.timeText}>{event.time}</Text>
              <Text style={styles.dateText}>{event.date}</Text>
            </View>
          </View>
          
          {!isNext && (
            <TouchableOpacity 
              style={styles.infoButton}
              onPress={() => setShowDetails(!showDetails)}
            >
              <Ionicons 
                name={showDetails ? "chevron-down" : "chevron-up"} 
                size={24} 
                color="#fff" 
              />
            </TouchableOpacity>
          )}
        </View>
      </Animated.View>
    );
  };

  const renderPersonCard = (person, isNext = false) => {
    return (
      <Animated.View
        style={[
          styles.card,
          isNext ? getNextCardStyle() : getCardStyle(),
          isNext && styles.nextCard
        ]}
      >
        <View style={styles.imageContainer}>
          <Image 
            source={{ uri: person.image }}
            style={styles.imageBackground}
          />
          <View style={styles.distanceBadge}>
            <Ionicons name="location" size={12} color="#fff" />
            <Text style={styles.distanceText}>{person.distance}</Text>
          </View>
          
          <View style={styles.cardContent}>
            <Text style={styles.eventTitle}>{person.name}, {person.age}</Text>
            <View style={styles.interestsContainer}>
              {person.interests.map((interest, index) => (
                <View key={index} style={styles.interestTag}>
                  <Text style={styles.interestText}>{interest}</Text>
                </View>
              ))}
            </View>
            <Text style={styles.bioText}>{person.bio}</Text>
          </View>
          
          {!isNext && (
            <TouchableOpacity 
              style={styles.infoButton}
              onPress={() => setShowDetails(!showDetails)}
            >
              <Ionicons 
                name={showDetails ? "chevron-down" : "chevron-up"} 
                size={24} 
                color="#fff" 
              />
            </TouchableOpacity>
          )}
        </View>
      </Animated.View>
    );
  };

  const renderCommunityCard = (community, isNext = false) => {
    return (
      <Animated.View
        style={[
          styles.card,
          isNext ? getNextCardStyle() : getCardStyle(),
          isNext && styles.nextCard
        ]}
      >
        <View style={styles.imageContainer}>
          <Image 
            source={{ uri: community.image }}
            style={styles.imageBackground}
          />
          <View style={styles.membersBadge}>
            <Ionicons name="people" size={12} color="#fff" />
            <Text style={styles.distanceText}>{community.members}</Text>
          </View>
          
          <View style={styles.cardContent}>
            <Text style={styles.eventTitle}>{community.name}</Text>
            <Text style={styles.eventName}>{community.description}</Text>
            <View style={styles.timeContainer}>
              <Text style={styles.timeText}>{community.members} members</Text>
              {community.isJoined && (
                <View style={styles.joinedBadge}>
                  <Text style={styles.joinedText}>Joined</Text>
                </View>
              )}
            </View>
          </View>
          
          {!isNext && (
            <TouchableOpacity 
              style={styles.infoButton}
              onPress={() => setShowDetails(!showDetails)}
            >
              <Ionicons 
                name={showDetails ? "chevron-down" : "chevron-up"} 
                size={24} 
                color="#fff" 
              />
            </TouchableOpacity>
          )}
        </View>
      </Animated.View>
    );
  };

  const renderCard = (item, isNext = false) => {
    if (!item) return null;

    if (item.type === 'person') {
      return renderPersonCard(item, isNext);
    } else if (item.type === 'community') {
      return renderCommunityCard(item, isNext);
    } else {
      return renderEventCard(item, isNext);
    }
  };

  const detailsPan = useRef(new Animated.Value(0)).current;
  
  const handleDetailsGesture = Animated.event(
    [{ nativeEvent: { translationY: detailsPan } }],
    { useNativeDriver: false }
  );

  const handleDetailsGestureStateChange = (event) => {
    if (event.nativeEvent.oldState === 4) {
      const { translationY, velocityY } = event.nativeEvent;
      
      if (translationY > 100 || velocityY > 500) {
        Animated.timing(detailsPan, {
          toValue: height * 0.6,
          duration: 300,
          useNativeDriver: false,
        }).start(() => {
          setShowDetails(false);
          detailsPan.setValue(0);
        });
      } else {
        Animated.spring(detailsPan, {
          toValue: 0,
          useNativeDriver: false,
        }).start();
      }
    }
  };

  const getDetailsStyle = () => {
    return {
      transform: [{
        translateY: detailsPan.interpolate({
          inputRange: [0, height * 0.6],
          outputRange: [0, height * 0.6],
          extrapolate: 'clamp',
        })
      }]
    };
  };

  const renderDetails = () => {
    if (!showDetails || !currentItem) return null;

    const renderEventDetails = () => (
      <View style={styles.detailsContent}>
        <View style={styles.locationInfo}>
          <View style={styles.locationDot} />
          <Text style={styles.locationText}>{currentItem.details?.location || 'Location TBD'}</Text>
          <TouchableOpacity style={styles.jumpInButton}>
            <Text style={styles.jumpInText}>Jump in</Text>
            <Ionicons name="arrow-forward" size={16} color="#fff" />
          </TouchableOpacity>
        </View>
        
        <View style={styles.dateTimeInfo}>
          <Ionicons name="time-outline" size={16} color="#666" />
          <Text style={styles.dateTimeText}>{currentItem.details?.fullDate || `${currentItem.date}, ${currentItem.time}`}</Text>
        </View>

        <View style={styles.aboutSection}>
          <Text style={styles.aboutTitle}>About event</Text>
          <Text style={styles.aboutText}>{currentItem.details?.description || 'No description available.'}</Text>
        </View>

        <View style={styles.visibilitySection}>
          <Text style={styles.visibilityTitle}>
            Visibility: <Text style={styles.visibilityValue}>{currentItem.details?.visibility || 'Open to all'}</Text>
          </Text>
          <View style={styles.participantsInfo}>
            <View style={styles.participantAvatars}>
              <View style={[styles.avatar, { backgroundColor: '#FF6B6B' }]} />
              <View style={[styles.avatar, { backgroundColor: '#4ECDC4' }]} />
              <View style={[styles.avatar, { backgroundColor: '#45B7D1' }]} />
            </View>
            <Text style={styles.participantCount}>
              <Text style={styles.participantNumber}>{currentItem.details?.participants || currentItem.joined || 0}</Text> joined
            </Text>
          </View>
          <Text style={styles.remainingText}>{currentItem.details?.remaining || 'Spots available'}</Text>
        </View>
      </View>
    );

    const renderPersonDetails = () => (
      <View style={styles.detailsContent}>
        <View style={styles.locationInfo}>
          <View style={styles.locationDot} />
          <Text style={styles.locationText}>{currentItem.distance}</Text>
          <TouchableOpacity style={styles.jumpInButton}>
            <Text style={styles.jumpInText}>Connect</Text>
            <Ionicons name="person-add" size={16} color="#fff" />
          </TouchableOpacity>
        </View>

        <View style={styles.aboutSection}>
          <Text style={styles.aboutTitle}>About</Text>
          <Text style={styles.aboutText}>{currentItem.bio}</Text>
        </View>

        <View style={styles.visibilitySection}>
          <Text style={styles.visibilityTitle}>Interests</Text>
          <View style={styles.interestsContainer}>
            {currentItem.interests.map((interest, index) => (
              <View key={index} style={styles.interestTag}>
                <Text style={styles.interestText}>{interest}</Text>
              </View>
            ))}
          </View>
        </View>
      </View>
    );

    const renderCommunityDetails = () => (
      <View style={styles.detailsContent}>
        <View style={styles.locationInfo}>
          <View style={styles.locationDot} />
          <Text style={styles.locationText}>{currentItem.members} members</Text>
          <TouchableOpacity style={styles.jumpInButton}>
            <Text style={styles.jumpInText}>{currentItem.isJoined ? 'Joined' : 'Join'}</Text>
            <Ionicons name={currentItem.isJoined ? "checkmark" : "add"} size={16} color="#fff" />
          </TouchableOpacity>
        </View>

        <View style={styles.aboutSection}>
          <Text style={styles.aboutTitle}>About community</Text>
          <Text style={styles.aboutText}>{currentItem.description}</Text>
        </View>

        <View style={styles.visibilitySection}>
          <Text style={styles.visibilityTitle}>Category: <Text style={styles.visibilityValue}>{currentItem.category}</Text></Text>
          <View style={styles.participantsInfo}>
            <View style={styles.participantAvatars}>
              <View style={[styles.avatar, { backgroundColor: '#FF6B6B' }]} />
              <View style={[styles.avatar, { backgroundColor: '#4ECDC4' }]} />
              <View style={[styles.avatar, { backgroundColor: '#45B7D1' }]} />
            </View>
            <Text style={styles.participantCount}>
              <Text style={styles.participantNumber}>{currentItem.members}</Text> members
            </Text>
          </View>
        </View>
      </View>
    );

    return (
      <PanGestureHandler
        onGestureEvent={handleDetailsGesture}
        onHandlerStateChange={handleDetailsGestureStateChange}
      >
        <Animated.View style={[styles.detailsContainer, getDetailsStyle()]}>
          <View style={styles.detailsHandle} />
          <ScrollView showsVerticalScrollIndicator={false}>
            {currentItem.type === 'person' && renderPersonDetails()}
            {currentItem.type === 'community' && renderCommunityDetails()}
            {!currentItem.type && renderEventDetails()}
          </ScrollView>
        </Animated.View>
      </PanGestureHandler>
    );
  };

  const handleGesture = Animated.event(
    [{ nativeEvent: { translationX: pan.x, translationY: pan.y } }],
    { useNativeDriver: false }
  );

  const handleGestureStateChange = (event) => {
    if (event.nativeEvent.oldState === 4) {
      const { translationX } = event.nativeEvent;
      const threshold = width * 0.25;

      if (translationX > threshold) {
        forceSwipe('right');
      } else if (translationX < -threshold) {
        forceSwipe('left');
      } else {
        resetPosition();
      }
    }
  };

  if (currentIndex >= currentData.length) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.noMoreCards}>
          <Text style={styles.noMoreText}>No more {activeTab.toLowerCase()}!</Text>
          <TouchableOpacity 
            style={styles.resetButton}
            onPress={() => setCurrentIndex(0)}
          >
            <Text style={styles.resetButtonText}>Start Over</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <Text style={styles.headerTitle}>Explore near you</Text>
          <TouchableOpacity onPress={handleProfilePress} style={styles.profilePicture}>
            <Image 
              source={{ uri: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=600&fit=crop' }}
              style={styles.profileImage}
            />
          </TouchableOpacity>
        </View>
        
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={styles.tabScrollView}
          contentContainerStyle={styles.tabContainer}
        >
          {availableTabs.map((tab) => (
            <TouchableOpacity
              key={tab}
              style={[styles.tab, activeTab === tab && styles.activeTab]}
              onPress={() => setActiveTab(tab)}
            >
              <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>
                {tab}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Cards */}
      <View style={styles.cardContainer}>
        {/* Next card (behind) */}
        {currentData[currentIndex + 1] && renderCard(currentData[currentIndex + 1], true)}
        
        {/* Current card */}
        {currentItem && (
          <PanGestureHandler
            onGestureEvent={handleGesture}
            onHandlerStateChange={handleGestureStateChange}
          >
            {renderCard(currentItem)}
          </PanGestureHandler>
        )}
      </View>

      {/* Details panel */}
      {renderDetails()}
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
    paddingTop: 35,
    paddingBottom: 10,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
    flex: 1,
  },
  profilePicture: {
    width: 40,
    height: 40,
    borderRadius: 20,
    overflow: 'hidden',
  },
  profileImage: {
    width: '100%',
    height: '100%',
    borderRadius: 20,
  },
  tabContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  tab: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginRight: 20,
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#000',
  },
  tabText: {
    fontSize: 16,
    color: '#666',
  },
  activeTabText: {
    color: '#000',
    fontWeight: '500',
  },
  cardContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  card: {
    position: 'absolute',
    width: width - 40,
    // paddingLeft: 20,
    height: height * 0.7,
    borderRadius: 20,
    overflow: 'hidden',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
  },
  nextCard: {
    zIndex: -1,
  },
  imageContainer: {
    flex: 1,
    position: 'relative',
  },
  imageBackground: {
    flex: 1,
    backgroundColor: '#4A90E2',
    
    // You would replace this with an actual Image component
    // backgroundImage: url would go here in web, use Image component in RN
  },
  distanceBadge: {
    position: 'absolute',
    top: 20,
    right: 20,
    backgroundColor: 'rgba(0,0,0,0.6)',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
  },
  distanceText: {
    color: '#fff',
    fontSize: 12,
    marginLeft: 4,
  },
  cardContent: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
  },
  eventTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  eventName: {
    fontSize: 16,
    color: '#fff',
    opacity: 0.9,
    marginBottom: 12,
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timeText: {
    fontSize: 14,
    color: '#fff',
    marginRight: 12,
  },
  dateText: {
    fontSize: 14,
    color: '#fff',
    opacity: 0.8,
  },
  infoButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: 'rgba(0,0,0,0.3)',
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  detailsContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: height * 0.6,
  },
  detailsHandle: {
    width: 40,
    height: 4,
    backgroundColor: '#ddd',
    borderRadius: 2,
    alignSelf: 'center',
    marginTop: 10,
    marginBottom: 10,
  },
  detailsContent: {
    padding: 20,
  },
  locationInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  locationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FF6B6B',
    marginRight: 8,
  },
  locationText: {
    flex: 1,
    fontSize: 14,
    color: '#333',
  },
  jumpInButton: {
    backgroundColor: '#FF6B6B',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  jumpInText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
    marginRight: 4,
  },
  dateTimeInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  dateTimeText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 8,
  },
  aboutSection: {
    marginBottom: 20,
  },
  aboutTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 10,
  },
  aboutText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  visibilitySection: {
    marginBottom: 20,
  },
  visibilityTitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 10,
  },
  visibilityValue: {
    fontWeight: '600',
    color: '#333',
  },
  participantsInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  participantAvatars: {
    flexDirection: 'row',
    marginRight: 12,
  },
  avatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
    marginLeft: -8,
    borderWidth: 2,
    borderColor: '#fff',
  },
  participantCount: {
    fontSize: 14,
    color: '#666',
  },
  participantNumber: {
    fontWeight: '600',
    color: '#333',
  },
  remainingText: {
    fontSize: 12,
    color: '#FF6B6B',
    fontStyle: 'italic',
  },
  mapPlaceholder: {
    height: 120,
    backgroundColor: '#E8F4FD',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  mapText: {
    fontSize: 16,
    color: '#666',
  },
  mapPin: {
    position: 'absolute',
    top: 20,
    right: 30,
  },
  noMoreCards: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  noMoreText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#666',
    marginBottom: 20,
  },
  resetButton: {
    backgroundColor: '#4A90E2',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 25,
  },
  resetButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default HomeScreen;