import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Image, FlatList, Animated, Linking, Platform, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

import { auth, firebase, storage, database } from '../../firebase'
import { ref as ref_d, set, get, onValue } from 'firebase/database'
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Application from 'expo-application';
const RechercheFormationsScreen = (props, { route }) => {

  // const { userDta, role } = route.params;
  const [formations, setFormations] = useState([]);
  const [filteredFormations, setFilteredFormations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // const [niveauFilter, setNiveauFilter] = useState('');
  const [activeTab, setActiveTab] = useState('Visibles');
  const [isFormateur, setIsFormateur] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const filterHeight = useState(new Animated.Value(0))[0];
  const [userDemandes, setUserDemandes] = useState({});

  const [categoryFilter, setCategoryFilter] = useState('');
  const [lieuFilter, setLieuFilter] = useState('');
  const [regionFilter, setRegionFilter] = useState('');
  const [anneeFilter, setAnneeFilter] = useState('');
  // Remove niveauFilter state

  // const [categoryOptions, setCategoryOptions] = useState([]);
  // const [lieuOptions, setLieuOptions] = useState([]);
  // const [regionOptions, setRegionOptions] = useState([]);
  // const [anneeOptions, setAnneeOptions] = useState([]);

  const navigation = useNavigation();
  const [categoryOptions, setCategoryOptions] = useState([
    "Médecine Sport",
    "Rhumatologie",
    "Médecine Physique",
    "Autre"
  ]);
  
  const [lieuOptions, setLieuOptions] = useState([
    "Nîmes GEMMLR",
    "Toulouse AMOPY",
    "Avignon ISTM",
    "Autre"
  ]);
  
  const [regionOptions, setRegionOptions] = useState([
    "PACA",
    "Occitanie",
    "Île-de-France",
    "Grand Est",
    "Bretagne",
    "Auvergne-Rhône-Alpes",
    "Bourgogne-Franche-Comté",
    "Centre-Val de Loire",
    "Corse",
    "Hauts-de-France",
    "Normandie",
    "Nouvelle-Aquitaine",
    "Pays de la Loire",
    "Loire-Atlantique",
    "Autre"
  ]);
  
  const [anneeOptions, setAnneeOptions] = useState([
    "DIU 1",
    "DIU 2",
    "DIU 3",
    "Postgraduate",
    "Autre"
  ]);
  const [isUpdateAvailable, setIsUpdateAvailable] = useState(false);
  // useEffect(() => {
  //   console.log(route)
  // }, [route?.params]);

  useEffect(() => {
    fetchFormations();
    fetchUserDemandes();
    console.log(auth.currentUser?.uid)
    checkForUpdates();
  }, []);

  const checkForUpdates = async () => {
    try {
      let currentVersion;
      if (Platform.OS === 'ios') {
        currentVersion = await Application.nativeApplicationVersion;
      } else {
        currentVersion = Application.nativeApplicationVersion;
      }
      console.log(currentVersion)

      const latestVersionRef = ref_d(database, 'latestAppVersion');
      const snapshot = await get(latestVersionRef);
      const latestVersion = snapshot.val();
      console.log(latestVersion)

      if (latestVersion && compareVersions(currentVersion, latestVersion) < 0) {
        setIsUpdateAvailable(true);
        Alert.alert(
          `Mise à jour disponible: ${latestVersion}`,
          `Vous avez une ancienne version de l\'application (${currentVersion}). Voulez-vous la télécharger ?`,
          [
            { text: 'Plus tard', style: 'cancel' },
            { text: 'Mettre à jour', onPress: () => openAppStore() }
          ]
        );
      }
    } catch (error) {
      console.error('Error checking for updates:', error);
    }
  };

  const compareVersions = (v1, v2) => {
    const parts1 = v1.split('.').map(Number);
    const parts2 = v2.split('.').map(Number);
    for (let i = 0; i < 3; i++) {
      if (parts1[i] > parts2[i]) return 1;
      if (parts1[i] < parts2[i]) return -1;
    }
    return 0;
  };

  const openAppStore = () => {
    const url = Platform.OS === 'ios'
      ? 'https://apps.apple.com/app/your-app-id'
      : 'https://play.google.com/store/apps/details?id=your.app.package';
    Linking.openURL(url);
  };
  
  useEffect(() => {
    applyFilters(activeTab)
  }, [formations]);
  
  useEffect(() => {
    navigation.setOptions({
      headerShown: true,
      title: 'Formations',
      headerStyle: {
        backgroundColor: '#1a53ff',
      },
      headerTintColor: '#fff',
      headerTitleStyle: {
        fontWeight: 'bold',
      },
      headerRight: () => (
        <TouchableOpacity onPress={()=>handleLogout()} style={styles.logoutButton}>
          <Text style={styles.logoutButtonText}>Se déconnecter</Text>
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  useEffect(() => {
    if (props.route.params?.spoofFormateur) {
      setIsFormateur(props.route.params.spoofFormateur);
    }
  }, [props.route.params?.spoofFormateur]);

  useEffect(() => {
    if (props.route.params?.spoofAdmin) {
      setIsAdmin(props.route.params.spoofAdmin);
    }
  }, [props.route.params?.spoofAdmin]);

  useEffect(() => {
    if (props.route.params?.spoofLoggedIn) {
      setIsLoggedIn(props.route.params.spoofLoggedIn);
    }
  }, [props.route.params?.spoofLoggedIn]);

  const handleLogout = async () => {
    try {
      await auth.signOut();
      await AsyncStorage.removeItem('userUid');
      navigation.navigate('Login');
      // navigation.
      // setLoading(false);
      
    } catch (error) {
      console.error('Error logging out:', error);
      // setLoading(false);
    }
  };

  const fetchFormations = () => {
    setLoading(true);
    const formationsRef = ref_d(database, "formations/");
    onValue(formationsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const formationsArray = Object.keys(data).map(key => ({
          ...data[key],
          id: key
        }));
        setFormations(formationsArray);
        setFilteredFormations(formationsArray);
        setLoading(false);
        updateFilterOptions(formationsArray);
      } else {
        setError('Aucune formation trouvée');
        setLoading(false);
      }
    }, (error) => {
      setError('Erreur lors du chargement des formations');
      setLoading(false);
    });
  };

  const updateFilterOptions = (formationsArray) => {
    // We don't need to update the options from the formationsArray anymore
    // as we're using predefined lists. However, we might want to keep track
    // of which options are actually present in the data.
    
    const presentCategories = new Set(formationsArray.map(f => f.domaine));
    const presentLieux = new Set(formationsArray.map(f => f.lieu));
    const presentRegions = new Set(formationsArray.map(f => f.region));
    const presentAnnees = new Set(formationsArray.map(f => f.anneeConseillee));
  
    console.log("Present categories:", presentCategories);
    console.log("Present lieux:", presentLieux);
    console.log("Present regions:", presentRegions);
    console.log("Present annees:", presentAnnees);
  
    // If you want to highlight or mark which options are actually present in the data,
    // you can use these Sets to do so in your UI rendering logic.
  };

  // const updateFilterOptions = (formationsArray) => {
  //   const categories = [...new Set(formationsArray.map(f => f.domaine))];
  //   const lieux = [...new Set(formationsArray.map(f => f.lieu))];
  //   const regions = [...new Set(formationsArray.map(f => f.region))];
  //   const annees = [...new Set(formationsArray.map(f => f.anneeConseillee))];
  //   console.log(categories)
  //   setCategoryOptions(categories);
  //   setLieuOptions(lieux);
  //   setRegionOptions(regions);
  //   setAnneeOptions(annees);
  // };

  const renderAppliedFilters = () => {
    const appliedFilters = [];
    if (categoryFilter) appliedFilters.push({ type: 'Domaine', value: categoryFilter });
    if (lieuFilter) appliedFilters.push({ type: 'Lieu', value: lieuFilter });
    if (niveauFilter) appliedFilters.push({ type: 'Niveau', value: niveauFilter });
  
    return (
      <View style={styles.appliedFiltersContainer}>
        {appliedFilters.map((filter, index) => (
          <View key={index} style={styles.appliedFilterItem}>
            <Text style={styles.appliedFilterText}>{filter.type}: {filter.value}</Text>
            <TouchableOpacity onPress={() => removeFilter(filter.type)}>
              <Ionicons name="close-circle" size={20} color="#1a53ff" />
            </TouchableOpacity>
          </View>
        ))}
      </View>
    );
  };
  const toggleFilters = () => {
    setShowFilters(!showFilters);
    Animated.timing(filterHeight, {
      toValue: showFilters ? 0 : 300,
      duration: 300,
      useNativeDriver: false,
    }).start();
  };

  const fetchUserDemandes = () => {
    const demandesRef = ref_d(database, `demandes/${auth.currentUser.uid}`);
    onValue(demandesRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setUserDemandes(data);
      }
    });
  };

  const applyFilters = (tab) => {
    let filtered = formations;
    if (categoryFilter) {
      filtered = filtered.filter(f => f.domaine === categoryFilter);
    }
    if (lieuFilter) {
      filtered = filtered.filter(f => f.lieu === lieuFilter);
    }
    if (regionFilter) {
      filtered = filtered.filter(f => f.region === regionFilter);
    }
    if (anneeFilter) {
      filtered = filtered.filter(f => f.anneeConseillee === anneeFilter);
    }
    if (tab === "J'y suis inscrit") {
      filtered = filtered.filter(f => 
        userDemandes[f.id] && userDemandes[f.id].admin === "Validée"
      );
    } else if (tab === 'Je propose') {
      filtered = filtered.filter(f => (f.status === 'propose'));
    } else if (tab === 'Cachées') {
      filtered = filtered.filter(f => f.active === false);
    } else {
      // 'Visibles' tab
      filtered = filtered.filter(f => f.active === true);
    }
    setFilteredFormations(filtered);
  };
  
  const renderFilterButtons = (title, options, selectedValue, setSelectedValue) => (
    <View style={styles.filterSection}>
      <Text style={styles.filterTitle}>{title}</Text>
      <View style={styles.filterButtonsContainer}>
        {options.map((option) => (
          <TouchableOpacity
            key={option}
            style={[
              styles.filterButton,
              selectedValue === option && styles.filterButtonSelected
            ]}
            onPress={() => {
              
              setSelectedValue(selectedValue === option ? '' : option);
              // applyFilters(activeTab); 
              // toggleFilters();
              }}
          >
            <Text style={[
              styles.filterButtonText,
              selectedValue === option && styles.filterButtonTextSelected
            ]}>
              {option}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  const renderFormationItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.formationItem} 
      onPress={() => navigation.navigate('Formation', { formationId: item.id, role: {isAdmin: isAdmin, isFormateur: isFormateur} })}
    >
      <View style={styles.formationContent}>
        <Image source={{ uri: item.image }} style={styles.formationImage} />
        <View style={styles.formationDetails}>
          <Text style={styles.formationTitle}>{item.title}</Text>
          <Text>Date: {item.date}</Text>
          <Text>Lieu: {item.lieu}</Text>
          <Text>Tarif étudiant DIU: {item.tarifEtudiant} €</Text>
          <Text>Tarif médecin: {item.tarifMedecin} €</Text>
          {userDemandes[item.id] && (
            <Text style={styles.validationStatus}>
              Inscription: {userDemandes[item.id].admin}
            </Text>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Chargement des formations...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {isUpdateAvailable && (
        <TouchableOpacity style={styles.updateBanner} onPress={openAppStore}>
          <Text style={styles.updateBannerText}>Une mise à jour est disponible !</Text>
        </TouchableOpacity>
      )}
      <View style={styles.tabContainer}>
        {(isFormateur?['Visibles', "J'y suis inscrit", 'Je propose', 'Cachées']
        :(isLoggedIn?['Visibles', "J'y suis inscrit"]:['Visibles'])).map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[styles.tab, activeTab === tab && styles.activeTab]}
            onPress={() => {
              setActiveTab(tab);
              applyFilters(tab)
            }}
          >
            <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>{tab}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity style={styles.filterToggleButton} onPress={toggleFilters}>
        <Text style={styles.filterToggleButtonText}>Filtres de recherche</Text>
        <Ionicons name={showFilters ? "chevron-up" : "chevron-down"} size={24} color="white" />
      </TouchableOpacity>

      <Animated.View style={[styles.filtersContainer, { height: filterHeight }]}>
      <TouchableOpacity style={styles.applyFilterButton} onPress={() => { applyFilters(); toggleFilters(); }}>
            <Text style={styles.applyFilterButtonText}>Lancer ma recherche</Text>
          </TouchableOpacity>
        <ScrollView>
          {renderFilterButtons('Domaine', categoryOptions, categoryFilter, setCategoryFilter)}
          {renderFilterButtons('Année conseillée', anneeOptions, anneeFilter, setAnneeFilter)}
          {renderFilterButtons('Lieu', lieuOptions, lieuFilter, setLieuFilter)}
          
          {renderFilterButtons('Region', regionOptions, regionFilter, setRegionFilter)}
          
          

        </ScrollView>
      </Animated.View>

      <FlatList
        data={filteredFormations}
        renderItem={renderFormationItem}
        keyExtractor={item => item.id}
        style={styles.list}
      />

      {isFormateur && (
        <TouchableOpacity 
          style={styles.newFormationButton}
          onPress={() => navigation.navigate('AjoutFormation')}
        >
          <Text style={styles.newFormationButtonText}>+</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  formationItem: {
    marginBottom: 20,
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
    elevation: 4,
  },
  formationContent: {
    flexDirection: 'row',
  },
  formationImage: {
    width: 120,
    height: 180,
    borderRadius: 30,
    marginRight: 15,
  },
  formationDetails: {
    flex: 1,
  },
  formationTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  filtersContainer: {
    overflow: 'hidden',
    marginBottom: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 5,
  },
  filterButton: {
    backgroundColor: 'white',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    margin: 4,
    borderWidth: 1,
    borderColor: '#1a53ff',
  },  
  filterButtonText: {
    color: '#1a53ff',
  },
  applyFilterButton: {
    backgroundColor: 'black',
    padding: 10,
    borderRadius: 20,
    // width:200,
    alignItems: 'center',
    // marginTop: 5,
    marginHorizontal: 10,

  },
  applyFilterButtonText: {
    color: 'white',
    fontSize: 16,
  },
  container: {
    flex: 1,
    padding: 10,
  },
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 10,
  },
  tab: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  activeTab: {
    backgroundColor: '#1a53ff',
  },
  tabText: {
    color: '#333',
  },
  activeTabText: {
    color: 'white',
  },
  // filterButton: {
  //   flexDirection: 'row',
  //   justifyContent: 'space-between',
  //   alignItems: 'center',
  //   backgroundColor: '#1a53ff',
  //   padding: 10,
  //   borderRadius: 5,
  //   marginBottom: 10,
  // },
  // filterButtonText: {
  //   color: 'white',
  //   fontSize: 16,
  // },
  // filtersContainer: {
  //   overflow: 'hidden',
  //   marginBottom: 10,
  // },
  picker: {
    height: 40,
    marginBottom: 5,
  },
  // applyFilterButton: {
  //   backgroundColor: '#1a53ff',
  //   padding: 10,
  //   borderRadius: 5,
  //   alignItems: 'center',
  // },
  // applyFilterButtonText: {
  //   color: 'white',
  //   fontSize: 16,
  // },
  list: {
    flex: 1,
  },
  newFormationButton: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    backgroundColor: '#1a53ff',
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  newFormationButtonText: {
    color: 'white',
    fontSize: 35,
    fontWeight: '200',
  },
  // formationTitle: {
  //   fontSize: 18,
  //   fontWeight: 'bold',
  //   marginBottom: 5,
  // },
  // formationImage: {
  //   width: '100%',
  //   height: 150,
  //   marginBottom: 10,
  //   borderRadius: 5,
  // },

  
  filterToggleButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#1a53ff',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
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
  validationStatus: {
    marginTop: 5,
    fontWeight: 'bold',
    color: '#1a53ff',
  },
  logoutButton: {
    marginRight: 10,
  },
  logoutButtonText: {
    color: '#fff',
    fontSize: 16,
  },

});

export default RechercheFormationsScreen;
