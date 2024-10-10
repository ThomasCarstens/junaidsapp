import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, LayoutAnimation, Platform, UIManager } from 'react-native';
import { ref as ref_d, get } from 'firebase/database';
import { database } from '../../firebase';

// Enable LayoutAnimation for Android
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const ParticipantsScreen = ({ route }) => {
  const [participants, setParticipants] = useState([]);
  const { formationId } = route.params;

  useEffect(() => {
    fetchParticipants();
  }, []);

  const fetchParticipants = async () => {
    const demandesRef = ref_d(database, 'demandes');
    const snapshot = await get(demandesRef);
    const demandes = snapshot.val();
    const participantsList = [];
    for (const uid in demandes) {
      if (demandes[uid][formationId]) {
        participantsList.push({
          uid,
          expanded: false,
          ...demandes[uid][formationId]
        });
      }
    }
    setParticipants(participantsList);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Validée': return '#4CAF50';
      case 'En attente': return '#FFC107';
      case 'Refusée': return '#F44336';
      default: return '#9E9E9E';
    }
  };

  const toggleExpand = (uid) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setParticipants(participants.map(p => 
      p.uid === uid ? { ...p, expanded: !p.expanded } : p
    ));
  };

  const renderParticipantItem = ({ item }) => (
    <TouchableOpacity onPress={() => toggleExpand(item.uid)}>
      <View style={styles.participantItem}>
        <View style={[styles.statusBar, { backgroundColor: getStatusColor(item.admin) }]} />
        <View style={styles.participantContent}>
          <Text style={styles.status}>Statut: {item.admin}</Text>
          <Text style={styles.name}>{item.nom} {item.prenom}</Text>
          <Text style={styles.info}>Email: {item.email}</Text>
          
          {item.expanded && (
            <View style={styles.expandedContent}>
              <Text style={styles.info}>Téléphone: {item.telephone || 'Non renseigné'}</Text>
              <Text style={styles.info}>Année DIU: {item.anneeDIU || 'Non renseigné'}</Text>
              <Text style={styles.info}>Étudiant DIU: {item.etudiantDIU ? 'Oui' : 'Non'}</Text>
              <Text style={styles.info}>Faculté: {item.faculte || 'Non renseignée'}</Text>
              <Text style={styles.info}>Médecin Diplômé: {item.medecinDiplome ? 'Oui' : 'Non'}</Text>
              <Text style={styles.info}>Formation: {item.formationTitle}</Text>
              <Text style={styles.info}>Date d'inscription: {new Date(item.timestamp).toLocaleString()}</Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Participants</Text>
      <FlatList
        data={participants}
        renderItem={renderParticipantItem}
        keyExtractor={item => item.uid}
        ListEmptyComponent={<Text style={styles.emptyText}>Aucun participant pour le moment</Text>}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
    textAlign: 'center',
  },
  participantItem: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    marginBottom: 16,
    borderRadius: 8,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statusBar: {
    width: 8,
  },
  participantContent: {
    flex: 1,
    padding: 16,
  },
  status: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#555',
  },
  name: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#1a53ff',
  },
  info: {
    fontSize: 14,
    marginBottom: 4,
    color: '#333',
  },
  expandedContent: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  emptyText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#666',
    marginTop: 24,
  },
});

export default ParticipantsScreen;