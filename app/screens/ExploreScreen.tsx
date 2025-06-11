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
  TextInput
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const { width, height } = Dimensions.get('window');

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
];

const ExploreScreen = () => {
  const [searchText, setSearchText] = useState('');
  const [filteredEvents, setFilteredEvents] = useState(sampleEvents);
  const navigation = useNavigation();

  useEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);

  useEffect(() => {
    if (searchText.trim() === '') {
      setFilteredEvents(sampleEvents);
    } else {
      const filtered = sampleEvents.filter(event =>
        event.title.toLowerCase().includes(searchText.toLowerCase()) ||
        event.category.toLowerCase().includes(searchText.toLowerCase())
      );
      setFilteredEvents(filtered);
    }
  }, [searchText]);

  const handleEventPress = (event) => {
    navigation.navigate('Event', { event });
  };

  const renderEventCard = (event, index) => {
    const isLeftColumn = index % 2 === 0;
    const cardHeight = index % 4 === 0 || index % 4 === 3 ? 200 : 160;
    
    return (
      <TouchableOpacity
        key={event.id}
        style={[
          styles.eventCard,
          { height: cardHeight },
          isLeftColumn ? styles.leftCard : styles.rightCard
        ]}
        onPress={() => handleEventPress(event)}
      >
        <ImageBackground
          source={{ uri: event.image }}
          style={styles.cardBackground}
          imageStyle={styles.cardImage}
        >
          <View style={styles.cardOverlay}>
            <View style={styles.joinedBadge}>
              <Ionicons name="people" size={12} color="#fff" />
              <Text style={styles.joinedText}>{event.joined} Joined</Text>
            </View>
            
            <View style={styles.cardContent}>
              <Text style={styles.eventTitle}>{event.title}</Text>
              <Text style={styles.eventTime}>{event.time}</Text>
            </View>
          </View>
        </ImageBackground>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Explore</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#999" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search events..."
          placeholderTextColor="#999"
          value={searchText}
          onChangeText={setSearchText}
        />
      </View>

      <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        {/* Events Grid */}
        <View style={styles.eventsGrid}>
          <View style={styles.leftColumn}>
            {filteredEvents.filter((_, index) => index % 2 === 0).map((event, index) =>
              renderEventCard(event, index * 2)
            )}
          </View>
          <View style={styles.rightColumn}>
            {filteredEvents.filter((_, index) => index % 2 === 1).map((event, index) =>
              renderEventCard(event, index * 2 + 1)
            )}
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
  eventsGrid: {
    flexDirection: 'row',
    paddingHorizontal: 10,
    paddingBottom: 20,
  },
  leftColumn: {
    flex: 1,
    paddingRight: 5,
  },
  rightColumn: {
    flex: 1,
    paddingLeft: 5,
  },
  eventCard: {
    borderRadius: 15,
    overflow: 'hidden',
    marginBottom: 12,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
  },
  leftCard: {},
  rightCard: {},
  cardBackground: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  cardImage: {
    borderRadius: 15,
  },
  cardOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    padding: 15,
    justifyContent: 'space-between',
  },
  joinedBadge: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(0,0,0,0.4)',
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
  cardContent: {
    alignSelf: 'flex-start',
  },
  eventTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  eventTime: {
    fontSize: 12,
    color: '#fff',
    opacity: 0.9,
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
});

export default ExploreScreen;