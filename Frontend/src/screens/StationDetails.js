import React, { useState, useContext, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Speech from 'expo-speech';
import { CommonActions } from '@react-navigation/native';
import { AccessibilityContext } from '../context/AccessibilityContext';

export default function StationDetails({ route, navigation }) {
  const { station } = route.params;
  const [reportedIssues, setReportedIssues] = useState(station.issues || []);
  const { settings } = useContext(AccessibilityContext);

  useEffect(() => {
    if (route.params?.reportedIssue) {
      setReportedIssues(prev => [...prev, route.params.reportedIssue]);
    }
  }, [route.params?.reportedIssue]);

  const speakStationInfo = () => {
    const text = `Station: ${station.name}. ${station.description}. 
                 Wheelchair accessible: ${station.accessibility.wheelchair ? 'Yes' : 'No'}.
                 Elevators available: ${station.accessibility.elevators ? 'Yes' : 'No'}.
                 ${reportedIssues.length > 0 ? `Current issues: ${reportedIssues.join(', ')}` : 'No current issues reported.'}`;
    
    Speech.speak(text, {
      language: 'en-US',
      rate: settings.speechRate || 0.5,
    });
  };

  const AccessibilityFeature = ({ icon, label, available, color = '#2b8a3e' }) => (
    <View style={styles.featureRow}>
      <Ionicons 
        name={icon} 
        size={20} 
        color={available ? color : '#999'} 
      />
      <Text style={[styles.featureText, { color: available ? '#333' : '#999' }]}>
        {label}
      </Text>
      <Ionicons 
        name={available ? 'checkmark-circle' : 'close-circle'} 
        size={20} 
        color={available ? '#28a745' : '#dc3545'} 
      />
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={[styles.title, settings.largeText && styles.largeTitle]}>
          {station.name}
        </Text>
        {settings.audioNavigation && (
          <TouchableOpacity 
            style={styles.speakButton}
            onPress={speakStationInfo}
            accessible={true}
            accessibilityLabel="Read station information aloud"
          >
            <Ionicons name="volume-high" size={24} color="#2b8a3e" />
          </TouchableOpacity>
        )}
      </View>

      <Text style={[styles.description, settings.largeText && styles.largeDescription]}>
        {station.description}
      </Text>

      {/* Accessibility Features */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, settings.largeText && styles.largeSectionTitle]}>
          Accessibility Features
        </Text>
        
        <AccessibilityFeature 
          icon="accessibility" 
          label="Wheelchair Accessible"
          available={station.accessibility.wheelchair}
        />
        <AccessibilityFeature 
          icon="apps" 
          label="Elevators Available"
          available={station.accessibility.elevators}
        />
        <AccessibilityFeature 
          icon="walk" 
          label="Tactile Paving"
          available={station.accessibility.tactilePaving}
        />
        <AccessibilityFeature 
          icon="volume-high" 
          label="Audio Announcements"
          available={station.accessibility.audioAnnouncements}
        />
        <AccessibilityFeature 
          icon="hand-left" 
          label="Braille Signage"
          available={station.accessibility.brailleSignage}
        />
      </View>

      {/* Current Issues */}
      {reportedIssues.length > 0 && (
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, styles.issueTitle, settings.largeText && styles.largeSectionTitle]}>
            ⚠️ Current Issues
          </Text>
          {reportedIssues.map((issue, index) => (
            <View key={index} style={styles.issueItem}>
              <Ionicons name="warning" size={16} color="#dc3545" />
              <Text style={[styles.issueText, settings.largeText && styles.largeIssueText]}>
                {issue}
              </Text>
            </View>
          ))}
        </View>
      )}

      {/* Action Buttons */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          style={[styles.button, styles.reportButton]}
          onPress={() => navigation.navigate('ReportIssue', { station })}
          accessible={true}
          accessibilityLabel="Report an accessibility issue at this station"
        >
          <Ionicons name="flag" size={20} color="white" />
          <Text style={styles.buttonText}>Report Issue</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.button, styles.directionsButton]}
          onPress={() => {
            // Navigate to Route Planner tab
            navigation.dispatch(
              CommonActions.navigate({
                name: 'Route Planner',
                params: { destination: station.name },
              })
            );
          }}
          accessible={true}
          accessibilityLabel="Get directions to this station"
        >
          <Ionicons name="navigate" size={20} color="white" />
          <Text style={styles.buttonText}>Get Directions</Text>
        </TouchableOpacity>
      </View>

      {/* Find Accessible Routes Button */}
      <TouchableOpacity 
        style={[styles.button, styles.accessibleRoutesButton]}
        onPress={() => {
          // Navigate to Route Planner tab with filters
          navigation.dispatch(
            CommonActions.navigate({
              name: 'Route Planner',
              params: {
                destination: station.name,
                accessibilityFilters: {
                  wheelchair: station.accessibility.wheelchair,
                  elevators: station.accessibility.elevators,
                  audioAnnouncements: station.accessibility.audioAnnouncements,
                  brailleSignage: station.accessibility.brailleSignage,
                }
              },
            })
          );
        }}
        accessible={true}
        accessibilityLabel="Find accessible routes to this station with matching accessibility features"
      >
        <Ionicons name="accessibility" size={20} color="white" />
        <Text style={styles.buttonText}>Find Accessible Routes</Text>
      </TouchableOpacity>

      {/* Emergency Button */}
      <TouchableOpacity 
        style={[styles.button, styles.emergencyButton]}
        onPress={() => navigation.navigate('Emergency')}
        accessible={true}
        accessibilityLabel="Access emergency contacts and assistance"
      >
        <Ionicons name="call" size={20} color="white" />
        <Text style={styles.buttonText}>Emergency Assistance</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: 'white',
    padding: 16 
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: { 
    fontSize: 28, 
    fontWeight: 'bold', 
    color: '#333',
    flex: 1,
  },
  largeTitle: {
    fontSize: 36,
  },
  speakButton: {
    padding: 8,
  },
  description: { 
    fontSize: 16, 
    color: '#666',
    marginBottom: 24,
    lineHeight: 24,
  },
  largeDescription: {
    fontSize: 20,
    lineHeight: 30,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
  },
  largeSectionTitle: {
    fontSize: 26,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginVertical: 4,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
  },
  featureText: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
  },
  issueTitle: {
    color: '#dc3545',
  },
  issueItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginVertical: 4,
    backgroundColor: '#fff3cd',
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#dc3545',
  },
  issueText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#856404',
  },
  largeIssueText: {
    fontSize: 18,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    flex: 0.48,
  },
  reportButton: {
    backgroundColor: '#dc3545',
  },
  directionsButton: {
    backgroundColor: '#2b8a3e',
  },
  accessibleRoutesButton: {
    backgroundColor: '#6f42c1',
    marginBottom: 16,
  },
  emergencyButton: {
    backgroundColor: '#fd7e14',
    flex: 1,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    marginLeft: 8,
    fontSize: 16,
  },
});
