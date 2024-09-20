import React, { useState, useEffect } from 'react';
import { View, ScrollView, Text, TextInput, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { ref as ref_d, set } from 'firebase/database';
import { database } from '../../firebase';

const AjoutFormationScreen = ({ navigation, route }) => {
  const [formData, setFormData] = useState({
    id: Date.now().toString(),
    title: '',
    active: true,
    date: new Date(),
    image: 'https://via.placeholder.com/150',
    // category: '',
    region: '',
    lieu: '',
    status: 'propose',
    heureDebut: new Date(),
    heureFin: new Date(),
    nature: '',
    anneeConseillee: '',
    tarifEtudiant: '',
    tarifMedecin: '',
    domaine: '',
    autresDomaine: '',
    autreAnneeConseillee: '',
    affiliationDIU: '',
    competencesAcquises: '',
    prerequis: '',
    instructions: '',
    admin: '', //isAdmin should avoid this.
  });

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showStartTimePicker, setShowStartTimePicker] = useState(false);
  const [showEndTimePicker, setShowEndTimePicker] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const existingFormation = route.params?.formation;
    if (existingFormation) {
      setFormData({
        ...existingFormation,
        date: new Date(existingFormation.date),
        heureDebut: new Date(`2000-01-01T${existingFormation.heureDebut}`),
        heureFin: new Date(`2000-01-01T${existingFormation.heureFin}`),
      });
    }
  }, [route.params?.formation]);

  const handleInputChange = (name, value) => {
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
    // Clear error for this field if it exists
    if (errors[name]) {
      setErrors(prevErrors => ({
        ...prevErrors,
        [name]: null
      }));
    }
  };

  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      handleInputChange('date', selectedDate);
    }
  };

  const handleTimeChange = (event, selectedTime, type) => {
    console.log(formData.heureDebut)
    if (type === 'start') {
      setShowStartTimePicker(false);
    } else {
      setShowEndTimePicker(false);
    }
    if (selectedTime) {
      handleInputChange(type === 'start' ? 'heureDebut' : 'heureFin', selectedTime);
    }
  };

  const validateForm = () => {
    let isValid = true;
    let newErrors = {};

    // Check required fields
    const requiredFields = ['title', 'date', 'heureDebut', 'heureFin', 'lieu', 'region', 'nature', 'anneeConseillee', 'tarifEtudiant', 'tarifMedecin', 'domaine', 'affiliationDIU'];
    requiredFields.forEach(field => {
      if (!formData[field]) {
        newErrors[field] = 'Ce champ est obligatoire';
        isValid = false;
      }
    });

    // Check if 'autresDomaine' is filled when 'domaine' is 'Autres'
    if (formData.domaine === 'Autres' && !formData.autresDomaine) {
      newErrors.autresDomaine = 'Veuillez spécifier le domaine';
      isValid = false;
    }

    // Validate numeric fields
    if (isNaN(Number(formData.tarifEtudiant)) || formData.tarifEtudiant === '') {
      newErrors.tarifEtudiant = 'Le tarif doit être un nombre';
      isValid = false;
    }
    if (isNaN(Number(formData.tarifMedecin)) || formData.tarifMedecin === '') {
      newErrors.tarifMedecin = 'Le tarif doit être un nombre';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      Alert.alert(
        "Confirmation",
        route.params?.formation 
          ? "Voulez-vous vraiment modifier cette formation ?" 
          : "Voulez-vous vraiment ajouter cette formation ?",
        [
          {
            text: "Annuler",
            style: "cancel"
          },
          { 
            text: "OK", 
            onPress: () => uploadToFirebase() 
          }
        ]
      );
    } else {
      Alert.alert("Erreur", "Veuillez remplir correctement tous les champs obligatoires.");
    }
  };

  const uploadToFirebase = () => {
    const formattedData = {
      ...formData,
      date: formData.date.toISOString().split('T')[0],
      heureDebut: formData.heureDebut.toTimeString().split(' ')[0].slice(0, 5),
      heureFin: formData.heureFin.toTimeString().split(' ')[0].slice(0, 5),
      domaine: formData.domaine === 'Autres' ? formData.autresDomaine : formData.domaine,
      // anneeConseillee: formData.anneeConseillee === 'Autres' ? formData.autreAnneeConseillee : formData.anneeConseillee,
      admin: route.params?.formation ? formData.admin : "en attente"//unless isAdmin!
    };

    set(ref_d(database, `formations/${formData.id}`), formattedData)
      .then(() => {
        Alert.alert("Succès", route.params?.formation 
          ? "La formation a été modifiée avec succès."
          : "La formation a été ajoutée avec succès.");
        navigation.goBack();
      })
      .catch((error) => {
        Alert.alert("Erreur", "Une erreur s'est produite lors de l'opération.");
        console.error(error);
      });
  };

  const renderInput = (label, name, placeholder, keyboardType = 'default', multiline = false) => (
    <View>
      <Text style={styles.label}>{label} {requiredFields.includes(name) ? '*' : ''}</Text>
      <TextInput
        style={[styles.input, errors[name] && styles.inputError, multiline && styles.multilineInput]}
        value={formData[name]}
        onChangeText={(text) => handleInputChange(name, text)}
        placeholder={placeholder}
        keyboardType={keyboardType}
        multiline={multiline}
      />
      {errors[name] && <Text style={styles.errorText}>{errors[name]}</Text>}
    </View>
  );

  const requiredFields = ['title', 'date', 'heureDebut', 'heureFin', 'lieu', 'nature', 'anneeConseillee', 'tarifEtudiant', 'tarifMedecin', 'domaine', 'affiliationDIU'];

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>
        {route.params?.formation ? "Modifier la formation" : "Ajouter une nouvelle formation"}
      </Text>

      {renderInput('Titre', 'title', 'Titre de la formation')}

      <Text style={styles.label}>Date *</Text>
      <TouchableOpacity style={[styles.input, errors.date && styles.inputError]} onPress={() => setShowDatePicker(true)}>
        <Text>{formData.date.toLocaleDateString()}</Text>
      </TouchableOpacity>
      {errors.date && <Text style={styles.errorText}>{errors.date}</Text>}
      {showDatePicker && (
        <DateTimePicker
          value={formData.date}
          mode="date"
          display="default"
          onChange={handleDateChange}
        />
      )}

      <Text style={styles.label}>Heure de début *</Text>
      <TouchableOpacity style={[styles.input, errors.heureDebut && styles.inputError]} onPress={() => setShowStartTimePicker(true)}>
        <Text>{formData.heureDebut.toLocaleTimeString().slice(0, 5)}</Text>
      </TouchableOpacity>
      {errors.heureDebut && <Text style={styles.errorText}>{errors.heureDebut}</Text>}
      {showStartTimePicker && (
        <DateTimePicker
          value={formData.heureDebut}
          mode="time"
          display="default"
          onChange={(event, selectedTime) => handleTimeChange(event, selectedTime, 'start')}
        />
      )}

      <Text style={styles.label}>Heure de fin *</Text>
      <TouchableOpacity style={[styles.input, errors.heureFin && styles.inputError]} onPress={() => setShowEndTimePicker(true)}>
        <Text>{formData.heureFin.toLocaleTimeString().slice(0, 5)}</Text>
      </TouchableOpacity>
      {errors.heureFin && <Text style={styles.errorText}>{errors.heureFin}</Text>}
      {showEndTimePicker && (
        <DateTimePicker
          value={formData.heureFin}
          mode="time"
          display="default"
          onChange={(event, selectedTime) => handleTimeChange(event, selectedTime, 'end')}
        />
      )}

      {/* {renderInput('Lieu', 'lieu', 'Lieu de la formation')} */}
      <Text style={styles.label}>Lieu *</Text>
      <Picker
        selectedValue={formData.lieu}
        style={[styles.picker, errors.lieu && styles.inputError]}
        onValueChange={(itemValue) => handleInputChange('lieu', itemValue)}
      >
        <Picker.Item label="Sélectionnez une ou plusieurs régions" value="" />
        <Picker.Item label="Nîmes GEMMLR" value="Nîmes GEMMLR" />
        <Picker.Item label="Toulouse AMOPY" value="Toulouse AMOPY" />
        <Picker.Item label="Avignon ISTM" value="Avignon ISTM" />
        <Picker.Item label="Autre" value="Autre" />

      </Picker>

      {/* {renderInput('Nature de la formation', 'nature', 'Nature de la formation')} */}

      <Text style={styles.label}>Région (pour que les étudiants repèrent les formations par région) *</Text>
      <Picker
        selectedValue={formData.region}
        style={[styles.picker, errors.region && styles.inputError]}
        onValueChange={(itemValue) => handleInputChange('region', itemValue)}
      >
        <Picker.Item label="Sélectionnez une ou plusieurs régions" value="" />
        <Picker.Item label="PACA" value="PACA" />
        <Picker.Item label="Occitanie" value="Occitanie" />
        <Picker.Item label="Ile de France" value="Ile de France" />
        <Picker.Item label="Champagnes Ardennes" value="Champagnes Ardennes" />
        <Picker.Item label="Loire Atlantique" value="Loire Atlantique" />
        <Picker.Item label="Bretagne" value="Bretagne" />
        <Picker.Item label="Autre" value="Autre" />

      </Picker>
      {errors.region && <Text style={styles.errorText}>{errors.region}</Text>}

      <Text style={styles.label}>Type de formation *</Text>
      <Picker
        selectedValue={formData.nature}
        style={[styles.picker, errors.nature && styles.inputError]}
        onValueChange={(itemValue) => handleInputChange('nature', itemValue)}
      >
        <Picker.Item label="Sélectionnez un type de formation" value="" />
        <Picker.Item label="Séminaire pratique" value="Séminaire pratique" />
        <Picker.Item label="Séminaire" value="Séminaire" />
        <Picker.Item label="Formation spécialisée" value="Formation spécialisée" />
        <Picker.Item label="Atelier pratique" value="Atelier pratique" />
        <Picker.Item label="Autre" value="Autre" />
      </Picker>
      {errors.nature && <Text style={styles.errorText}>{errors.nature}</Text>}

      {formData.nature === 'Autre' && renderInput('Spécifier le type de formation', 'nature', 'Spécifier le type de formation')}

      {/* {renderInput('Année conseillée', 'anneeConseillee', 'Année conseillée')} */}
      <Text style={styles.label}>Année d'études conseillée *</Text>
      <Picker
        selectedValue={formData.anneeConseillee}
        style={[styles.picker, errors.anneeConseillee && styles.inputError]}
        onValueChange={(itemValue) => handleInputChange('domaine', itemValue)}
      >
        <Picker.Item label="Sélectionnez une année d'études" value="" />
        <Picker.Item label="DIU 1" value="DIU 1" />
        <Picker.Item label="DIU 2" value="DIU 2" />
        <Picker.Item label="DIU 3" value="DIU 3" />
        <Picker.Item label="Postgraduate" value="Postgraduate" />
        <Picker.Item label="Autre" value="Autre" />
      </Picker>

      {formData.anneeConseillee === 'Autre' && renderInput('Spécifier l\'année d\'études conseillée', 'anneeConseillee', 'Spécifier l\'année d\'études conseillée')}

      {renderInput('Tarif étudiant DIU', 'tarifEtudiant', 'Tarif étudiant DIU', 'numeric')}
      {renderInput('Tarif médecin', 'tarifMedecin', 'Tarif médecin', 'numeric')}

      <Text style={styles.label}>Domaine *</Text>
      <Picker
        selectedValue={formData.domaine}
        style={[styles.picker, errors.domaine && styles.inputError]}
        onValueChange={(itemValue) => handleInputChange('domaine', itemValue)}
      >
        <Picker.Item label="Sélectionnez un domaine" value="" />
        <Picker.Item label="Médecine Générale" value="Médecine Générale" />
        <Picker.Item label="Médecine Sport" value="Médecine Sport" />
        <Picker.Item label="Médecine Manuelle" value="Médecine Manuelle" />
        <Picker.Item label="Rhumatologie" value="Rhumatologie" />
        <Picker.Item label="Médecine Physique" value="Médecine Physique" />
        <Picker.Item label="Autre" value="Autre" />
      </Picker>

      {errors.domaine && <Text style={styles.errorText}>{errors.domaine}</Text>}

      {formData.domaine === 'Autre' && renderInput('Spécifier le domaine', 'domaine', 'Spécifier le domaine')}

      <Text style={styles.label}>Affiliation DIU Université *</Text>
      <Picker
        selectedValue={formData.affiliationDIU}
        style={[styles.picker, errors.affiliationDIU && styles.inputError]}
        onValueChange={(itemValue) => handleInputChange('affiliationDIU', itemValue)}
      >
        <Picker.Item label="Sélectionnez une affiliation" value="" />
        <Picker.Item label="Aix-Marseille" value="Aix-Marseille" />
        <Picker.Item label="Bordeaux" value="Bordeaux" />
        <Picker.Item label="Caen" value="Caen" />
        <Picker.Item label="Dijon" value="Dijon" />
        <Picker.Item label="Lille" value="Lille" />
        <Picker.Item label="Nancy" value="Nancy" />
        <Picker.Item label="Nantes-Angers" value="Nantes-Angers" />
        <Picker.Item label="Nîmes-Montpellier" value="Nîmes-Montpellier" />
        <Picker.Item label="Paris Pitié Salpetrière" value="Paris Pitié Salpetrière" />
        <Picker.Item label="Paris Saclay" value="Paris Saclay" />
        <Picker.Item label="Paris Bobigny" value="Paris Bobigny" />
        <Picker.Item label="Reims" value="Reims" />
        <Picker.Item label="Rennes" value="Rennes" />
        <Picker.Item label="Strasbourg" value="Strasbourg" />
        <Picker.Item label="Toulouse" value="Toulouse" />
        <Picker.Item label="Tours" value="Tours" />
        {/* PACA, Occitanie, Ile de France, Champagnes Ardennes, Loire Atlantique, Bretagne */}
      </Picker>
      {errors.affiliationDIU && <Text style={styles.errorText}>{errors.affiliationDIU}</Text>}

      {/* {renderInput('Catégorie', 'category', 'Catégorie de la formation')} */}
      {renderInput('Compétences acquises', 'competencesAcquises', 'Compétences acquises', 'default', true)}
      {renderInput('Prérequis', 'prerequis', 'Prérequis', 'default', true)}
      {renderInput('Instructions', 'instructions', 'Instructions', 'default', true)}

      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>
          {route.params?.formationId ? "Modifier la formation" : "Ajouter la formation"}
        </Text>
      </TouchableOpacity>

      {Object.keys(errors).length > 0 && (
        <Text style={styles.errorSummary}>
          Veuillez corriger les erreurs ci-dessus avant de soumettre le formulaire.
        </Text>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  inputError: {
    borderColor: 'red',
  },
  multilineInput: {
    height: 100,
    textAlignVertical: 'top',
  },
  picker: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    marginBottom: 10,
  },
  button: {
    backgroundColor: '#1a53ff',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 40,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default AjoutFormationScreen;