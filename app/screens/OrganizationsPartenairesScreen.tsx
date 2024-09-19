import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList, Image } from 'react-native';
import { database, auth } from '../../firebase';

const organizations = [
  { id: '1', name: 'SOFMMOOM', image: require('../../assets/images/partenaires/sofMOMMO.png'), description: 'Société Française de Médecine Manuelle Orthopédique et Ostéopathique Médicale' },
  { id: '2', name: 'SMMOF', image: require('../../assets/images/partenaires/SMMOF.png'), description: 'Société de Médecine Manuelle - Orthopédique de France' },
  { id: '3', name: 'ISTM', image: require('../../assets/images/partenaires/ISTM.png'), description: 'Institut Supérieur de Thérapie Manuelle' },
  { id: '4', name: 'GEMMLR', image: require('../../assets/images/partenaires/GEMMLR.png'), description: 'Groupe \'Études et de Médecine Manuelle Médecine Légale et Réparation' },
  { id: '5', name: 'AMOPY', description: 'Association de Médecine Ostéopathique et de Posturologie Yvelines' },
  { id: '6', name: 'CEMMOM', description: 'Collège Européen de Médecine Manuelle et Ostéopathie Médicale' },
];

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

const OrganizationsPartenairesScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}> Liens directs vers les organisations partenaires. </Text>
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
      {auth.currentUser?<Text style={styles.title}> Gestion de mon compte </Text> : <View></View>}
      
      {/* <Text style={styles.title}> Gestion des comptes </Text> */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f0f0f0',
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
});

export default OrganizationsPartenairesScreen;