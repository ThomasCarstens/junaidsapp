import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Modal } from 'react-native';
import { ref, update, get } from 'firebase/database';
import { database } from '../../firebase';
import { Ionicons } from '@expo/vector-icons';
import { CheckBox } from 'react-native-elements';

const ConfirmationDialog = ({ visible, onConfirm, onCancel, action }) => {
  const [notifyUser, setNotifyUser] = useState(false);

  return (
    <Modal
      transparent={true}
      visible={visible}
      onRequestClose={onCancel}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <Text style={styles.modalText}>Êtes-vous sûr de vouloir {action} cette demande ?</Text>
          {/* <CheckBox
            title="Notifier l'utilisateur"
            checked={notifyUser}
            onPress={() => setNotifyUser(!notifyUser)}
          /> */}
          <View style={styles.modalButtons}>
            <TouchableOpacity
              style={[styles.button, styles.buttonCancel]}
              onPress={onCancel}
            >
              <Text style={styles.textStyle}>Annuler</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.buttonConfirm]}
              onPress={() => onConfirm(true)}
            >
              <Text style={styles.textStyle}>Confirmer</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const ValidationProfil = ({ route, navigation }) => {
  const { profile } = route.params;
  const [adminStatus, setAdminStatus] = useState(profile.admin || 'En attente');
  const [formationInfo, setFormationInfo] = useState(null);
  const [confirmationVisible, setConfirmationVisible] = useState(false);
  const [pendingAction, setPendingAction] = useState(null);

  useEffect(() => {
    if (profile.type === 'demande') {
      const formationId = profile.id.split('_')[2];
      const formationRef = ref(database, `formations/${formationId}`);
      get(formationRef).then((snapshot) => {
        if (snapshot.exists()) {
          setFormationInfo(snapshot.val());
        }
      }).catch((error) => {
        console.error("Error fetching formation info:", error);
      });
    }
  }, [profile]);

  const handleValidation = async (validationStatus) => {
    setPendingAction(validationStatus);
    setConfirmationVisible(true);
  };

  const confirmValidation = async (notifyUser) => {
    try {
      let updates = {};
      
      if (profile.type === 'demande') {
        let formationId = profile.id.split('_')[2];
        let accountUid = profile.id.split('_')[1];
        updates[`/demandes/${accountUid}/${formationId}/admin`] = pendingAction;
        updates[`/demandes/${accountUid}/${formationId}/notifierDemandeur`] = notifyUser;
      } else {
        updates[`/formations/${profile.id.split('_')[1]}/admin`] = pendingAction === 'Validée' ? 'validée' : 'rejetée';
        updates[`/formations/${profile.id.split('_')[1]}/active`] = pendingAction === 'Validée';
      }

      await update(ref(database), updates);
      
      setAdminStatus(pendingAction);
      Alert.alert(
        'Mise à jour réussie',
        `La demande a été ${pendingAction === 'Validée' ? 'validée' : 'rejetée'} avec succès.`,
        [{ text: 'OK', onPress: () => navigation.goBack() }]
      );
    } catch (error) {
      console.error('Error updating status:', error);
      Alert.alert('Erreur', 'Une erreur est survenue lors de la mise à jour du statut.');
    } finally {
      setConfirmationVisible(false);
      setPendingAction(null);
    }
  };

  const cancelValidation = () => {
    setConfirmationVisible(false);
    setPendingAction(null);
  };

  const renderField = (label, value) => (
    <View style={styles.field}>
      <Text style={styles.fieldLabel}>{label}:</Text>
      <Text style={styles.fieldValue}>{value || 'Non spécifié'}</Text>
    </View>
  );

  const renderFormationInfo = () => {
    if (!formationInfo) return null;

    return (
      <View style={styles.formationInfoContainer}>
        <Text style={styles.formationInfoTitle}>Information de la Formation</Text>
        {renderField('Titre', formationInfo.title)}
        {renderField('Catégorie', formationInfo.category)}
        {renderField('Domaine', formationInfo.domaine)}
        {renderField('Lieu', formationInfo.lieu)}
        {renderField('Date', formationInfo.date)}
        {renderField('Heure de début', formationInfo.heureDebut)}
        {renderField('Heure de fin', formationInfo.heureFin)}
        {renderField('Tarif Étudiant', `${formationInfo.tarifEtudiant} €`)}
        {renderField('Tarif Médecin', `${formationInfo.tarifMedecin} €`)}
        {renderField('Niveau', formationInfo.niveau)}
        {renderField('Nature', formationInfo.nature)}
        {renderField('Affiliation DIU', formationInfo.affiliationDIU)}
        {renderField('Année conseillée', formationInfo.anneeConseillee)}
        {renderField('Compétences acquises', formationInfo.competencesAcquises)}
        {renderField('Prérequis', formationInfo.prerequis)}
        {renderField('Instructions', formationInfo.instructions)}
      </View>
    );
  };

  return (
    <ScrollView style={styles.container}>
      
      <View style={styles.header}>
        <Text style={styles.title}>
          {profile.type === 'demande' ? "Demande d'inscription" : "Demande de validation Formation"}
        </Text>
        <Ionicons 
          name={profile.type === 'demande' ? "person" : "school"} 
          size={24} 
          color="#007AFF" 
        />
      </View>
      <View style={styles.statusContainer}>
        <Text style={styles.statusLabel}>Statut actuel:</Text>
        <Text style={[styles.statusValue, { color: adminStatus === 'Validée' ? 'green' : (adminStatus === 'Rejetée' ? 'red' : 'orange') }]}>
          {adminStatus}
        </Text>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, styles.validateButton]}
          onPress={() => handleValidation('Validée')}
        >
          <Text style={styles.buttonText}>Valider</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, styles.rejectButton]}
          onPress={() => handleValidation('Rejetée')}
        >
          <Text style={styles.buttonText}>Rejeter</Text>
        </TouchableOpacity>
      </View>
      {profile.type === 'demande' ? (
        <>
          <Text style={styles.sectionTitle}>Information du Demandeur</Text>
          {renderField('Email', profile.email)}
          {renderField('Téléphone', profile.telephone)}
          {renderField('Médecin Diplômé', profile.medecinDiplome ? 'Oui' : 'Non')}
          {renderField('Année de diplôme', profile.anneeDiplome)}
          {renderField('Faculté', profile.faculte)}
          {renderField('Fonction Enseignant', profile.fonctionEnseignant ? 'Oui' : 'Non')}
          {renderField('Étudiant DIU', profile.etudiantDIU ? 'Oui' : 'Non')}
          {renderField('Année DIU', profile.anneeDIU)}
          {renderField('Date de soumission', new Date(profile.timestamp).toLocaleString())}
          {renderFormationInfo()}
        </>
      ) : (
        <>
          {renderField('Titre', profile.title)}
          {renderField('Catégorie', profile.category)}
          {renderField('Domaine', profile.domaine)}
          {renderField('Lieu', profile.lieu)}
          {renderField('Date', profile.date)}
          {renderField('Heure de début', profile.heureDebut)}
          {renderField('Heure de fin', profile.heureFin)}
          {renderField('Tarif Étudiant', `${profile.tarifEtudiant} €`)}
          {renderField('Tarif Médecin', `${profile.tarifMedecin} €`)}
          {renderField('Niveau', profile.niveau)}
          {renderField('Nature', profile.nature)}
          {renderField('Affiliation DIU', profile.affiliationDIU)}
          {renderField('Année conseillée', profile.anneeConseillee)}
          {renderField('Compétences acquises', profile.competencesAcquises)}
          {renderField('Prérequis', profile.prerequis)}
          {renderField('Instructions', profile.instructions)}
        </>
      )}

      <ConfirmationDialog
        visible={confirmationVisible}
        onConfirm={confirmValidation}
        onCancel={cancelValidation}
        action={pendingAction === 'Validée' ? 'valider' : 'rejeter'}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginTop: 20,
    marginBottom: 10,
  },
  field: {
    marginBottom: 12,
  },
  fieldLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#34495e',
  },
  fieldValue: {
    fontSize: 16,
    color: '#2c3e50',
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 20,
  },
  statusLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    marginRight: 10,
  },
  statusValue: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
  },
  // button: {
  //   paddingVertical: 12,
  //   paddingHorizontal: 30,
  //   borderRadius: 25,
  //   alignItems: 'center',
  // },
  validateButton: {
    backgroundColor: '#2ecc71',
  },
  rejectButton: {
    backgroundColor: '#e74c3c',
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  formationInfoContainer: {
    marginTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#bdc3c7',
    paddingTop: 20,
  },
  formationInfoTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 10,
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center"
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 20,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2
  },
  buttonCancel: {
    backgroundColor: "#2196F3",
  },
  buttonConfirm: {
    backgroundColor: "#2196F3",
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center"
  },
});

export default ValidationProfil;