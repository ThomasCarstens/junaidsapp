import React, { useState, useEffect, useRef } from 'react';
import { View, Text, Button, Alert, StyleSheet, ScrollView, Platform } from 'react-native';
import { auth, database } from '../../firebase';
import { ref, set, get } from 'firebase/database';
import { useNavigation } from '@react-navigation/native';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

async function registerForPushNotificationsAsync() {
  if (Platform.OS === 'android') {
    Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  if (Device.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== 'granted') {
      Alert.alert('Erreur', 'Permission non accordée pour les notifications push !');
      return;
    }
    const projectId = Constants?.expoConfig?.extra?.eas?.projectId ?? Constants?.easConfig?.projectId;
    if (!projectId) {
      Alert.alert('Erreur', 'ID du projet non trouvé');
      return;
    }
    try {
      const pushTokenString = (await Notifications.getExpoPushTokenAsync({ projectId })).data;
      console.log(pushTokenString);
      return pushTokenString;
    } catch (e) {
      Alert.alert('Erreur', `${e}`);
    }
  } else {
    Alert.alert('Erreur', 'Les notifications push nécessitent un appareil physique');
  }
}

const EcranConsentement = () => {
  const [chargement, setChargement] = useState(false);
  const [consentementPrecedent, setConsentementPrecedent] = useState(null);
  const navigation = useNavigation();

  const [expoPushToken, setExpoPushToken] = useState('');
  const [notification, setNotification] = useState(undefined);
  const notificationListener = useRef();
  const responseListener = useRef();
  const [pushTokenList, setPushTokenList] = useState([]);
  const [UidPushTokenList, setUidPushTokenList] = useState({});

  useEffect(() => {
    verifierConsentementPrecedent();

    registerForPushNotificationsAsync()
      .then(token => setExpoPushToken(token ?? ''))
      .catch((error) => setExpoPushToken(`${error}`));

    notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
      setNotification(notification);
    });

    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
      console.log(response);
    });

    return () => {
      notificationListener.current &&
        Notifications.removeNotificationSubscription(notificationListener.current);
      responseListener.current &&
        Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);

  const verifierConsentementPrecedent = async () => {
    const utilisateur = auth.currentUser;
    if (utilisateur) {
      const refConsentement = ref(database, `/consentement/${utilisateur.uid}`);
      const snapshot = await get(refConsentement);
      setConsentementPrecedent(snapshot.val());
    }
  };

  const gererConsentement = async (consentement) => {
    setChargement(true);
    try {
      const utilisateur = auth.currentUser;
      if (utilisateur) {
        await set(ref(database, `/consentement/${utilisateur.uid}`), consentement);
        
        if (consentement) {
          // Si l'utilisateur consent, enregistrez le token de notification
          await set(ref(database, `userdata/${utilisateur.uid}/notifications/`), {
            token: expoPushToken,
            consent: true
          });
        } else {
            // Si l'utilisateur ne consent pas, enregistrez le token de notification
            await set(ref(database, `userdata/${utilisateur.uid}/notifications/`), {
              token: expoPushToken,
              consent: false
            });
          
        }

        Alert.alert(
          'Merci',
          consentement 
            ? 'Votre consentement a été enregistré. Vous pouvez maintenant utiliser l\'application.'
            : 'Nous comprenons votre décision. Cependant, le consentement est nécessaire pour utiliser Esculapp. Vous pouvez changer d\'avis à tout moment dans les paramètres de l\'application.',
          [{ text: 'OK', onPress: () => navigation.pop() }]
        );
      } else {
        throw new Error('Utilisateur non authentifié');
      }
    } catch (erreur) {
      console.error('Erreur lors de l\'enregistrement du consentement:', erreur);
      Alert.alert('Erreur', 'Échec de l\'enregistrement de votre réponse. Veuillez réessayer.');
    } finally {
      setChargement(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.conteneur}>
      <Text style={styles.titre}>Consentement de Données Requis</Text>
      <Text style={styles.description}>
        {consentementPrecedent === false
          ? "Nous avons remarqué que vous avez précédemment refusé le consentement de données. Cependant, pour vous inscrire aux formations proposées par Esculapp, nous avons besoin de votre consentement pour le traitement de vos données personnelles."
          : "Pour vous inscrire aux formations proposées par Esculapp, nous avons besoin de votre consentement pour le traitement de vos données personnelles."}
      </Text>
      <Text style={styles.description}>
        Cela inclut :
      </Text>
      <Text style={styles.liste}>
        • Nom{'\n'}
        • Formation{'\n'}
        • Pratique professionnelle{'\n'}
        • Token de notification push
      </Text>
      <Text style={styles.description}>
        Votre consentement est nécessaire pour vous fournir toutes les fonctionnalités d'Esculapp, y compris les notifications push.
      </Text>
      <View style={styles.conteneurBoutons}>
        <Button 
          title="J'accepte" 
          onPress={() => gererConsentement(true)} 
          disabled={chargement}
        />
        <Button 
          title="Je n'accepte pas" 
          onPress={() => gererConsentement(false)} 
          disabled={chargement}
        />
      </View>
      <Text style={styles.piedDePage}>
        Note : Vous pouvez retirer votre consentement à tout moment depuis la section "Gérer les paramètres Esculapp" dans les paramètres de l'application.
      </Text>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  conteneur: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  titre: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
  liste: {
    fontSize: 16,
    marginBottom: 20,
    alignSelf: 'flex-start',
  },
  conteneurBoutons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: 20,
  },
  piedDePage: {
    fontSize: 14,
    fontStyle: 'italic',
    textAlign: 'center',
    marginTop: 20,
  },
});

export default EcranConsentement;