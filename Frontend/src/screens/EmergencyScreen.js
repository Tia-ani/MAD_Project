import React, { useContext } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Alert, Linking } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AccessibilityContext } from '../context/AccessibilityContext';

export default function EmergencyScreen({ navigation }) {
  const { settings } = useContext(AccessibilityContext);

  const emergencyContacts = [
    {
      id: 'transit_authority',
      name: 'Pune Transit Authority',
      number: '+91-20-2612-7394',
      description: 'Main helpline for transit issues and accessibility support',
      icon: 'train',
      color: '#2b8a3e',
    },
    {
      id: 'accessibility_help',
      name: 'Accessibility Support',
      number: '+91-20-2555-1234',
      description: 'Dedicated accessibility assistance helpline',
      icon: 'accessibility',
      color: '#0d6efd',
    },
    {
      id: 'emergency_medical',
      name: 'Emergency Medical',
      number: '108',
      description: 'Medical emergency services',
      icon: 'medical',
      color: '#dc3545',
    },
    {
      id: 'police',
      name: 'Police Emergency',
      number: '100',
      description: 'Police emergency services',
      icon: 'shield',
      color: '#6f42c1',
    },
    {
      id: 'fire_rescue',
      name: 'Fire & Rescue',
      number: '101',
      description: 'Fire and rescue emergency services',
      icon: 'flame',
      color: '#fd7e14',
    },
    {
      id: 'disability_helpline',
      name: 'Disability Rights Helpline',
      number: '+91-11-2338-7896',
      description: 'Rights advocacy and support for people with disabilities',
      icon: 'heart',
      color: '#e91e63',
    },
  ];

  const quickActions = [
    {
      id: 'location_share',
      title: 'Share My Location',
      description: 'Send current location to emergency contacts',
      icon: 'location',
      color: '#17a2b8',
      action: () => shareLocation(),
    },
    {
      id: 'assistance_request',
      title: 'Request Station Assistance',
      description: 'Alert station staff for immediate help',
      icon: 'people',
      color: '#28a745',
      action: () => requestAssistance(),
    },
    {
      id: 'report_emergency',
      title: 'Report Emergency Issue',
      description: 'Report urgent accessibility or safety issue',
      icon: 'warning',
      color: '#dc3545',
      action: () => reportEmergencyIssue(),
    },
  ];

  const makeCall = (number, name) => {
    Alert.alert(
      'Call Emergency Contact',
      `Do you want to call ${name} at ${number}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Call',
          onPress: () => {
            Linking.openURL(`tel:${number}`).catch(err => {
              Alert.alert('Error', 'Unable to make phone call');
              console.error('Error making call:', err);
            });
          },
        },
      ]
    );
  };

  const shareLocation = () => {
    // In a real app, this would get actual location and share it
    Alert.alert(
      'Share Location',
      'Your current location will be shared with emergency contacts via SMS',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Share',
          onPress: () => {
            Alert.alert('Success', 'Location shared successfully');
          },
        },
      ]
    );
  };

  const requestAssistance = () => {
    Alert.alert(
      'Request Station Assistance',
      'Station staff will be notified of your request for assistance. Please specify your location.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Send Request',
          onPress: () => {
            Alert.alert('Request Sent', 'Station staff have been notified and will assist you shortly');
          },
        },
      ]
    );
  };

  const reportEmergencyIssue = () => {
    navigation.goBack();
    navigation.navigate('Map', {
      screen: 'ReportIssue',
    });
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Ionicons name="shield-checkmark" size={40} color="#dc3545" />
        <Text style={[styles.title, settings.largeText && styles.largeTitle]}>
          Emergency Assistance
        </Text>
        <Text style={[styles.subtitle, settings.largeText && styles.largeSubtitle]}>
          Quick access to help and emergency services
        </Text>
      </View>

      {/* Quick Actions */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, settings.largeText && styles.largeSectionTitle]}>
          Quick Actions
        </Text>
        {quickActions.map((action) => (
          <TouchableOpacity
            key={action.id}
            style={[styles.actionCard, { borderLeftColor: action.color }]}
            onPress={action.action}
            accessible={true}
            accessibilityLabel={`${action.title}: ${action.description}`}
          >
            <View style={[styles.actionIcon, { backgroundColor: action.color }]}>
              <Ionicons name={action.icon} size={24} color="white" />
            </View>
            <View style={styles.actionContent}>
              <Text style={[styles.actionTitle, settings.largeText && styles.largeActionTitle]}>
                {action.title}
              </Text>
              <Text style={[styles.actionDescription, settings.largeText && styles.largeActionDescription]}>
                {action.description}
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#999" />
          </TouchableOpacity>
        ))}
      </View>

      {/* Emergency Contacts */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, settings.largeText && styles.largeSectionTitle]}>
          Emergency Contacts
        </Text>
        {emergencyContacts.map((contact) => (
          <TouchableOpacity
            key={contact.id}
            style={styles.contactCard}
            onPress={() => makeCall(contact.number, contact.name)}
            accessible={true}
            accessibilityLabel={`Call ${contact.name} at ${contact.number}. ${contact.description}`}
          >
            <View style={[styles.contactIcon, { backgroundColor: contact.color }]}>
              <Ionicons name={contact.icon} size={28} color="white" />
            </View>
            <View style={styles.contactContent}>
              <Text style={[styles.contactName, settings.largeText && styles.largeContactName]}>
                {contact.name}
              </Text>
              <Text style={[styles.contactNumber, settings.largeText && styles.largeContactNumber]}>
                {contact.number}
              </Text>
              <Text style={[styles.contactDescription, settings.largeText && styles.largeContactDescription]}>
                {contact.description}
              </Text>
            </View>
            <View style={styles.callButton}>
              <Ionicons name="call" size={24} color={contact.color} />
            </View>
          </TouchableOpacity>
        ))}
      </View>

      {/* Safety Tips */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, settings.largeText && styles.largeSectionTitle]}>
          🛡️ Safety Tips
        </Text>
        <View style={styles.tipsContainer}>
          <View style={styles.tipItem}>
            <Ionicons name="information-circle" size={20} color="#0d6efd" />
            <Text style={[styles.tipText, settings.largeText && styles.largeTipText]}>
              Always inform someone about your travel plans
            </Text>
          </View>
          <View style={styles.tipItem}>
            <Ionicons name="information-circle" size={20} color="#0d6efd" />
            <Text style={[styles.tipText, settings.largeText && styles.largeTipText]}>
              Keep your phone charged and accessible
            </Text>
          </View>
          <View style={styles.tipItem}>
            <Ionicons name="information-circle" size={20} color="#0d6efd" />
            <Text style={[styles.tipText, settings.largeText && styles.largeTipText]}>
              If you feel unsafe, don't hesitate to contact station staff
            </Text>
          </View>
          <View style={styles.tipItem}>
            <Ionicons name="information-circle" size={20} color="#0d6efd" />
            <Text style={[styles.tipText, settings.largeText && styles.largeTipText]}>
              Report accessibility issues to help other travelers
            </Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  header: {
    alignItems: 'center',
    padding: 24,
    backgroundColor: '#fff5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 12,
    color: '#333',
  },
  largeTitle: {
    fontSize: 30,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 8,
    textAlign: 'center',
  },
  largeSubtitle: {
    fontSize: 16,
  },
  section: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
  },
  largeSectionTitle: {
    fontSize: 24,
  },
  actionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    marginBottom: 12,
    backgroundColor: 'white',
    borderRadius: 12,
    borderLeftWidth: 4,
    elevation: 2,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  actionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  actionContent: {
    flex: 1,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  largeActionTitle: {
    fontSize: 18,
  },
  actionDescription: {
    fontSize: 13,
    color: '#666',
  },
  largeActionDescription: {
    fontSize: 15,
  },
  contactCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    marginBottom: 12,
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  contactIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  contactContent: {
    flex: 1,
  },
  contactName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  largeContactName: {
    fontSize: 18,
  },
  contactNumber: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2b8a3e',
    marginBottom: 4,
  },
  largeContactNumber: {
    fontSize: 18,
  },
  contactDescription: {
    fontSize: 12,
    color: '#666',
  },
  largeContactDescription: {
    fontSize: 14,
  },
  callButton: {
    padding: 8,
  },
  tipsContainer: {
    backgroundColor: '#e7f3ff',
    padding: 16,
    borderRadius: 12,
  },
  tipItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  tipText: {
    flex: 1,
    marginLeft: 12,
    fontSize: 14,
    color: '#004085',
    lineHeight: 20,
  },
  largeTipText: {
    fontSize: 16,
    lineHeight: 24,
  },
});