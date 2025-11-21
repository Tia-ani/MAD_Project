import React, { useState, useContext } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { AccessibilityContext } from '../context/AccessibilityContext';
import { useAuth } from '../context/AuthContext';
import { stationAPI, profileAPI } from '../services/api';

export default function ReportIssue({ route, navigation }) {
  const { station } = route.params;
  const [selectedIssue, setSelectedIssue] = useState('');
  const [customIssue, setCustomIssue] = useState('');
  const [severity, setSeverity] = useState('medium');
  const [submitting, setSubmitting] = useState(false);
  const [image, setImage] = useState(null);
  const { settings } = useContext(AccessibilityContext);
  const { user } = useAuth();

  const commonIssues = [
    { id: 'elevator', label: 'Elevator not working', icon: 'apps' },
    { id: 'ramp', label: 'Ramp blocked/damaged', icon: 'trending-up' },
    { id: 'audio', label: 'Audio announcements not working', icon: 'volume-mute' },
    { id: 'braille', label: 'Braille signage missing/damaged', icon: 'hand-left' },
    { id: 'lighting', label: 'Poor lighting conditions', icon: 'bulb' },
    { id: 'platform', label: 'Platform gap too wide', icon: 'resize' },
    { id: 'toilet', label: 'Accessible toilet out of order', icon: 'medical' },
    { id: 'other', label: 'Other issue', icon: 'ellipsis-horizontal' },
  ];

  const severityLevels = [
    { level: 'low', label: 'Low', color: '#28a745', description: 'Minor inconvenience' },
    { level: 'medium', label: 'Medium', color: '#ffc107', description: 'Significant barrier' },
    { level: 'high', label: 'High', color: '#dc3545', description: 'Prevents access entirely' },
  ];

  const pickImage = async () => {
    // Request permission
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Required', 'We need camera roll permissions to upload photos.');
      return;
    }

    // Launch image picker
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaType.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      setImage(result.assets[0]);
    }
  };

  const takePhoto = async () => {
    // Request permission
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Required', 'We need camera permissions to take photos.');
      return;
    }

    // Launch camera
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      setImage(result.assets[0]);
    }
  };

  const removeImage = () => {
    setImage(null);
  };

  const showImageOptions = () => {
    Alert.alert(
      'Add Photo',
      'Choose an option',
      [
        { text: 'Camera', onPress: takePhoto },
        { text: 'Photo Library', onPress: pickImage },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  };

  const handleSubmit = async () => {
    const issueText = selectedIssue === 'other' ? customIssue : 
                     commonIssues.find(i => i.id === selectedIssue)?.label || '';
    
    if (!issueText.trim()) {
      Alert.alert('Error', 'Please select or describe an issue');
      return;
    }

    try {
      setSubmitting(true);
      
      // Report issue to station with optional image
      await stationAPI.reportIssue(station.id, issueText, severity, image);
      
      // Add to user's reported issues if logged in
      if (user?.email) {
        try {
          await profileAPI.addReportedIssue(user.email, {
            stationId: station.id,
            stationName: station.name,
            issue: issueText,
            severity: severity,
          });
        } catch (error) {
          console.error('Error adding to user profile:', error);
          // Continue even if this fails
        }
      }

      Alert.alert(
        'Issue Reported',
        'Thank you for reporting this accessibility issue. The transit authority has been notified.',
        [
          {
            text: 'OK',
            onPress: () => {
              // Navigate back with updated station
              navigation.navigate('StationDetails', { 
                station: {
                  ...station,
                  issues: [...(station.issues || []), `${issueText} (${severity} severity)`]
                }
              });
            },
          },
        ]
      );
    } catch (error) {
      console.error('Error reporting issue:', error);
      const errorMessage = error.message || 'Failed to report issue. Please try again later.';
      Alert.alert(
        'Error',
        errorMessage,
        [{ text: 'OK' }]
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={[styles.title, settings.largeText && styles.largeTitle]}>
        Report Accessibility Issue
      </Text>
      <Text style={[styles.station, settings.largeText && styles.largeStation]}>
        Station: {station.name}
      </Text>

      {/* Issue Selection */}
      <Text style={[styles.sectionTitle, settings.largeText && styles.largeSectionTitle]}>
        What type of issue are you reporting?
      </Text>
      
      <View style={styles.issueGrid}>
        {commonIssues.map((issue) => (
          <TouchableOpacity
            key={issue.id}
            style={[
              styles.issueOption,
              selectedIssue === issue.id && styles.selectedIssue
            ]}
            onPress={() => setSelectedIssue(issue.id)}
            accessible={true}
            accessibilityLabel={`Report ${issue.label}`}
          >
            <Ionicons 
              name={issue.icon} 
              size={24} 
              color={selectedIssue === issue.id ? 'white' : '#2b8a3e'} 
            />
            <Text style={[
              styles.issueOptionText,
              selectedIssue === issue.id && styles.selectedIssueText,
              settings.largeText && styles.largeIssueText
            ]}>
              {issue.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Custom Issue Input */}
      {selectedIssue === 'other' && (
        <View style={styles.customIssueContainer}>
          <Text style={[styles.label, settings.largeText && styles.largeLabel]}>
            Please describe the issue:
          </Text>
          <TextInput
            style={[
              styles.input,
              settings.largeText && styles.largeInput,
              settings.highContrast && styles.highContrastInput
            ]}
            placeholder="Describe the accessibility issue in detail..."
            value={customIssue}
            onChangeText={setCustomIssue}
            multiline={true}
            numberOfLines={4}
            accessible={true}
            accessibilityLabel="Describe the accessibility issue"
          />
        </View>
      )}

      {/* Photo Upload Section */}
      <View style={styles.photoSection}>
        <Text style={[styles.sectionTitle, settings.largeText && styles.largeSectionTitle]}>
          Add Photo (Optional)
        </Text>
        
        <View style={styles.photoContainer}>
          {image ? (
            <View style={styles.imagePreviewContainer}>
              <Image source={{ uri: image.uri }} style={styles.imagePreview} />
              <TouchableOpacity
                style={styles.removeImageButton}
                onPress={removeImage}
                accessible={true}
                accessibilityLabel="Remove photo"
              >
                <Ionicons name="close-circle" size={24} color="#dc3545" />
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity
              style={styles.addPhotoButton}
              onPress={showImageOptions}
              accessible={true}
              accessibilityLabel="Add photo to report"
            >
              <Ionicons name="camera" size={32} color="#2b8a3e" />
              <Text style={[styles.addPhotoText, settings.largeText && styles.largeAddPhotoText]}>
                Tap to add a photo
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Severity Selection */}
      <Text style={[styles.sectionTitle, settings.largeText && styles.largeSectionTitle]}>
        How severe is this issue?
      </Text>
      
      <View style={styles.severityContainer}>
        {severityLevels.map((level) => (
          <TouchableOpacity
            key={level.level}
            style={[
              styles.severityOption,
              { borderColor: level.color },
              severity === level.level && { backgroundColor: level.color }
            ]}
            onPress={() => setSeverity(level.level)}
            accessible={true}
            accessibilityLabel={`Set severity to ${level.label}: ${level.description}`}
          >
            <Text style={[
              styles.severityLabel,
              severity === level.level && styles.selectedSeverityLabel,
              settings.largeText && styles.largeSeverityLabel
            ]}>
              {level.label}
            </Text>
            <Text style={[
              styles.severityDescription,
              severity === level.level && styles.selectedSeverityDescription,
              settings.largeText && styles.largeSeverityDescription
            ]}>
              {level.description}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Submit Button */}
      <TouchableOpacity 
        style={[
          styles.submitButton, 
          settings.largeText && styles.largeSubmitButton,
          submitting && styles.submitButtonDisabled
        ]}
        onPress={handleSubmit}
        disabled={submitting}
        accessible={true}
        accessibilityLabel="Submit accessibility issue report"
      >
        <Ionicons name="flag" size={20} color="white" />
        <Text style={[styles.submitButtonText, settings.largeText && styles.largeSubmitText]}>
          {submitting ? 'Submitting...' : 'Submit Report'}
        </Text>
      </TouchableOpacity>
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
    marginBottom: 8,
    color: '#333'
  },
  largeTitle: {
    fontSize: 30,
  },
  station: { 
    fontSize: 18, 
    marginBottom: 24,
    color: '#666',
    fontWeight: '500'
  },
  largeStation: {
    fontSize: 22,
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
  issueGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  issueOption: {
    width: '48%',
    padding: 16,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: '#2b8a3e',
    borderRadius: 8,
    alignItems: 'center',
    backgroundColor: 'white',
  },
  selectedIssue: {
    backgroundColor: '#2b8a3e',
  },
  issueOptionText: {
    marginTop: 8,
    textAlign: 'center',
    fontSize: 14,
    color: '#2b8a3e',
    fontWeight: '500',
  },
  selectedIssueText: {
    color: 'white',
  },
  largeIssueText: {
    fontSize: 16,
  },
  customIssueContainer: {
    marginTop: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
    color: '#333',
  },
  largeLabel: {
    fontSize: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 12,
    borderRadius: 6,
    fontSize: 16,
    textAlignVertical: 'top',
  },
  largeInput: {
    fontSize: 18,
    padding: 16,
  },
  highContrastInput: {
    borderWidth: 2,
    borderColor: '#000',
  },
  severityContainer: {
    marginTop: 8,
  },
  severityOption: {
    padding: 16,
    marginBottom: 12,
    borderWidth: 2,
    borderRadius: 8,
    backgroundColor: 'white',
  },
  severityLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  selectedSeverityLabel: {
    color: 'white',
  },
  largeSeverityLabel: {
    fontSize: 20,
  },
  severityDescription: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  selectedSeverityDescription: {
    color: 'white',
  },
  largeSeverityDescription: {
    fontSize: 16,
  },
  submitButton: {
    backgroundColor: '#2b8a3e',
    padding: 16,
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 24,
    marginBottom: 32,
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
  largeSubmitButton: {
    padding: 20,
  },
  submitButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  largeSubmitText: {
    fontSize: 22,
  },
  photoSection: {
    marginTop: 16,
    marginBottom: 16,
  },
  photoContainer: {
    marginTop: 8,
    marginBottom: 16,
  },
  addPhotoButton: {
    borderWidth: 2,
    borderColor: '#2b8a3e',
    borderStyle: 'dashed',
    borderRadius: 8,
    padding: 32,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f8f9fa',
  },
  addPhotoText: {
    marginTop: 8,
    fontSize: 16,
    color: '#2b8a3e',
    fontWeight: '500',
  },
  largeAddPhotoText: {
    fontSize: 18,
  },
  imagePreviewContainer: {
    position: 'relative',
    borderRadius: 8,
    overflow: 'hidden',
  },
  imagePreview: {
    width: '100%',
    height: 200,
    borderRadius: 8,
  },
  removeImageButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 4,
  },
});
