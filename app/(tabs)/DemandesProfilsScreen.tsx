import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { ref, get } from 'firebase/database';
import { auth, database } from '../../firebase';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const DemandesProfilsScreen = () => {
  const [items, setItems] = useState([]);
  const [activeTab, setActiveTab] = useState('En attente');
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  useEffect(() => {
    navigation.setOptions({
      headerShown: true,
      title: 'Administrer',
      headerStyle: {
        backgroundColor: '#1a53ff',
      },
      headerTintColor: '#fff',
      headerTitleStyle: {
        fontWeight: 'bold',
      },
      headerRight: () => (
        <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
          <Text style={styles.logoutButtonText}>Se déconnecter</Text>
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  const loadItems = useCallback(async () => {
    setLoading(true);
    const demandesRef = ref(database, 'demandes');
    const formationsRef = ref(database, 'formations');

    try {
      const [demandesSnapshot, formationsSnapshot] = await Promise.all([
        get(demandesRef),
        get(formationsRef),
      ]);

      const demandesData = demandesSnapshot.val();
      const formationsData = formationsSnapshot.val();

      const formattedItems = [];

      if (demandesData) {
        Object.entries(demandesData).forEach(([userId, userDemandes]) => {
          Object.entries(userDemandes).forEach(([demandeId, demande]) => {
            formattedItems.push({
              id: `demande_${userId}_${demandeId}`,
              ...demande,
              type: 'demande'
            });
          });
        });
      }

      if (formationsData) {
        Object.entries(formationsData).forEach(([id, formation]) => {
          formattedItems.push({
            id: `formation_${id}`,
            ...formation,
            type: 'formation'
          });
        });
      }

      formattedItems.sort((a, b) => new Date(b.timestamp || b.date) - new Date(a.timestamp || a.date));
      setItems(formattedItems);
    } catch (error) {
      console.error('Error loading items:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      loadItems();
    }, [loadItems])
  );

  const handleLogout = async () => {
    try {
      await auth.signOut();
      await AsyncStorage.removeItem('userUid');
      navigation.navigate('Login');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const getStatus = useCallback((item) => {
    if (item.admin) {
      return item.admin.charAt(0).toUpperCase() + item.admin.slice(1);
    } else {
      return 'En attente';
    }
  }, []);

  const filteredItems = React.useMemo(() => 
    items.filter(item => getStatus(item) === activeTab),
    [items, activeTab, getStatus]
  );

  const renderItem = useCallback(({ item }) => (
    <TouchableOpacity
      style={styles.itemCard}
      onPress={() => navigation.navigate('ValidationProfil', { profile: item })}
    >
      <View style={styles.cardHeader}>
        <Text style={styles.cardTitle}>
          {item.type === 'demande' ? "Demande d'inscription Formation" : "Demande de validation Formation"}
        </Text>
        <Text style={styles.cardDate}>
          {new Date(item.timestamp || item.date).toLocaleDateString()}
        </Text>
      </View>
      <Text style={styles.cardEmail}>
        {item.type === 'demande' ? `${item.prenom} ${item.nom}` : item.title}
      </Text>
      {item.type === 'demande' ? (
        <>
          <Text>Médecin Diplômé: {item.medecinDiplome ? 'Oui' : 'Non'}</Text>
          <Text>Fonction Enseignant: {item.fonctionEnseignant ? 'Oui' : 'Non'}</Text>
        </>
      ) : (
        <>
          <Text>Lieu: {item.lieu}</Text>
          <Text>Date: {item.date}</Text>
        </>
      )}
      <View style={styles.cardIcon}>
        <Ionicons 
          name={item.type === 'demande' ? "person-outline" : "school-outline"} 
          size={40} 
          color="#007AFF" 
        />
      </View>
    </TouchableOpacity>
  ), [navigation]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.tabContainer}>
        {['En attente', 'Validée', 'Rejetée'].map((tab) => (
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
      <FlatList
        data={filteredItems}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={<Text style={styles.emptyList}>Aucun élément trouvé</Text>}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    backgroundColor: 'white',
  },
  tab: {
    flex: 1,
    paddingVertical: 15,
    alignItems: 'center',
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#007AFF',
  },
  tabText: {
    fontSize: 16,
    color: '#333',
  },
  activeTabText: {
    color: '#007AFF',
    fontWeight: 'bold',
  },
  itemCard: {
    padding: 20,
    backgroundColor: '#d5dcf0',
    borderRadius: 10,
    shadowColor: "orange",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    marginHorizontal: 16,
    marginVertical: 8,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  cardDate: {
    fontSize: 14,
    color: '#7f8c8d',
  },
  cardEmail: {
    fontSize: 18,
    marginRight: 50,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#2c3e50',
  },
  cardIcon: {
    position: 'absolute',
    right: 16,
    top: 60,
  },
  emptyList: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    color: '#7f8c8d',
  },
  logoutButton: {
    marginRight: 10,
  },
  logoutButtonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default DemandesProfilsScreen;