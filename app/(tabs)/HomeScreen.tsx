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

// Sample data - replace with your actual data
const sampleEvents = [
  {
    id: 1,
    title: 'Midnight Forest Walk',
    name: 'Aliana, 21',
    time: '11:30 PM',
    date: 'Tonight',
    distance: '200m away',
    image: 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=400&h=600&fit=crop',
    details: {
      location: 'Muir Woods, California',
      fullDate: 'May 25th, 11:30 PM',
      description: 'Experience the forest in its most mysterious state. We\'ll walk the moonlit trails, listen to nocturnal sounds, and connect with nature\'s darker side. Bring a flashlight, wear sturdy shoes, and prepare for an enchanting journey through shadows and whispers.',
      visibility: 'Open to all',
      participants: 8,
      remaining: 'Only 3 spots remaining'
    }
  },
  {
    id: 2,
    title: 'Storm Watching Gathering',
    name: 'Marcus, 28',
    time: '6:00 PM',
    date: 'Tomorrow',
    distance: '450m away',
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=600&fit=crop',
    details: {
      location: 'Point Reyes Lighthouse',
      fullDate: 'May 26th, 6:00 PM',
      description: 'Watch nature\'s raw power as storm clouds gather over the Pacific. We\'ll observe lightning, feel the wind, and experience the ocean\'s fury from a safe vantage point. Bring rain gear and prepare to be humbled by nature\'s intensity.',
      visibility: 'Open to all',
      participants: 12,
      remaining: '6 spots available'
    }
  },
  {
    id: 3,
    title: 'Cave Exploration',
    name: 'Luna, 26',
    time: '2:00 PM',
    date: 'May 27th',
    distance: '800m away',
    image: 'https://images.unsplash.com/photo-1551632436-cbf8dd35adfa?w=400&h=600&fit=crop',
    details: {
      location: 'Sea Lion Caves, Oregon Coast',
      fullDate: 'May 27th, 2:00 PM',
      description: 'Descend into the earth\'s hidden chambers. Explore limestone formations, underground pools, and discover what lies beneath the surface. Headlamps provided. Not for the claustrophobic.',
      visibility: 'Open to all',
      participants: 10,
      remaining: '4 spots left'
    }
  },
  {
    id: 4,
    title: 'Abandoned Ruins Hike',
    name: 'Raven, 24',
    time: '4:30 PM',
    date: 'May 28th',
    distance: '1.2km away',
    image: 'https://images.unsplash.com/photo-1520637836862-4d197d17c13a?w=400&h=600&fit=crop',
    details: {
      location: 'Sutro Baths Ruins, San Francisco',
      fullDate: 'May 28th, 4:30 PM',
      description: 'Explore the haunting remains of once-grand structures now claimed by nature. Walk among crumbling walls covered in fog and mystery. Perfect for photographers and urban explorers seeking atmospheric locations.',
      visibility: 'Open to all',
      participants: 15,
      remaining: 'Plenty of space available'
    }
  },
  {
    id: 5,
    title: 'Moonless Night Stargazing',
    name: 'Orion, 30',
    time: '10:00 PM',
    date: 'May 29th',
    distance: '350m away',
    image: 'https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=400&h=600&fit=crop',
    details: {
      location: 'Mount Tamalpais State Park',
      fullDate: 'May 29th, 10:00 PM',
      description: 'On the darkest night of the month, witness the cosmos in all its glory. Far from city lights, we\'ll observe deep space objects, meteor showers, and contemplate our place in the universe. Telescopes provided.',
      visibility: 'Open to all',
      participants: 20,
      remaining: '12 spots remaining'
    }
  },
  {
    id: 6,
    title: 'Foggy Mountain Summit',
    name: 'Sage, 27',
    time: '5:00 AM',
    date: 'May 30th',
    distance: '600m away',
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=600&fit=crop',
    details: {
      location: 'Mount Diablo, California',
      fullDate: 'May 30th, 5:00 AM',
      description: 'Rise before dawn to witness the world emerging from fog. Experience the ethereal beauty of mountains shrouded in mist, where reality meets dream. The early start rewards us with otherworldly views and absolute solitude.',
      visibility: 'Experienced hikers only',
      participants: 6,
      remaining: '2 spots left'
    }
  },
  {
    id: 7,
    title: 'Tidal Pool Mysteries',
    name: 'Marina, 25',
    time: '12:00 AM',
    date: 'May 31st',
    distance: '250m away',
    image: 'https://images.unsplash.com/photo-1439066615861-d1af74d74000?w=400&h=600&fit=crop',
    details: {
      location: 'Pescadero State Beach',
      fullDate: 'May 31st, 12:00 AM',
      description: 'Explore the alien world of tidal pools under the cover of darkness. Discover nocturnal sea creatures, bioluminescent plankton, and the ocean\'s hidden nightlife. Bring red-filtered flashlights to preserve night vision.',
      visibility: 'Open to all',
      participants: 14,
      remaining: '9 spots available'
    }
  },
  {
    id: 8,
    title: 'Haunted Forest Photography',
    name: 'Shadow, 29',
    time: '7:00 PM',
    date: 'June 1st',
    distance: '900m away',
    image: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=600&fit=crop',
    details: {
      location: 'Redwood Regional Park',
      fullDate: 'June 1st, 7:00 PM',
      description: 'Capture the gothic beauty of ancient redwoods in fading light. Learn techniques for photographing in low light conditions while surrounded by trees that have witnessed centuries pass. Perfect for those seeking to master atmospheric photography.',
      visibility: 'Photography enthusiasts',
      participants: 8,
      remaining: '3 spots remaining'
    }
  },
  {
    id: 9,
    title: 'Underground River Exploration',
    name: 'River, 31',
    time: '1:00 PM',
    date: 'June 2nd',
    distance: '1.5km away',
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=600&fit=crop',
    details: {
      location: 'Hidden Valley, Big Sur',
      fullDate: 'June 2nd, 1:00 PM',
      description: 'Follow ancient waterways that flow beneath the earth\'s surface. Wade through crystal-clear underground streams surrounded by moss-covered rocks and filtered sunlight. An adventure for those who seek the path less traveled.',
      visibility: 'Open to all',
      participants: 10,
      remaining: '5 spots left'
    }
  },
  {
    id: 10,
    title: 'Witch\'s Circle Gathering',
    name: 'Willow, 33',
    time: '8:00 PM',
    date: 'June 3rd',
    distance: '400m away',
    image: 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=400&h=600&fit=crop',
    details: {
      location: 'Ring Mountain Open Space Preserve',
      fullDate: 'June 3rd, 8:00 PM',
      description: 'Gather in a natural stone circle formed by ancient geological forces. Share stories, practice meditation, and connect with the mystical energy of this sacred space. All spiritual backgrounds welcome in this place of natural power.',
      visibility: 'Open minded individuals',
      participants: 12,
      remaining: '7 spots available'
    }
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

  const currentEvent = sampleEvents[currentIndex];
  const navigation = useNavigation();

  useEffect(() => {
    navigation.setOptions({
        headerShown: false,
        title: 'Home',
        headerStyle: {
          backgroundColor: '#1a53ff',
          marginTop: StatusBar.currentHeight ? StatusBar.currentHeight+3 : 0,
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
        headerRight: () => (
          <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
            <Text style={styles.logoutButtonText}>Log out</Text>
          </TouchableOpacity>
        ),
      });
  }, [navigation]);

  const handleProfilePress = () => {
    navigation.navigate('Profile'); // Navigate to your profile screen
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
      outputRange: ['-120deg', '0deg', '120deg'],
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

  const renderCard = (event, isNext = false) => {
    if (!event) return null;

    return (
      <Animated.View
        style={[
          styles.card,
          isNext ? getNextCardStyle() : getCardStyle(),
          isNext && styles.nextCard
        ]}
      >
        <View style={styles.imageContainer}>
          {/* <View style={styles.imageBackground} /> */}
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

  const detailsPan = useRef(new Animated.Value(0)).current;
  
  const handleDetailsGesture = Animated.event(
    [{ nativeEvent: { translationY: detailsPan } }],
    { useNativeDriver: false }
  );

  const handleDetailsGestureStateChange = (event) => {
    if (event.nativeEvent.oldState === 4) { // ACTIVE state ended
      const { translationY, velocityY } = event.nativeEvent;
      
      // If swiped down significantly or with high velocity, dismiss
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
        // Snap back to original position
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
    if (!showDetails || !currentEvent) return null;

    return (
      <PanGestureHandler
        onGestureEvent={handleDetailsGesture}
        onHandlerStateChange={handleDetailsGestureStateChange}
      >
        <Animated.View style={[styles.detailsContainer, getDetailsStyle()]}>
          <View style={styles.detailsHandle} />
          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={styles.detailsContent}>
          <View style={styles.locationInfo}>
            <View style={styles.locationDot} />
            <Text style={styles.locationText}>{currentEvent.details.location}</Text>
            <TouchableOpacity style={styles.jumpInButton}>
              <Text style={styles.jumpInText}>Jump in</Text>
              <Ionicons name="arrow-forward" size={16} color="#fff" />
            </TouchableOpacity>
          </View>
          
          <View style={styles.dateTimeInfo}>
            <Ionicons name="time-outline" size={16} color="#666" />
            <Text style={styles.dateTimeText}>{currentEvent.details.fullDate}</Text>
          </View>

          <View style={styles.aboutSection}>
            <Text style={styles.aboutTitle}>About event</Text>
            <Text style={styles.aboutText}>{currentEvent.details.description}</Text>
          </View>

          <View style={styles.visibilitySection}>
            <Text style={styles.visibilityTitle}>
              Visibility: <Text style={styles.visibilityValue}>{currentEvent.details.visibility}</Text>
            </Text>
            <View style={styles.participantsInfo}>
              <View style={styles.participantAvatars}>
                <View style={[styles.avatar, { backgroundColor: '#FF6B6B' }]} />
                <View style={[styles.avatar, { backgroundColor: '#4ECDC4' }]} />
                <View style={[styles.avatar, { backgroundColor: '#45B7D1' }]} />
              </View>
              <Text style={styles.participantCount}>
                <Text style={styles.participantNumber}>{currentEvent.details.participants}</Text> joined
              </Text>
            </View>
            <Text style={styles.remainingText}>{currentEvent.details.remaining}</Text>
          </View>

          <View style={styles.mapPlaceholder}>
            <Text style={styles.mapText}>Map View</Text>
            <View style={styles.mapPin}>
              <Ionicons name="location" size={20} color="#FF6B6B" />
            </View>
          </View>
            </View>
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
    if (event.nativeEvent.oldState === 4) { // ACTIVE state ended
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

  if (currentIndex >= sampleEvents.length) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.noMoreCards}>
          <Text style={styles.noMoreText}>No more events!</Text>
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
              source={{ uri: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=600&fit=crop' }} // Replace with your actual profile image URL
              style={styles.profileImage}
            />
          </TouchableOpacity>
        </View>
        
        <View style={styles.tabContainer}>
          {['All', 'People', 'Events', 'The Backpack'].map((tab) => (
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
        </View>
      </View>

      {/* Cards */}
      <View style={styles.cardContainer}>
        {/* Next card (behind) */}
        {sampleEvents[currentIndex + 1] && renderCard(sampleEvents[currentIndex + 1], true)}
        
        {/* Current card */}
        {currentEvent && (
          <PanGestureHandler
            onGestureEvent={handleGesture}
            onHandlerStateChange={handleGestureStateChange}
          >
            {renderCard(currentEvent)}
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
    paddingTop: 25,
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