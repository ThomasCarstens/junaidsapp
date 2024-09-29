import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList, Image, Animated, Linking } from 'react-native';
import { database, auth } from '../../firebase';
import { Ionicons } from '@expo/vector-icons';
import * as Notifications from 'expo-notifications';

const OrganizationsPartenairesScreen = ({navigation}) => {
  const [showFilters, setShowFilters] = useState(false);
  const filterHeight = useState(new Animated.Value(0))[0];
  const [notificationStatus, setNotificationStatus] = useState('Vérification...');
  const organizations = [
    { id: '1', name: 'SOFMMOOM', image: require('../../assets/images/partenaires/sofMOMMO.png'), description: 'Société Française de Médecine Manuelle Orthopédique et Ostéopathique Médicale' },
    { id: '2', name: 'SMMOF', image: require('../../assets/images/partenaires/SMMOF.png'), description: 'Société de Médecine Manuelle - Orthopédique de France' },
    { id: '3', name: 'ISTM', image: require('../../assets/images/partenaires/ISTM.png'), description: 'Institut Supérieur de Thérapie Manuelle' },
    { id: '4', name: 'GEMMLR', image: require('../../assets/images/partenaires/GEMMLR.png'), description: 'Groupe \'Études et de Médecine Manuelle Médecine Légale et Réparation' },
    { id: '5', name: 'AMOPY', description: 'Association de Médecine Ostéopathique et de Posturologie Yvelines' },
    { id: '6', name: 'CEMMOM', description: 'Collège Européen de Médecine Manuelle et Ostéopathie Médicale' },
  ];
  useEffect(() => {

  navigation.setOptions({
    headerShown: true,
    title: 'Partenaires',
    headerStyle: {
      backgroundColor: '#1a53ff',
    },
    headerTintColor: '#fff',
    headerTitleStyle: {
      fontWeight: 'bold',
    },
    // headerRight: () => (
    //   <TouchableOpacity onPress={()=>handleLogout()} style={styles.logoutButton}>
    //     <Text style={styles.logoutButtonText}>Se déconnecter</Text>
    //   </TouchableOpacity>
    // ),
  });

  // return () => unsubscribe();
  checkNotificationStatus();
}, [navigation]);

  const checkNotificationStatus = async () => {
    const { status } = await Notifications.getPermissionsAsync();
    setNotificationStatus(status === 'granted' ? 'Activées' : 'Désactivées');
  };
    
  
  const OrganizationItem = ({ name, description, image }) => (
    
    <View style={styles.orgItem}>
      {image ? (
        <Image source={ image } style={styles.orgLogo} />
      ) : (
        <View style={styles.orgLogo}>
          <Text style={styles.orgLogoText}>{name[0]}</Text>
        </View>
      )}
      <View style={styles.orgInfo}>
        <Text style={styles.orgName}>{name}</Text>
        <Text style={styles.orgDescription} numberOfLines={2}>{description}</Text>
        <TouchableOpacity style={styles.visitButton}>
          <Text style={styles.visitButtonText}>Visiter</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
  const toggleFilters = () => {
    setShowFilters(!showFilters);
    Animated.timing(filterHeight, {
      toValue: showFilters ? 0 : 300,
      duration: 300,
      useNativeDriver: false,
    }).start();
  };

  const openSupportWebsite = () => {
    Linking.openURL('https://esculapplsupportpage.vercel.app');
  };
  const navigateToNotificationExplanation = () => {
    navigation.navigate('NotificationExplanation', { status: notificationStatus });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.contextText}>Cette application est conçue pour soutenir le déroulement des formations au sein des organisations partenaires.</Text>
      {auth.currentUser && (
        <View>
          <TouchableOpacity style={styles.filterToggleButton} onPress={toggleFilters}>
            <Text style={styles.filterToggleButtonText}>Gérer mes paramètres Esculappl</Text>
            <Ionicons name={showFilters ? "chevron-up" : "chevron-down"} size={24} color="white" />
          </TouchableOpacity>

          <Animated.View style={[styles.filtersContainer, { height: filterHeight }]}>
            <TouchableOpacity style={styles.filterContainer} onPress={openSupportWebsite}>
              <Text style={styles.filterText}>Gérer mon compte et contacter Esculappl</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.filterContainer} onPress={navigateToNotificationExplanation}>
              <Text style={styles.filterText}>Notifications Push: {notificationStatus}</Text>
            </TouchableOpacity>
          </Animated.View>
        </View>
      )}
    
      <Text style={styles.title}> Liens des organisations partenaires</Text>
      <FlatList
        data={organizations}
        renderItem={({ item }) => (
          <OrganizationItem 
            name={item.name} 
            description={item.description} 
            image={item.image}
          />
        )}
        keyExtractor={item => item.id}
      />
    </View>
  );
};

const styles = StyleSheet.create({

  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f0f0f0',
  },
  contextText: {
    fontSize: 16,
    fontStyle: 'italic',
    color: '#666',
    marginBottom: 16,
    textAlign: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  orgItem: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
  },
  orgLogo: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#e0e0e0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  orgLogoText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  orgInfo: {
    flex: 1,
  },
  orgName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  orgDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  visitButton: {
    backgroundColor: '#4a90e2',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 4,
    alignSelf: 'flex-start',
  },
  visitButtonText: {
    color: 'white',
    fontWeight: 'bold',
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
  filterContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  filtersContainer: {
    overflow: 'hidden',
    marginBottom: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 5,
  },
  filterText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default OrganizationsPartenairesScreen;