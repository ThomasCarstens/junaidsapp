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
} from 'react-native';

const { width } = Dimensions.get('window');

const EventScreen = ({ navigation, route }) => {
  const { event } = route.params;
  const [isJoined, setIsJoined] = useState(event.status === 'Accepted');

  const handleJoinEvent = () => {
    setIsJoined(!isJoined);
  };

  const handleGoBack = () => {
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header Image */}
        <View style={styles.headerContainer}>
          <Image 
            source={{ uri: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400&h=300&fit=crop' }}
            style={styles.headerImage}
          />
          <View style={styles.headerOverlay}>
            <TouchableOpacity style={styles.backButton} onPress={handleGoBack}>
              <Text style={styles.backButtonText}>←</Text>
            </TouchableOpacity>
            <View style={styles.eventBadge}>
              <Text style={styles.eventBadgeText}>OPEN EVENT</Text>
            </View>
          </View>
          <View style={styles.headerContent}>
            <Text style={styles.eventTitle}>{event.title}</Text>
          </View>
        </View>

        {/* Event Details */}
        <View style={styles.detailsContainer}>
          {/* Date and Time */}
          <View style={styles.detailRow}>
            <Text style={styles.detailIcon}>📅</Text>
            <View style={styles.detailContent}>
              <Text style={styles.detailLabel}>Date & Time</Text>
              <Text style={styles.detailValue}>{event.time}</Text>
            </View>
          </View>

          {/* Location */}
          <View style={styles.detailRow}>
            <Text style={styles.detailIcon}>📍</Text>
            <View style={styles.detailContent}>
              <Text style={styles.detailLabel}>Location</Text>
              <Text style={styles.detailValue}>{event.location}</Text>
            </View>
          </View>

          {/* About Event */}
          <View style={styles.aboutSection}>
            <Text style={styles.sectionTitle}>About event</Text>
            <Text style={styles.aboutText}>
              Join us for an exciting {event.title.toLowerCase()} experience! This event is perfect for both beginners and experienced participants. 
              {'\n\n'}
              We'll provide all necessary equipment and refreshments. Come ready to have fun and meet new people who share your interests!
              {'\n\n'}
              Don't miss this opportunity to enjoy a great time with fellow enthusiasts. The event is open to all skill levels, so everyone is welcome to participate.
            </Text>
          </View>

          {/* Visibility */}
          <View style={styles.detailRow}>
            <Text style={styles.detailIcon}>👥</Text>
            <View style={styles.detailContent}>
              <Text style={styles.detailLabel}>Visibility</Text>
              <Text style={styles.detailValue}>Open to all</Text>
            </View>
          </View>

          {/* Participants */}
          <View style={styles.participantsSection}>
            <View style={styles.participantHeader}>
              <Text style={styles.participantCount}>
                {event.joined ? `${event.joined} joined` : '1 joined'}
              </Text>
              <TouchableOpacity>
                <Text style={styles.seeAllText}>See all</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.participantsList}>
              <Image 
                source={{ uri: event.image }} 
                style={styles.participantImage} 
              />
              {event.joined && (
                <>
                  <View style={styles.participantPlaceholder} />
                  <View style={styles.participantPlaceholder} />
                  <View style={styles.participantPlaceholder} />
                </>
              )}
            </View>
          </View>

          {/* Host Information */}
          <View style={styles.hostSection}>
            <Text style={styles.sectionTitle}>Hosted by</Text>
            <View style={styles.hostInfo}>
              <Image source={{ uri: event.image }} style={styles.hostImage} />
              <View style={styles.hostDetails}>
                <Text style={styles.hostName}>{event.host}</Text>
                <Text style={styles.hostRole}>{event.hostRole || 'Event Host'}</Text>
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

          {/* Location Map Placeholder */}
          <View style={styles.mapSection}>
            <Text style={styles.sectionTitle}>Location</Text>
            <View style={styles.mapPlaceholder}>
              <Text style={styles.mapText}>Map View</Text>
              <Text style={styles.mapSubtext}>{event.location}</Text>
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
            {isJoined ? 'Joined ✓' : 'Join Event'}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollView: {
    flex: 1,
  },
  headerContainer: {
    position: 'relative',
    height: 300,
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
    height: '100%',
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'space-between',
    padding: 20,
    paddingTop: 50,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'flex-start',
  },
  backButtonText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
  },
  eventBadge: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
    alignSelf: 'flex-end',
    position: 'absolute',
    top: 50,
    right: 20,
  },
  eventBadgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  headerContent: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
  },
  eventTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  detailsContainer: {
    padding: 20,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  detailIcon: {
    fontSize: 20,
    marginRight: 15,
    width: 25,
  },
  detailContent: {
    flex: 1,
  },
  detailLabel: {
    fontSize: 12,
    color: '#999999',
    marginBottom: 2,
  },
  detailValue: {
    fontSize: 16,
    color: '#000000',
    fontWeight: '500',
  },
  aboutSection: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 10,
  },
  aboutText: {
    fontSize: 14,
    color: '#666666',
    lineHeight: 20,
  },
  participantsSection: {
    marginBottom: 25,
  },
  participantHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  participantCount: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
  },
  seeAllText: {
    fontSize: 14,
    color: '#007AFF',
  },
  participantsList: {
    flexDirection: 'row',
  },
  participantImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  participantPlaceholder: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#E0E0E0',
    marginRight: 10,
  },
  hostSection: {
    marginBottom: 25,
  },
  hostInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  hostImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 15,
  },
  hostDetails: {
    flex: 1,
  },
  hostName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 2,
  },
  hostRole: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 8,
  },
  hostStats: {
    flexDirection: 'row',
  },
  statItem: {
    alignItems: 'center',
    marginRight: 20,
  },
  statNumber: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000000',
  },
  statLabel: {
    fontSize: 12,
    color: '#666666',
  },
  mapSection: {
    marginBottom: 20,
  },
  mapPlaceholder: {
    height: 150,
    backgroundColor: '#F5F5F5',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mapText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666666',
    marginBottom: 5,
  },
  mapSubtext: {
    fontSize: 12,
    color: '#999999',
  },
  bottomContainer: {
    padding: 20,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  joinButton: {
    backgroundColor: '#FF6B6B',
    paddingVertical: 15,
    borderRadius: 25,
    alignItems: 'center',
  },
  joinedButton: {
    backgroundColor: '#4CAF50',
  },
  joinButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  joinedButtonText: {
    color: '#FFFFFF',
  },
});

export default EventScreen;