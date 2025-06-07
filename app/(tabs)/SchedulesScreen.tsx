import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  SafeAreaView,
  StatusBar,
} from 'react-native';

const SchedulesScreen = ({ navigation }) => {
  const upcomingEvents = [
    {
      id: 1,
      title: 'Golf with Jay',
      location: 'National Golf Court (5km away)',
      time: 'Today, 5:43 PM',
      host: 'Jay Prichette',
      hostRole: 'Golf Professional',
      image: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=100&h=100&fit=crop&crop=face',
      status: 'Accepted',
      messageAction: 'Message Jay!',
      backgroundColor: '#FFE8E8',
    },
    {
      id: 2,
      title: 'Magicians meet',
      location: '39 LA Street (8km away)',
      time: '9 Jan, 6:00 PM',
      host: 'Phil',
      hostRole: 'Magician',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
      joined: 35,
      additionalText: 'Sara, +35 others are coming',
      backgroundColor: '#FFF0E8',
    },
  ];

  const navigateToEvent = (event) => {
    navigation.navigate('Event', { event });
  };

  const renderEventCard = (event) => (
    <TouchableOpacity
      key={event.id}
      style={[styles.eventCard, { backgroundColor: event.backgroundColor }]}
      onPress={() => navigateToEvent(event)}
      activeOpacity={0.7}
    >
      <View style={styles.eventContent}>
        <Image source={{ uri: event.image }} style={styles.hostImage} />
        <View style={styles.eventDetails}>
          <Text style={styles.eventTitle}>{event.title}</Text>
          <View style={styles.locationRow}>
            <Text style={styles.locationIcon}>📍</Text>
            <Text style={styles.locationText}>{event.location}</Text>
          </View>
          <View style={styles.timeRow}>
            <Text style={styles.timeIcon}>🕐</Text>
            <Text style={styles.timeText}>{event.time}</Text>
          </View>
          
          <Text style={styles.hostInfo}>
            Hosted by{'\n'}
            <Text style={styles.hostName}>{event.host}</Text>
          </Text>

          {event.status && (
            <View style={styles.statusContainer}>
              <View style={styles.statusBadge}>
                <Text style={styles.statusText}>{event.status}</Text>
              </View>
              {event.joined && (
                <View style={styles.joinedContainer}>
                  <View style={styles.avatarGroup}>
                    <View style={styles.avatar} />
                    <View style={styles.avatar} />
                    <View style={styles.avatar} />
                  </View>
                  <Text style={styles.joinedText}>{event.joined} joined</Text>
                </View>
              )}
            </View>
          )}

          {event.messageAction && (
            <TouchableOpacity style={styles.messageButton}>
              <Text style={styles.messageButtonText}>{event.messageAction}</Text>
            </TouchableOpacity>
          )}

          {event.additionalText && (
            <Text style={styles.additionalText}>{event.additionalText}</Text>
          )}
        </View>
      </View>
      <View style={styles.arrowContainer}>
        <Text style={styles.arrow}>↗</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Schedules</Text>
        <TouchableOpacity style={styles.searchButton}>
          <Text style={styles.searchIcon}>🔍</Text>
        </TouchableOpacity>
      </View>

      {/* Schedule New Event Button */}
      <TouchableOpacity style={styles.scheduleButton} onPress={() => navigation.navigate('ScheduleEvent')}>
        <Text style={styles.scheduleButtonIcon}>+</Text>
        <Text style={styles.scheduleButtonText}>Schedule new event</Text>
      </TouchableOpacity>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Upcoming Section */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Upcoming</Text>
          <View style={styles.calendarIcon}>
            <Text style={styles.calendarText}>📅</Text>
          </View>
        </View>

        {/* Event Cards */}
        <View style={styles.eventsContainer}>
          {upcomingEvents.map(renderEventCard)}
        </View>
      </ScrollView>

    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#FFFFFF',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#000000',
  },
  searchButton: {
    padding: 8,
  },
  searchIcon: {
    fontSize: 20,
  },
  scheduleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FF6B6B',
    marginHorizontal: 20,
    marginVertical: 10,
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 25,
    justifyContent: 'center',
  },
  scheduleButtonIcon: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
    marginRight: 8,
  },
  scheduleButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#666666',
  },
  calendarIcon: {
    padding: 5,
  },
  calendarText: {
    fontSize: 16,
  },
  eventsContainer: {
    marginBottom: 100,
  },
  eventCard: {
    borderRadius: 20,
    padding: 20,
    marginBottom: 15,
    position: 'relative',
  },
  eventContent: {
    flexDirection: 'row',
  },
  hostImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15,
  },
  eventDetails: {
    flex: 1,
  },
  eventTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 8,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  locationIcon: {
    fontSize: 12,
    marginRight: 5,
  },
  locationText: {
    fontSize: 14,
    color: '#666666',
  },
  timeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  timeIcon: {
    fontSize: 12,
    marginRight: 5,
  },
  timeText: {
    fontSize: 14,
    color: '#666666',
  },
  hostInfo: {
    fontSize: 12,
    color: '#999999',
    marginBottom: 10,
  },
  hostName: {
    fontWeight: 'bold',
    color: '#000000',
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  statusBadge: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 10,
  },
  statusText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  joinedContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarGroup: {
    flexDirection: 'row',
    marginRight: 8,
  },
  avatar: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#DDD',
    marginLeft: -5,
    borderWidth: 1,
    borderColor: '#FFF',
  },
  joinedText: {
    fontSize: 12,
    color: '#666666',
  },
  messageButton: {
    backgroundColor: '#FF9999',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
    alignSelf: 'flex-start',
  },
  messageButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  additionalText: {
    fontSize: 12,
    color: '#666666',
    marginTop: 8,
  },
  arrowContainer: {
    position: 'absolute',
    top: 20,
    right: 20,
  },
  arrow: {
    fontSize: 20,
    color: '#000000',
    fontWeight: 'bold',
  },
  bottomTabBar: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
  },
  tabIcon: {
    fontSize: 20,
    opacity: 0.6,
  },
});

export default SchedulesScreen;