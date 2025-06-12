import React, { useEffect } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const { width, height } = Dimensions.get('window');

const ProfileScreen = () => {
  const navigation = useNavigation();
  
  const handleBackPress = () => {
    navigation.goBack();
  };
  useEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);

  const handleEditProfile = () => {
    // Navigate to edit profile screen
    navigation.navigate('EditProfile');
  };

  const profileData = {
    name: 'Aliana',
    age: 21,
    profileImage: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=600&fit=crop',
    stats: {
      activity: 8,
      eventCount: 2,
      rating: 4.8
    },
    aboutMe: "Fun-loving and always up for an adventure, coffee, concerts, and spontaneous road trips.",
    gender: "Woman",
    hometown: "Bay area",
    relationshipStatus: "Single (Open to date)",
    occupation: "Tech assistant",
    hobbiesAndInterests: {
      friends: ["One Piece"],
      activities: ["Mocktail", "Coffee", "Eminem", "Indie music", "Beach trip"],
      interests: ["Tech", "Football", "Golf"]
    }
  };

  const renderInterestTag = (interest, bgColor = '#E8F4FD') => (
    <View key={interest} style={[styles.interestTag, { backgroundColor: bgColor }]}>
      <Text style={styles.interestText}>{interest}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBackPress} style={styles.backButton}>
          <Ionicons name="chevron-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{profileData.name}, {profileData.age}</Text>
        <TouchableOpacity onPress={handleEditProfile} style={styles.editButton}>
          <Ionicons name="create-outline" size={24} color="#000" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Profile Image */}
        <View style={styles.imageContainer}>
          <Image 
            source={{ uri: profileData.profileImage }}
            style={styles.profileImage}
          />
        </View>

        {/* Stats Section */}
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <View style={styles.statIcon}>
              <Ionicons name="flash" size={20} color="#FFD700" />
            </View>
            <Text style={styles.statNumber}>{profileData.stats.activity}</Text>
            <Text style={styles.statLabel}>Activity</Text>
          </View>
          
          <View style={styles.statItem}>
            <View style={styles.statIcon}>
              <Ionicons name="eye" size={20} color="#666" />
            </View>
            <Text style={styles.statNumber}>{profileData.stats.eventCount}</Text>
            <Text style={styles.statLabel}>Events Hosted</Text>
          </View>
          
          <View style={styles.statItem}>
            <View style={styles.statIcon}>
              <Ionicons name="star" size={20} color="#FFD700" />
            </View>
            <Text style={styles.statNumber}>{profileData.stats.rating}</Text>
            <Text style={styles.statLabel}>Rating</Text>
          </View>
        </View>

        {/* Profile Details */}
        <View style={styles.detailsContainer}>
          {/* About Me */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>About me</Text>
            <Text style={styles.aboutText}>{profileData.aboutMe}</Text>
          </View>

          {/* Gender */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Gender</Text>
            <View style={styles.infoRow}>
              <Ionicons name="person" size={16} color="#FF69B4" />
              <Text style={styles.infoText}>{profileData.gender}</Text>
            </View>
          </View>

          {/* Hometown */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Hometown</Text>
            <View style={styles.infoRow}>
              <Ionicons name="location" size={16} color="#FF6B6B" />
              <Text style={styles.infoText}>{profileData.hometown}</Text>
            </View>
          </View>

          {/* Relationship Status */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Relationship status</Text>
            <View style={styles.infoRow}>
              <Ionicons name="heart" size={16} color="#4ECDC4" />
              <Text style={styles.infoText}>{profileData.relationshipStatus}</Text>
            </View>
          </View>

          {/* Occupation */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Occupation</Text>
            <View style={styles.infoRow}>
              <Ionicons name="briefcase" size={16} color="#4A90E2" />
              <Text style={styles.infoText}>{profileData.occupation}</Text>
            </View>
          </View>

          {/* Hobbies & Interests */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Hobbies & Interests</Text>
            
            {/* FRIENDS */}
            <View style={styles.subsection}>
              <View style={styles.subsectionHeader}>
                <Ionicons name="people" size={16} color="#666" />
                <Text style={styles.subsectionTitle}>F R I E N D S</Text>
              </View>
              <View style={styles.tagsContainer}>
                {profileData.hobbiesAndInterests.friends.map(friend => 
                  renderInterestTag(friend, '#FFF0E6')
                )}
              </View>
            </View>

            {/* Activities */}
            <View style={styles.tagsContainer}>
              {profileData.hobbiesAndInterests.activities.map(activity => 
                renderInterestTag(activity)
              )}
            </View>

            {/* Other Interests */}
            <View style={styles.tagsContainer}>
              {profileData.hobbiesAndInterests.interests.map(interest => 
                renderInterestTag(interest, '#F0F8FF')
              )}
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
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  backButton: {
    padding: 5,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
  },
  editButton: {
    padding: 5,
  },
  scrollView: {
    flex: 1,
  },
  imageContainer: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  profileImage: {
    width: width * 0.6,
    height: width * 0.8,
    borderRadius: 20,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 20,
    paddingHorizontal: 40,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  statItem: {
    alignItems: 'center',
  },
  statIcon: {
    marginBottom: 8,
  },
  statNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
  },
  detailsContainer: {
    padding: 20,
  },
  section: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    marginBottom: 10,
  },
  aboutText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 8,
  },
  subsection: {
    marginBottom: 15,
  },
  subsectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  subsectionTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#666',
    letterSpacing: 1,
    marginLeft: 8,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 15,
  },
  interestTag: {
    backgroundColor: '#E8F4FD',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
    marginRight: 8,
    marginBottom: 8,
  },
  interestText: {
    fontSize: 12,
    color: '#333',
    fontWeight: '500',
  },
});

export default ProfileScreen;