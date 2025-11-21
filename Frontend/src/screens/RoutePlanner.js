import React, { useState, useContext, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AccessibilityContext } from '../context/AccessibilityContext';
import { stationsData } from '../data/stationsData';
import { getStationsWithFallback } from '../services/api';

export default function RoutePlanner({ route }) {
  const [start, setStart] = useState('');
  const [end, setEnd] = useState(route?.params?.destination || '');
  const [accessibilityFilters, setAccessibilityFilters] = useState({
    wheelchair: false,
    elevators: false,
    audioAnnouncements: false,
    brailleSignage: false,
  });
  const [routeResult, setRouteResult] = useState(null);
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

  // Set accessibility filters when passed from StationDetails
  useEffect(() => {
    if (route?.params?.accessibilityFilters) {
      setAccessibilityFilters(route.params.accessibilityFilters);
    }
  }, [route?.params?.accessibilityFilters]);

  const findAccessibleRoute = () => {
    if (!start.trim() || !end.trim()) {
      Alert.alert('Error', 'Please enter both start and destination stations');
      return;
    }

    const startStation = stations.find(s => 
      s.name.toLowerCase().includes(start.toLowerCase())
    );
    const endStation = stations.find(s => 
      s.name.toLowerCase().includes(end.toLowerCase())
    );

    if (!startStation || !endStation) {
      Alert.alert('Error', 'Could not find one or both stations. Please check station names.');
      setRouteResult({
        error: true,
        message: '⚠️ Station not found. Available stations: ' + stations.map(s => s.name).join(', ')
      });
      return;
    }

    if (startStation.id === endStation.id) {
      Alert.alert('Error', 'Start and destination cannot be the same');
      return;
    }

    // Check accessibility requirements
    let accessibilityIssues = [];
    let accessibilityWarnings = [];

    if (accessibilityFilters.wheelchair) {
      if (!startStation.accessibility.wheelchair) accessibilityIssues.push(`${startStation.name} is not wheelchair accessible`);
      if (!endStation.accessibility.wheelchair) accessibilityIssues.push(`${endStation.name} is not wheelchair accessible`);
    }

    if (accessibilityFilters.elevators) {
      if (!startStation.accessibility.elevators) accessibilityWarnings.push(`${startStation.name} has no elevators`);
      if (!endStation.accessibility.elevators) accessibilityWarnings.push(`${endStation.name} has no elevators`);
    }

    if (accessibilityFilters.audioAnnouncements) {
      if (!startStation.accessibility.audioAnnouncements) accessibilityWarnings.push(`${startStation.name} lacks audio announcements`);
      if (!endStation.accessibility.audioAnnouncements) accessibilityWarnings.push(`${endStation.name} lacks audio announcements`);
    }

    if (accessibilityFilters.brailleSignage) {
      if (!startStation.accessibility.brailleSignage) accessibilityWarnings.push(`${startStation.name} lacks braille signage`);
      if (!endStation.accessibility.brailleSignage) accessibilityWarnings.push(`${endStation.name} lacks braille signage`);
    }

    // Calculate estimated time and distance (simplified)
    const distance = Math.sqrt(
      Math.pow(endStation.coords.latitude - startStation.coords.latitude, 2) +
      Math.pow(endStation.coords.longitude - startStation.coords.longitude, 2)
    ) * 111; // Rough conversion to km

    const estimatedTime = Math.round(distance * 10); // Rough time estimate in minutes

    // Check for reported issues
    const startIssues = startStation.issues || [];
    const endIssues = endStation.issues || [];

    setRouteResult({
      startStation,
      endStation,
      distance: distance.toFixed(1),
      estimatedTime,
      accessibilityIssues,
      accessibilityWarnings,
      currentIssues: [...startIssues, ...endIssues],
      canProceed: accessibilityIssues.length === 0,
    });
  };

  const AccessibilityFilter = ({ filterKey, icon, label }) => (
    <TouchableOpacity
      style={[
        styles.filterOption,
        accessibilityFilters[filterKey] && styles.selectedFilter
      ]}
      onPress={() => setAccessibilityFilters(prev => ({
        ...prev,
        [filterKey]: !prev[filterKey]
      }))}
      accessible={true}
      accessibilityLabel={`${accessibilityFilters[filterKey] ? 'Remove' : 'Add'} ${label} requirement`}
    >
      <Ionicons 
        name={icon} 
        size={20} 
        color={accessibilityFilters[filterKey] ? 'white' : '#2b8a3e'} 
      />
      <Text style={[
        styles.filterText,
        accessibilityFilters[filterKey] && styles.selectedFilterText,
        settings.largeText && styles.largeFilterText
      ]}>
        {label}
      </Text>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <ActivityIndicator size="large" color="#2b8a3e" />
        <Text style={styles.loadingText}>Loading stations...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={[styles.title, settings.largeText && styles.largeTitle]}>
        Accessible Route Planner
      </Text>

      {/* Station Inputs */}
      <View style={styles.inputContainer}>
        <Text style={[styles.label, settings.largeText && styles.largeLabel]}>From:</Text>
        <TextInput
          style={[
            styles.input,
            settings.largeText && styles.largeInput,
            settings.highContrast && styles.highContrastInput
          ]}
          placeholder="Enter start station (e.g., Pune Junction)"
          value={start}
          onChangeText={setStart}
          accessible={true}
          accessibilityLabel="Enter starting station name"
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={[styles.label, settings.largeText && styles.largeLabel]}>To:</Text>
        <TextInput
          style={[
            styles.input,
            settings.largeText && styles.largeInput,
            settings.highContrast && styles.highContrastInput
          ]}
          placeholder="Enter destination station (e.g., Swargate)"
          value={end}
          onChangeText={setEnd}
          accessible={true}
          accessibilityLabel="Enter destination station name"
        />
      </View>

      {/* Accessibility Filters */}
      <Text style={[styles.sectionTitle, settings.largeText && styles.largeSectionTitle]}>
        Accessibility Requirements
      </Text>

      <View style={styles.filtersContainer}>
        <AccessibilityFilter 
          filterKey="wheelchair" 
          icon="accessibility" 
          label="Wheelchair Access Required" 
        />
        <AccessibilityFilter 
          filterKey="elevators" 
          icon="apps" 
          label="Elevators Required" 
        />
        <AccessibilityFilter 
          filterKey="audioAnnouncements" 
          icon="volume-high" 
          label="Audio Announcements" 
        />
        <AccessibilityFilter 
          filterKey="brailleSignage" 
          icon="hand-left" 
          label="Braille Signage" 
        />
      </View>

      {/* Find Route Button */}
      <TouchableOpacity 
        style={[styles.findButton, settings.largeText && styles.largeFindButton]}
        onPress={findAccessibleRoute}
        accessible={true}
        accessibilityLabel="Find accessible route with selected requirements"
      >
        <Ionicons name="search" size={20} color="white" />
        <Text style={[styles.findButtonText, settings.largeText && styles.largeFindButtonText]}>
          Find Accessible Route
        </Text>
      </TouchableOpacity>

      {/* Route Results */}
      {routeResult && (
        <View style={styles.resultContainer}>
          {routeResult.error ? (
            <View style={styles.errorContainer}>
              <Ionicons name="warning" size={24} color="#dc3545" />
              <Text style={[styles.errorText, settings.largeText && styles.largeErrorText]}>
                {routeResult.message}
              </Text>
            </View>
          ) : (
            <>
              {/* Route Summary */}
              <View style={styles.routeSummary}>
                <Text style={[styles.routeTitle, settings.largeText && styles.largeRouteTitle]}>
                  Route: {routeResult.startStation.name} → {routeResult.endStation.name}
                </Text>
                <View style={styles.routeInfo}>
                  <View style={styles.infoItem}>
                    <Ionicons name="location" size={16} color="#666" />
                    <Text style={[styles.infoText, settings.largeText && styles.largeInfoText]}>
                      {routeResult.distance} km
                    </Text>
                  </View>
                  <View style={styles.infoItem}>
                    <Ionicons name="time" size={16} color="#666" />
                    <Text style={[styles.infoText, settings.largeText && styles.largeInfoText]}>
                      ~{routeResult.estimatedTime} min
                    </Text>
                  </View>
                </View>
              </View>

              {/* Accessibility Status */}
              {routeResult.canProceed ? (
                <View style={styles.successContainer}>
                  <Ionicons name="checkmark-circle" size={24} color="#28a745" />
                  <Text style={[styles.successText, settings.largeText && styles.largeSuccessText]}>
                    ✅ Route meets all accessibility requirements
                  </Text>
                </View>
              ) : (
                <View style={styles.warningContainer}>
                  <Ionicons name="warning" size={24} color="#dc3545" />
                  <Text style={[styles.warningTitle, settings.largeText && styles.largeWarningTitle]}>
                    Accessibility Issues Found:
                  </Text>
                  {routeResult.accessibilityIssues.map((issue, index) => (
                    <Text key={index} style={[styles.issueText, settings.largeText && styles.largeIssueText]}>
                      • {issue}
                    </Text>
                  ))}
                </View>
              )}

              {/* Accessibility Warnings */}
              {routeResult.accessibilityWarnings.length > 0 && (
                <View style={styles.cautionContainer}>
                  <Ionicons name="alert-circle" size={20} color="#ffc107" />
                  <Text style={[styles.cautionTitle, settings.largeText && styles.largeCautionTitle]}>
                    Please Note:
                  </Text>
                  {routeResult.accessibilityWarnings.map((warning, index) => (
                    <Text key={index} style={[styles.warningText, settings.largeText && styles.largeWarningText]}>
                      • {warning}
                    </Text>
                  ))}
                </View>
              )}

              {/* Current Issues */}
              {routeResult.currentIssues.length > 0 && (
                <View style={styles.issuesContainer}>
                  <Ionicons name="flag" size={20} color="#dc3545" />
                  <Text style={[styles.issuesTitle, settings.largeText && styles.largeIssuesTitle]}>
                    Current Reported Issues:
                  </Text>
                  {routeResult.currentIssues.map((issue, index) => (
                    <Text key={index} style={[styles.currentIssueText, settings.largeText && styles.largeCurrentIssueText]}>
                      • {issue}
                    </Text>
                  ))}
                </View>
              )}

              {/* Alternative Suggestions */}
              {!routeResult.canProceed && (
                <View style={styles.suggestionsContainer}>
                  <Text style={[styles.suggestionTitle, settings.largeText && styles.largeSuggestionTitle]}>
                    💡 Suggestions:
                  </Text>
                  <Text style={[styles.suggestionText, settings.largeText && styles.largeSuggestionText]}>
                    • Consider alternative stations with better accessibility
                  </Text>
                  <Text style={[styles.suggestionText, settings.largeText && styles.largeSuggestionText]}>
                    • Contact transit authority for assistance: Emergency tab
                  </Text>
                  <Text style={[styles.suggestionText, settings.largeText && styles.largeSuggestionText]}>
                    • Check for recent updates on reported issues
                  </Text>
                </View>
              )}
            </>
          )}
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    padding: 16, 
    backgroundColor: 'white' 
  },
  title: { 
    fontSize: 24, 
    fontWeight: 'bold', 
    marginBottom: 24,
    color: '#333',
    textAlign: 'center'
  },
  largeTitle: {
    fontSize: 30,
  },
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#333',
  },
  largeLabel: {
    fontSize: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 12,
    borderRadius: 8,
    fontSize: 16,
    backgroundColor: '#fafafa',
  },
  largeInput: {
    fontSize: 18,
    padding: 16,
  },
  highContrastInput: {
    borderWidth: 2,
    borderColor: '#000',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 12,
    color: '#333',
  },
  largeSectionTitle: {
    fontSize: 22,
  },
  filtersContainer: {
    marginBottom: 20,
  },
  filterOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#2b8a3e',
    borderRadius: 8,
    backgroundColor: 'white',
  },
  selectedFilter: {
    backgroundColor: '#2b8a3e',
  },
  filterText: {
    marginLeft: 12,
    fontSize: 14,
    color: '#2b8a3e',
    flex: 1,
  },
  selectedFilterText: {
    color: 'white',
  },
  largeFilterText: {
    fontSize: 16,
  },
  findButton: {
    backgroundColor: '#2b8a3e',
    padding: 16,
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  largeFindButton: {
    padding: 20,
  },
  findButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  largeFindButtonText: {
    fontSize: 22,
  },
  resultContainer: {
    backgroundColor: '#f8f9fa',
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
  },
  routeSummary: {
    marginBottom: 16,
  },
  routeTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  largeRouteTitle: {
    fontSize: 22,
  },
  routeInfo: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoText: {
    marginLeft: 4,
    fontSize: 14,
    color: '#666',
  },
  largeInfoText: {
    fontSize: 16,
  },
  successContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#d1eddb',
    borderRadius: 8,
    marginBottom: 12,
  },
  successText: {
    marginLeft: 8,
    fontSize: 16,
    color: '#155724',
    flex: 1,
  },
  largeSuccessText: {
    fontSize: 18,
  },
  warningContainer: {
    padding: 12,
    backgroundColor: '#f8d7da',
    borderRadius: 8,
    marginBottom: 12,
  },
  warningTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#721c24',
    marginBottom: 8,
  },
  largeWarningTitle: {
    fontSize: 18,
  },
  issueText: {
    fontSize: 14,
    color: '#721c24',
    marginBottom: 4,
  },
  largeIssueText: {
    fontSize: 16,
  },
  cautionContainer: {
    padding: 12,
    backgroundColor: '#fff3cd',
    borderRadius: 8,
    marginBottom: 12,
  },
  cautionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#856404',
    marginBottom: 8,
  },
  largeCautionTitle: {
    fontSize: 18,
  },
  warningText: {
    fontSize: 14,
    color: '#856404',
    marginBottom: 4,
  },
  largeWarningText: {
    fontSize: 16,
  },
  issuesContainer: {
    padding: 12,
    backgroundColor: '#f8d7da',
    borderRadius: 8,
    marginBottom: 12,
  },
  issuesTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#721c24',
    marginBottom: 8,
  },
  largeIssuesTitle: {
    fontSize: 18,
  },
  currentIssueText: {
    fontSize: 14,
    color: '#721c24',
    marginBottom: 4,
  },
  largeCurrentIssueText: {
    fontSize: 16,
  },
  suggestionsContainer: {
    padding: 12,
    backgroundColor: '#cce5ff',
    borderRadius: 8,
  },
  suggestionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#004085',
    marginBottom: 8,
  },
  largeSuggestionTitle: {
    fontSize: 18,
  },
  suggestionText: {
    fontSize: 14,
    color: '#004085',
    marginBottom: 4,
  },
  largeSuggestionText: {
    fontSize: 16,
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 12,
    backgroundColor: '#f8d7da',
    borderRadius: 8,
  },
  errorText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#721c24',
    flex: 1,
  },
  largeErrorText: {
    fontSize: 16,
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