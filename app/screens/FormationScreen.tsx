import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { auth, firebase, storage, database } from '../../firebase';
import { ref as ref_d, set, get, onValue } from 'firebase/database';

const FormationScreen = ({ route, navigation }) => {
  const { formationId, role } = route.params;
  console.log(role)
  const [formation, setFormation] = useState(null);

  useEffect(() => {
    const formationRef = ref_d(database, `/formations/${formationId}`);
    const unsubscribe = onValue(formationRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setFormation(data);
      } else {
        Alert.alert("Erreur", "Formation non trouvée");
        navigation.goBack();
      }
    });

    return () => unsubscribe();
  }, [formationId]);

  const handleDelete = () => {
    let toggleAction = (formation.active)?"Désactiver":"Réactiver"
    Alert.alert(
      "Confirmation",
      `Êtes-vous sûr de vouloir ${toggleAction} cette formation ?`,
      [
        { text: "Annuler", style: "cancel" },
        { text: toggleAction, onPress: () => {
          const formationRef = ref_d(database, `/formations/${formationId}`);
          set(formationRef, { ...formation, active: !(formation.active) })
            .then(() => {
              Alert.alert("Succès", `La formation a été ${toggleAction}`);
              console.log(formation.active)
              navigation.goBack();
            })
            .catch((error) => {
              Alert.alert("Erreur", "Impossible de désactiver la formation");
            });
        }}
      ]
    );
  };

  if (!formation) {
    return (
      <View style={styles.container}>
        <Text>Chargement...</Text>
      </View>
    );
  }
  return (
    <ScrollView style={styles.container}>
      <Image source={{ uri: formation.image }} style={styles.image} />
      <Text style={styles.title}>{formation.title}</Text>
      {(role.isAdmin===true) ? (
        <View style={styles.buttonContainer}>
          {(formation.active)?
          <TouchableOpacity 
            style={styles.signUpButton}
            onPress={() => navigation.navigate('InscriptionFormation', { formationId: formation.id, formationTitle: formation.title })}
          >
            <Text style={styles.signUpButtonText}>S'inscrire</Text>
          </TouchableOpacity>:(<View></View>)}
          <TouchableOpacity 
            style={styles.modifyButton}
            onPress={() => navigation.navigate('AjoutFormation', { formation: formation, role: role })}
          >
            <Text style={styles.buttonText}>Modifier</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.deleteButton}
            onPress={handleDelete}
          >
            <Text style={styles.buttonText}>{(formation.active)?"Désactiver":"Réactiver"}</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.buttonContainer}>
          {(formation.active)?<TouchableOpacity 
            style={styles.signUpButton}
            onPress={() => navigation.navigate('InscriptionFormation', { formationId: formation.id, formationTitle: formation.title })}
          >
            <Text style={styles.signUpButtonText}>S'inscrire</Text>
          </TouchableOpacity>:(<View></View>)}
        </View>
      )}
      <Text style={styles.info}>Date: {formation.date}</Text>
      <Text style={styles.info}>Heure: {formation.heureDebut} - {formation.heureFin}</Text>
      <Text style={styles.info}>Lieu: {formation.lieu}</Text>
      <Text style={styles.info}>Nature: {formation.nature}</Text>
      <Text style={styles.info}>Tarif étudiant: {formation.tarifEtudiant} €</Text>
      <Text style={styles.info}>Tarif médecin: {formation.tarifMedecin} €</Text>
      
      <Text style={styles.sectionTitle}>Domaine</Text>
      <Text style={styles.text}>{formation.domaine}</Text>
      
      <Text style={styles.sectionTitle}>Prérequis</Text>
      <Text style={styles.text}>{formation.prerequis}</Text>
      
      <Text style={styles.sectionTitle}>Compétences acquises</Text>
      <Text style={styles.text}>{formation.competencesAcquises || "Non spécifié"}</Text>
      

      {/* <Text style={styles.sectionTitle}>Autres domaines</Text>
      <Text style={styles.text}>{formation.autresDomaine || "Non spécifié"}</Text> */}
      
      <Text style={styles.sectionTitle}>Affiliation DIU</Text>
      <Text style={styles.text}>{formation.affiliationDIU}</Text>
      
      <Text style={styles.sectionTitle}>Année conseillée</Text>
      <Text style={styles.text}>{formation.anneeConseillee}</Text>
      

      
      <Text style={styles.sectionTitle}>Instructions</Text>
      <Text style={styles.text}>{formation.instructions}</Text>

      <View style={styles.bottomSpacer} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
  },
  contentContainer: {
    padding: 15,
    paddingBottom: 30, // Add extra padding at the bottom
  },
  bottomSpacer: {
    height: 50, // Adjust this value to increase or decrease the space at the bottom
  },
  image: {
    width: '100%',
    height: 200,
    marginBottom: 15,
    borderRadius: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  signUpButton: {
    backgroundColor: '#1a53ff',
    padding: 10,
    borderRadius: 5,
    flex: 1,
    marginRight: 5,
  },
  
  modifyButton: {
    backgroundColor: '#4CAF50',
    padding: 10,
    borderRadius: 5,
    flex: 1,
    marginRight: 5,
  },
  deleteButton: {
    backgroundColor: '#F44336',
    padding: 10,
    borderRadius: 5,
    flex: 1,
  },
  signUpButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
  },
  info: {
    fontSize: 16,
    marginBottom: 5,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 15,
    marginBottom: 5,
  },
  text: {
    fontSize: 16,
    marginBottom: 10,
  },
});

export default FormationScreen;