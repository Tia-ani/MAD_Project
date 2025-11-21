import React, { useState, useContext, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, TextInput, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AccessibilityContext } from '../context/AccessibilityContext';
import { stationsData } from '../data/stationsData';
import { getStationsWithFallback } from '../services/api';

export default function StationList({ navigation }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [stations, setStations] = useState([]);
  const [loading, setLoading] = useState(true);
  const { settings } = useContext(AccessibilityContext);

  useEffect(() => {
    loadStations();
  }, []);

  const loadStations = async () => {
    try {
      setLoading(true);
      const fetchedStations = await getStationsWithFallback(stationsData);
      setStations(fetchedStations);
    } catch (error) {
      console.error('Error loading stations:', error);
      setStations(stationsData); // Fallback to local data
    } finally {
      setLoading(false);
    }
  };

  const getFilteredStations = () => {
    let filtered = stations.filter(station =>
      station.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      station.description.toLowerCase().includes(searchQuery.toLowerCase())
    );

    switch (filterType) {
      case 'accessible':
        return filtered.filter(s => s.accessibility.wheelchair && s.accessibility.elevators);
      case 'issues':
        return filtered.filter(s => s.issues.length > 0);
      case 'partial':
        return filtered.filter(s => s.accessibility.wheelchair && !s.accessibility.elevators);
      default:
        return filtered;
    }
  };

  const getAccessibilityIcon = (station) => {
    if (station.issues.length > 0) return { name: 'warning', color: '#dc3545' };
    if (station.accessibility.wheelchair && station.accessibility.elevators) return { name: 'checkmark-circle', color: '#28a745' };
    if (station.accessibility.wheelchair) return { name: 'alert-circle', color: '#ffc107' };
    return { name: 'close-circle', color: '#dc3545' };
  };

  const renderStation = ({ item }) => {
    const accessibilityIcon = getAccessibilityIcon(item);
    
    return (
      <TouchableOpacity
        style={styles.stationItem}
        onPress={() => navigation.navigate('StationDetails', { station: item })}
        accessible={true}
        accessibilityLabel={`${item.name}, ${item.description}`}
      >
        <View style={styles.stationHeader}>
          <Text style={[styles.stationName, settings.largeText && styles.largeStationName]}>
            {item.name}
          </Text>
          <Ionicons 
            name={accessibilityIcon.name} 
            size={24} 
            color={accessibilityIcon.color} 
          />
        </View>
        
        <Text style={[styles.stationDescription, settings.largeText && styles.largeStationDescription]}>
          {item.description}
        </Text>
        
        <View style={styles.accessibilityRow}>
          <View style={styles.accessibilityIcons}>
            <Ionicons 
              name="accessibility" 
              size={16} 
              color={item.accessibility.wheelchair ? '#28a745' : '#999'} 
            />
            <Ionicons 
              name="apps" 
              size={16} 
              color={item.accessibility.elevators ? '#28a745' : '#999'} 
            />
            <Ionicons 
              name="volume-high" 
              size={16} 
              color={item.accessibility.audioAnnouncements ? '#28a745' : '#999'} 
            />
          </View>
          
          {item.issues.length > 0 && (
            <Text style={styles.issueCount}>
              {item.issues.length} issue{item.issues.length !== 1 ? 's' : ''}
            </Text>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#666" style={styles.searchIcon} />
        <TextInput
          style={[
            styles.searchInput,
            settings.largeText && styles.largeSearchInput,
            settings.highContrast && styles.highContrastInput
          ]}
          placeholder="Search stations..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          accessible={true}
          accessibilityLabel="Search for stations"
        />
      </View>

      {/* Filter Buttons */}
      <View style={styles.filterContainer}>
        <TouchableOpacity
          style={[styles.filterButton, filterType === 'all' && styles.activeFilter]}
          onPress={() => setFilterType('all')}
          accessible={true}
          accessibilityLabel="Show all stations"
        >
          <Text style={[styles.filterText, filterType === 'all' && styles.activeFilterText]}>
            All
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterButton, filterType === 'accessible' && styles.activeFilter]}
          onPress={() => setFilterType('accessible')}
          accessible={true}
          accessibilityLabel="Show fully accessible stations only"
        >
          <Text style={[styles.filterText, filterType === 'accessible' && styles.activeFilterText]}>
            Accessible
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterButton, filterType === 'partial' && styles.activeFilter]}
          onPress={() => setFilterType('partial')}
          accessible={true}
          accessibilityLabel="Show partially accessible stations"
        >
          <Text style={[styles.filterText, filterType === 'partial' && styles.activeFilterText]}>
            Partial
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterButton, filterType === 'issues' && styles.activeFilter]}
          onPress={() => setFilterType('issues')}
          accessible={true}
          accessibilityLabel="Show stations with reported issues"
        >
          <Text style={[styles.filterText, filterType === 'issues' && styles.activeFilterText]}>
            Issues
          </Text>
        </TouchableOpacity>
      </View>

      {/* Station List */}
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#2b8a3e" />
          <Text style={styles.loadingText}>Loading stations...</Text>
        </View>
      ) : (
        <FlatList
          data={getFilteredStations()}
          renderItem={renderStation}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
          refreshing={false}
          onRefresh={loadStations}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: 16,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  largeSearchInput: {
    fontSize: 18,
  },
  highContrastInput: {
    backgroundColor: 'white',
    borderWidth: 2,
    borderColor: '#000',
  },
  filterContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  filterButton: {
    paddingHorizontal: 16,
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
    fontSize: 14,
  },
  activeFilterText: {
    color: 'white',
  },
  listContainer: {
    paddingHorizontal: 16,
  },
  stationItem: {
    backgroundColor: 'white',
    padding: 16,
    marginVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    elevation: 2,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  stationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  stationName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
  },
  largeStationName: {
    fontSize: 22,
  },
  stationDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
    lineHeight: 20,
  },
  largeStationDescription: {
    fontSize: 16,
    lineHeight: 24,
  },
  accessibilityRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  accessibilityIcons: {
    flexDirection: 'row',
    gap: 12,
  },
  issueCount: {
    fontSize: 12,
    color: '#dc3545',
    fontWeight: '500',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 50,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
});