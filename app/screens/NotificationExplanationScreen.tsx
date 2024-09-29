import React from 'react';
import { View, Text, StyleSheet, ScrollView, Platform, Linking, TouchableOpacity } from 'react-native';

const NotificationExplanationScreen = ({ route }) => {
  const { status } = route.params;

  const getExplanation = () => {
    if (status === 'granted') {
      return "Les notifications push sont actuellement activées pour Esculappl. Si vous souhaitez les désactiver, suivez les instructions ci-dessous.";
    } else {
      return "Les notifications push sont actuellement désactivées pour Esculappl. Pour profiter pleinement de l'application, nous vous recommandons de les activer. Suivez les instructions ci-dessous pour les réactiver.";
    }
  };

  const getInstructions = () => {
    if (Platform.OS === 'ios') {
      return [
        "1. Ouvrez l'application 'Réglages' sur votre iPhone.",
        "2. Faites défiler et trouvez 'Esculappl' dans la liste des applications.",
        "3. Appuyez sur 'Esculappl'.",
        "4. Trouvez l'option 'Notifications' et appuyez dessus.",
        "5. Activez ou désactivez l'option 'Autoriser les notifications'.",
      ];
    } else if (Platform.OS === 'android') {
      return [
        "1. Ouvrez les 'Paramètres' de votre appareil Android.",
        "2. Appuyez sur 'Applications' ou 'Gestionnaire d'applications'.",
        "3. Trouvez et appuyez sur 'Esculappl'.",
        "4. Appuyez sur 'Notifications'.",
        "5. Activez ou désactivez l'option 'Autoriser les notifications'.",
      ];
    } else {
      return ["Les instructions pour votre plateforme ne sont pas disponibles."];
    }
  };

  const openAppSettings = () => {
    if (Platform.OS === 'ios') {
      Linking.openURL('app-settings:');
    } else {
      Linking.openSettings();
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Gérer les notifications push</Text>
      <Text style={styles.explanation}>{getExplanation()}</Text>
      <Text style={styles.subtitle}>Instructions :</Text>
      {getInstructions().map((instruction, index) => (
        <Text key={index} style={styles.instruction}>{instruction}</Text>
      ))}
      <Text style={styles.note}>Note : Vous pouvez également appuyer sur le bouton ci-dessous pour ouvrir directement les paramètres de l'application.</Text>
      <TouchableOpacity style={styles.button} onPress={openAppSettings}>
        <Text style={styles.buttonText}>Ouvrir les paramètres de l'application</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f0f0f0',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  explanation: {
    fontSize: 16,
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  instruction: {
    fontSize: 16,
    marginBottom: 8,
  },
  note: {
    fontSize: 14,
    fontStyle: 'italic',
    marginTop: 16,
    marginBottom: 8,
  },
  button: {
    backgroundColor: '#1a53ff',
    padding: 12,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default NotificationExplanationScreen;