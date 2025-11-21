import React, { useState, useContext, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AccessibilityContext } from '../context/AccessibilityContext';
import { useAuth } from '../context/AuthContext';
import { profileAPI } from '../services/api';
import { stationAPI } from '../services/api';

export default function ProfileScreen({ navigation }) {
  const { settings } = useContext(AccessibilityContext);
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [myReports, setMyReports] = useState([]);

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    accessibilityPreferences: {
      wheelchair: false,
      requiresElevator: false,
      audioAnnouncements: true,
      brailleSignage: false,
      tactilePaving: false,
    },
  });

  useEffect(() => {
    loadProfile();
    loadMyReports();
  }, [user]);

  const loadProfile = async () => {
    if (!user?.email) return;

    try {
      setLoading(true);
      // For now, create profile if it doesn't exist
      const profileData = {
        email: user.email,
        name: user.name || '',
        phone: '',
        accessibilityPreferences: formData.accessibilityPreferences,
      };

      // In a real app, you'd fetch from API
      // const fetchedProfile = await profileAPI.getProfile(user.email);
      // For now, use local state
      setProfile(profileData);
      setFormData({
        name: profileData.name,
        phone: profileData.phone || '',
        accessibilityPreferences: profileData.accessibilityPreferences || formData.accessibilityPreferences,
      });
    } catch (error) {
      console.error('Error loading profile:', error);
      // Use default profile
      const defaultProfile = {
        email: user.email,
        name: user.name || '',
        phone: '',
        accessibilityPreferences: formData.accessibilityPreferences,
      };
      setProfile(defaultProfile);
      setFormData({
        name: defaultProfile.name,
        phone: defaultProfile.phone,
        accessibilityPreferences: defaultProfile.accessibilityPreferences,
      });
    } finally {
      setLoading(false);
    }
  };

  const loadMyReports = async () => {
    if (!user?.email) return;

    try {
      // In a real app, fetch from API
      // const reports = await profileAPI.getMyReports(user.email);
      // For now, use empty array
      setMyReports([]);
    } catch (error) {
      console.error('Error loading reports:', error);
      setMyReports([]);
    }
  };

  const handleSave = async () => {
    if (!user?.email) return;

    try {
      const updatedProfile = {
        email: user.email,
        name: formData.name,
        phone: formData.phone,
        accessibilityPreferences: formData.accessibilityPreferences,
      };

      // In a real app, update via API
      // await profileAPI.updateProfile(user.email, updatedProfile);
      
      setProfile(updatedProfile);
      setIsEditing(false);
      Alert.alert('Success', 'Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      Alert.alert('Error', 'Failed to update profile. Please try again.');
    }
  };

  const togglePreference = (key) => {
    setFormData({
      ...formData,
      accessibilityPreferences: {
        ...formData.accessibilityPreferences,
        [key]: !formData.accessibilityPreferences[key],
      },
    });
  };

  const PreferenceToggle = ({ icon, label, key, value }) => (
    <TouchableOpacity
      style={styles.preferenceItem}
      onPress={() => togglePreference(key)}
      accessible={true}
      accessibilityLabel={`${label} - ${value ? 'Enabled' : 'Disabled'}`}
    >
      <View style={styles.preferenceLeft}>
        <Ionicons
          name={icon}
          size={24}
          color={value ? '#2b8a3e' : '#999'}
        />
        <Text style={[styles.preferenceLabel, settings.largeText && styles.largePreferenceLabel]}>
          {label}
        </Text>
      </View>
      <View style={[styles.toggle, value && styles.toggleActive]}>
        <View style={[styles.toggleCircle, value && styles.toggleCircleActive]} />
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Loading profile...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.avatarContainer}>
          <View style={styles.avatar}>
            <Ionicons name="person" size={48} color="#2b8a3e" />
          </View>
        </View>
        <Text style={[styles.name, settings.largeText && styles.largeName]}>
          {formData.name || user?.name || 'User'}
        </Text>
        <Text style={[styles.email, settings.largeText && styles.largeEmail]}>
          {user?.email || ''}
        </Text>
        {!isEditing && (
          <TouchableOpacity
            style={styles.editButton}
            onPress={() => setIsEditing(true)}
            accessible={true}
            accessibilityLabel="Edit profile"
          >
            <Ionicons name="create-outline" size={20} color="#2b8a3e" />
            <Text style={styles.editButtonText}>Edit Profile</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Profile Information */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, settings.largeText && styles.largeSectionTitle]}>
          Personal Information
        </Text>

        <View style={styles.inputContainer}>
          <Text style={[styles.label, settings.largeText && styles.largeLabel]}>Full Name</Text>
          {isEditing ? (
            <TextInput
              style={[
                styles.input,
                settings.largeText && styles.largeInput,
                settings.highContrast && styles.highContrastInput
              ]}
              value={formData.name}
              onChangeText={(text) => setFormData({ ...formData, name: text })}
              placeholder="Enter your name"
              editable={isEditing}
            />
          ) : (
            <Text style={[styles.value, settings.largeText && styles.largeValue]}>
              {formData.name || 'Not set'}
            </Text>
          )}
        </View>

        <View style={styles.inputContainer}>
          <Text style={[styles.label, settings.largeText && styles.largeLabel]}>Phone Number</Text>
          {isEditing ? (
            <TextInput
              style={[
                styles.input,
                settings.largeText && styles.largeInput,
                settings.highContrast && styles.highContrastInput
              ]}
              value={formData.phone}
              onChangeText={(text) => setFormData({ ...formData, phone: text })}
              placeholder="Enter your phone number"
              keyboardType="phone-pad"
              editable={isEditing}
            />
          ) : (
            <Text style={[styles.value, settings.largeText && styles.largeValue]}>
              {formData.phone || 'Not set'}
            </Text>
          )}
        </View>
      </View>

      {/* Accessibility Preferences */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, settings.largeText && styles.largeSectionTitle]}>
          Accessibility Preferences
        </Text>
        <Text style={[styles.sectionDescription, settings.largeText && styles.largeSectionDescription]}>
          Configure your accessibility needs to get personalized route recommendations
        </Text>

        <PreferenceToggle
          icon="accessibility"
          label="Wheelchair Access Required"
          key="wheelchair"
          value={formData.accessibilityPreferences.wheelchair}
        />
        <PreferenceToggle
          icon="apps"
          label="Require Elevators"
          key="requiresElevator"
          value={formData.accessibilityPreferences.requiresElevator}
        />
        <PreferenceToggle
          icon="volume-high"
          label="Audio Announcements"
          key="audioAnnouncements"
          value={formData.accessibilityPreferences.audioAnnouncements}
        />
        <PreferenceToggle
          icon="hand-left"
          label="Braille Signage"
          key="brailleSignage"
          value={formData.accessibilityPreferences.brailleSignage}
        />
        <PreferenceToggle
          icon="walk"
          label="Tactile Paving"
          key="tactilePaving"
          value={formData.accessibilityPreferences.tactilePaving}
        />
      </View>

      {/* My Reports */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, settings.largeText && styles.largeSectionTitle]}>
          My Reported Issues
        </Text>
        {myReports.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="flag-outline" size={48} color="#999" />
            <Text style={[styles.emptyStateText, settings.largeText && styles.largeEmptyStateText]}>
              You haven't reported any issues yet
            </Text>
            <TouchableOpacity
              style={styles.reportButton}
              onPress={() => navigation.navigate('Map')}
            >
              <Text style={styles.reportButtonText}>Report an Issue</Text>
            </TouchableOpacity>
          </View>
        ) : (
          myReports.map((report, index) => (
            <View key={index} style={styles.reportItem}>
              <Ionicons name="flag" size={20} color="#dc3545" />
              <View style={styles.reportContent}>
                <Text style={[styles.reportStation, settings.largeText && styles.largeReportStation]}>
                  {report.stationName}
                </Text>
                <Text style={[styles.reportIssue, settings.largeText && styles.largeReportIssue]}>
                  {report.issue}
                </Text>
                <Text style={styles.reportDate}>
                  {new Date(report.reportedAt).toLocaleDateString()}
                </Text>
              </View>
            </View>
          ))
        )}
      </View>

      {/* Save/Cancel Buttons */}
      {isEditing && (
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.button, styles.cancelButton]}
            onPress={() => {
              setIsEditing(false);
              loadProfile(); // Reset form
            }}
          >
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, styles.saveButton]}
            onPress={handleSave}
          >
            <Text style={styles.saveButtonText}>Save Changes</Text>
          </TouchableOpacity>
        </View>
      )}
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
    backgroundColor: '#f8f9fa',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  avatarContainer: {
    marginBottom: 16,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#e8f5e9',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#2b8a3e',
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  largeName: {
    fontSize: 30,
  },
  email: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
  },
  largeEmail: {
    fontSize: 16,
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#2b8a3e',
    backgroundColor: 'white',
  },
  editButtonText: {
    color: '#2b8a3e',
    fontWeight: '600',
    marginLeft: 8,
    fontSize: 14,
  },
  section: {
    padding: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  largeSectionTitle: {
    fontSize: 24,
  },
  sectionDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
    lineHeight: 20,
  },
  largeSectionDescription: {
    fontSize: 16,
    lineHeight: 24,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  largeLabel: {
    fontSize: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#f8f9fa',
  },
  largeInput: {
    fontSize: 18,
    padding: 14,
  },
  highContrastInput: {
    borderWidth: 2,
    borderColor: '#000',
    backgroundColor: 'white',
  },
  value: {
    fontSize: 16,
    color: '#333',
    paddingVertical: 8,
  },
  largeValue: {
    fontSize: 18,
  },
  preferenceItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 12,
    marginVertical: 4,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
  },
  preferenceLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  preferenceLabel: {
    fontSize: 16,
    color: '#333',
    marginLeft: 12,
    flex: 1,
  },
  largePreferenceLabel: {
    fontSize: 18,
  },
  toggle: {
    width: 50,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#ddd',
    justifyContent: 'center',
    paddingHorizontal: 2,
  },
  toggleActive: {
    backgroundColor: '#2b8a3e',
  },
  toggleCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'white',
    alignSelf: 'flex-start',
  },
  toggleCircleActive: {
    alignSelf: 'flex-end',
  },
  emptyState: {
    alignItems: 'center',
    padding: 32,
  },
  emptyStateText: {
    fontSize: 16,
    color: '#666',
    marginTop: 16,
    marginBottom: 24,
    textAlign: 'center',
  },
  largeEmptyStateText: {
    fontSize: 18,
  },
  reportButton: {
    backgroundColor: '#dc3545',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  reportButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  reportItem: {
    flexDirection: 'row',
    padding: 12,
    marginVertical: 4,
    backgroundColor: '#fff3cd',
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#dc3545',
  },
  reportContent: {
    flex: 1,
    marginLeft: 12,
  },
  reportStation: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  largeReportStation: {
    fontSize: 18,
  },
  reportIssue: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  largeReportIssue: {
    fontSize: 16,
  },
  reportDate: {
    fontSize: 12,
    color: '#999',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 24,
    gap: 12,
  },
  button: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#f8f9fa',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  cancelButtonText: {
    color: '#666',
    fontWeight: 'bold',
    fontSize: 16,
  },
  saveButton: {
    backgroundColor: '#2b8a3e',
  },
  saveButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  loadingText: {
    textAlign: 'center',
    marginTop: 50,
    fontSize: 16,
    color: '#666',
  },
});


