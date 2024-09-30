import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Switch, Animated, ScrollView } from 'react-native';
import { ref as ref_d, onValue, update } from 'firebase/database';
import { database, auth } from '../../firebase';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const NotificationList = ({ isAdmin, isFormateur }) => {
  const [notifications, setNotifications] = useState([]);
  const [isSubscribed, setIsSubscribed] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  // const [id, setId] = useState('');
  const filterHeight = useState(new Animated.Value(0))[0];

  const navigation = useNavigation();

  useEffect(() => {
    const userId = auth.currentUser?.uid;
    console.log(userId);
    const notificationsRef = ref_d(database, '/notification-panel/');
    
    const unsubscribe = onValue(notificationsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const filteredNotifications = Object.entries(data)
          .filter(([_, notification]) => {
            console.log(notification);
            return notification.received && notification.received[userId];
          })
          .map(([id, notification]) => ({
            id,

            ...notification,
            // formationId: notification.body.match(/\d+/)?.[0] || null,
            formationId: notification.id,
          }))
          .sort((a, b) => b.timestamp - a.timestamp);
        setNotifications(filteredNotifications);
      }
    });

    // Set up the navigation options

    
    navigation.setOptions({
      headerShown: true,
      title: 'Mes notifications',
      headerStyle: {
        backgroundColor: '#1a53ff',
      },
      headerTintColor: '#fff',
      headerTitleStyle: {
        fontWeight: 'bold',
      },
      headerRight: () => (
        <TouchableOpacity onPress={()=>handleLogout()} style={styles.logoutButton}>
          <Text style={styles.logoutButtonText}>Se déconnecter</Text>
        </TouchableOpacity>
      ),
    });

    return () => unsubscribe();
  }, [navigation]);

  const handleLogout = async () => {
    try {
      await auth.signOut();
      await AsyncStorage.removeItem('userUid');
      navigation.navigate('Login');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };


  const handleNotificationPress = (item) => {
    console.log(item)
    if (item.data) {
      navigation.navigate('Formation', {formationId: item.data, role: { isAdmin, isFormateur }});
    // } else if (item.id) {
    //   navigation.navigate('Formation', {formationId: item.id, role: { isAdmin, isFormateur }});
    }

  };

  const toggleFilters = () => {
    setShowFilters(!showFilters);
    Animated.timing(filterHeight, {
      toValue: showFilters ? 0 : 300,
      duration: 300,
      useNativeDriver: false,
    }).start();
  };
  
  const toggleSubscription = () => {
    setIsSubscribed(!isSubscribed);
    // Here you would typically update the user's subscription status in the database
    // For example:
    // const userId = auth.currentUser?.uid;
    // update(ref_d(database, `users/${userId}`), { isSubscribed: !isSubscribed });
  };

  const renderNotification = ({ item }) => (
    <TouchableOpacity
      style={styles.notificationItem}
      onPress={() => handleNotificationPress(item)}
    >
      <Ionicons 
        name={!item.body.includes('inscription') ? 'school-outline' : 'clipboard-outline'} 
        size={24} 
        color="#007AFF" 
        style={styles.icon} 
      />
      <View style={styles.notificationContent}>
        <Text style={styles.notificationTitle}>{item.title}</Text>
        <Text style={styles.notificationBody}>{item.body}</Text>
        <View style={styles.timeContainer}>
          <Text style={styles.notificationTime}>
            {new Date(item.timestamp).toLocaleString()}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>

      {/* <TouchableOpacity style={styles.filterToggleButton } onPress={toggleFilters} >
        <Text style={styles.filterToggleButtonText}>Paramètres de notifications</Text>
        <Ionicons name={showFilters ? "chevron-up" : "chevron-down"} size={24} color="white" />
      </TouchableOpacity> */}

      <Animated.View style={[styles.filtersContainer, { height: filterHeight }]}>
 
        <ScrollView>
        <View style={styles.filterContainer}>
        <Text style={styles.filterText}>Recevoir des notifications</Text>
        <Switch
          value={isSubscribed}
          onValueChange={toggleSubscription}
          trackColor={{ false: "#767577", true: "#81b0ff" }}
          thumbColor={isSubscribed ? "#f5dd4b" : "#f4f3f4"}
        />
      </View>
          

        </ScrollView>
      </Animated.View>


      
      <FlatList
        data={notifications}
        renderItem={renderNotification}
        keyExtractor={(item) => item.id}
        style={styles.listContainer}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
  },
  filterContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  filterText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  listContainer: {
    flex: 1,
  },
  notificationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 16,
    marginTop: 28,
    marginHorizontal: 50,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  notificationContent: {
    flex: 1,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  notificationBody: {
    fontSize: 14,
    color: '#333',
    marginBottom: 8,
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  notificationTime: {
    fontSize: 12,
    color: '#888',
    marginLeft: 4,
  },
  icon: {
    marginRight: 16,
  },
  logoutButton: {
    marginRight: 10,
  },
  logoutButtonText: {
    color: '#fff',
    fontSize: 16,
  },


  filterToggleButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#1a53ff',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
    marginTop:10,
  },
  filterToggleButtonText: {
    color: 'white',
    fontSize: 16,
  },
  
  filterSection: {
    marginBottom: 15,
    paddingHorizontal: 10,
  },
  filterTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  filterButtonsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },

  filterButtonSelected: {
    backgroundColor: '#1a53ff',
  },

  filterButtonTextSelected: {
    color: 'white',
  },
});

export default NotificationList;