import React, { useState, useEffect, useContext } from 'react';
import { StyleSheet, View, Dimensions, Alert, TouchableOpacity, Text } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import { AccessibilityContext } from '../context/AccessibilityContext';
import { stationsData } from '../data/stationsData';

export default function MapScreen({ navigation }) {
  const [location, setLocation] = useState(null);
  const [selectedFilter, setSelectedFilter] = useState('all');
  const { settings } = useContext(AccessibilityContext);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission denied', 'Allow location access to show your position on map');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
    })();
  }, []);

  const getFilteredStations = () => {
    if (selectedFilter === 'all') return stationsData;
    
    return stationsData.filter(station => {
      switch (selectedFilter) {
        case 'wheelchair':
          return station.accessibility.wheelchair;
        case 'elevators':
          return station.accessibility.elevators;
        case 'issues':
          return station.issues.length > 0;
        default:
          return true;
      }
    });
  };

  const getMarkerColor = (station) => {
    if (station.issues.length > 0) return 'red';
    if (station.accessibility.wheelchair && station.accessibility.elevators) return 'green';
    if (station.accessibility.wheelchair) return 'orange';
    return 'red';
  };

  return (
    <View style={styles.container}>
      {/* Filter Controls */}
      <View style={styles.filterContainer}>
        <TouchableOpacity
          style={[styles.filterButton, selectedFilter === 'all' && styles.activeFilter]}
          onPress={() => setSelectedFilter('all')}
          accessible={true}
          accessibilityLabel="Show all stations"
        >
          <Text style={[styles.filterText, selectedFilter === 'all' && styles.activeFilterText]}>
            All
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterButton, selectedFilter === 'wheelchair' && styles.activeFilter]}
          onPress={() => setSelectedFilter('wheelchair')}
          accessible={true}
          accessibilityLabel="Show wheelchair accessible stations only"
        >
          <Ionicons name="accessibility" size={16} color={selectedFilter === 'wheelchair' ? 'white' : '#2b8a3e'} />
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterButton, selectedFilter === 'elevators' && styles.activeFilter]}
          onPress={() => setSelectedFilter('elevators')}
          accessible={true}
          accessibilityLabel="Show stations with elevators only"
        >
          <Ionicons name="apps" size={16} color={selectedFilter === 'elevators' ? 'white' : '#2b8a3e'} />
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterButton, selectedFilter === 'issues' && styles.activeFilter]}
          onPress={() => setSelectedFilter('issues')}
          accessible={true}
          accessibilityLabel="Show stations with reported issues"
        >
          <Ionicons name="warning" size={16} color={selectedFilter === 'issues' ? 'white' : '#d63384'} />
        </TouchableOpacity>
      </View>

      <MapView
        style={styles.map}
        initialRegion={{
          latitude: 18.5204,
          longitude: 73.8567,
          latitudeDelta: 0.07,
          longitudeDelta: 0.07,
        }}
        showsUserLocation={true}
        showsMyLocationButton={true}
      >
        {getFilteredStations().map(station => (
          <Marker
            key={station.id}
            coordinate={station.coords}
            title={station.name}
            description={station.description}
            pinColor={getMarkerColor(station)}
            onPress={() => navigation.navigate('StationDetails', { station })}
          />
        ))}
      </MapView>

      {/* Legend */}
      <View style={styles.legendContainer}>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: 'green' }]} />
          <Text style={styles.legendText}>Fully Accessible</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: 'orange' }]} />
          <Text style={styles.legendText}>Partially Accessible</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: 'red' }]} />
          <Text style={styles.legendText}>Issues Reported</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { 
    width: Dimensions.get('window').width, 
    height: Dimensions.get('window').height - 150
  },
  filterContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 10,
    paddingHorizontal: 15,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  filterButton: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#2b8a3e',
    backgroundColor: 'white',
  },
  activeFilter: {
    backgroundColor: '#2b8a3e',
  },
  filterText: {
    color: '#2b8a3e',
    fontWeight: '600',
    fontSize: 12,
  },
  activeFilterText: {
    color: 'white',
  },
  legendContainer: {
    position: 'absolute',
    bottom: 20,
    left: 15,
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 8,
    elevation: 3,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 2,
  },
  legendDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  legendText: {
    fontSize: 12,
    color: '#333',
  },
});