import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { ref, onValue } from 'firebase/database';
import { database } from '../../firebase';
import { Ionicons } from '@expo/vector-icons';

const DemandesProfilsScreen = ({ navigation }) => {
  const [items, setItems] = useState([]);
  const [activeTab, setActiveTab] = useState('En attente');

  useEffect(() => {
    const demandesRef = ref(database, 'demandes');
    const formationsRef = ref(database, 'formations');

    const unsubscribeDemandes = onValue(demandesRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const formattedProfiles = Object.entries(data).flatMap(([userId, userDemandes]) =>
          Object.entries(userDemandes).map(([demandeId, demande]) => ({
            id: `demande_${userId}_${demandeId}`,
            ...demande,
            type: 'demande'
          }))
        );
        updateItems(formattedProfiles);
      }
    });

    const unsubscribeFormations = onValue(formationsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const formattedFormations = Object.entries(data).map(([id, formation]) => ({
          id: `formation_${id}`,
          ...formation,
          type: 'formation'
        }));
        updateItems(formattedFormations);
      }
    });

    return () => {
      unsubscribeDemandes();
      unsubscribeFormations();
    };
  }, []);

  const updateItems = useCallback((newItems) => {
    setItems(prevItems => {
      const combinedItems = [...prevItems, ...newItems];
      const uniqueItems = combinedItems.reduce((acc, current) => {
        const x = acc.find(item => item.id === current.id);
        if (!x) {
          return acc.concat([current]);
        } else {
          return acc;
        }
      }, []);
      return uniqueItems.sort((a, b) => 
        new Date(b.timestamp || b.date) - new Date(a.timestamp || a.date)
      );
    });
  }, []);

  const getStatus = useCallback((item) => {
    if (item.admin) {
      return item.admin.charAt(0).toUpperCase() + item.admin.slice(1);
    }
    return 'En attente';
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
      {/* <TouchableOpacity 
        style={styles.newFormationButton}
        onPress={() => navigation.navigate('AjoutFormateur')}
      >
        <Text style={styles.newFormationButtonText}>+ Formateur (Phase 3!)</Text>
      </TouchableOpacity> */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
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
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
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
    marginRight:50,
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
  newFormationButton: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    backgroundColor: '#1a53ff',
    width: 200,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  newFormationButtonText: {
    color: 'white',
    fontSize: 30,
    fontWeight: 'bold',
  },
});

export default DemandesProfilsScreen;