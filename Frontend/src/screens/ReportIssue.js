import React, { useState, useContext } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  Image,
} from 'react-native';
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

  // FIXED — Actual working permission + picker
  const pickImage = async () => {
    const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!perm.granted) {
      Alert.alert("Permission Needed", "Please allow access to your photos to upload an image.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images, // ✔️ Correct
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled && result.assets?.length > 0) {
      setImage(result.assets[0]);
    }
  };

  const takePhoto = async () => {
    const perm = await ImagePicker.requestCameraPermissionsAsync();
    if (!perm.granted) {
      Alert.alert("Permission Needed", "Camera permission is required.");
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled && result.assets?.length > 0) {
      setImage(result.assets[0]);
    }
  };

  const showImageOptions = () => {
    Alert.alert(
      "Add Photo",
      "Choose an option",
      [
        { text: "Camera", onPress: takePhoto },
        { text: "Photo Library", onPress: pickImage },
        { text: "Cancel", style: "cancel" }
      ]
    );
  };

  const removeImage = () => setImage(null);

  const handleSubmit = async () => {
    const issueText =
      selectedIssue === "other"
        ? customIssue
        : commonIssues.find((i) => i.id === selectedIssue)?.label || "";

    if (!issueText.trim()) {
      Alert.alert("Error", "Please select or describe an issue.");
      return;
    }

    try {
      setSubmitting(true);

      // SEND TO STATION API
      await stationAPI.reportIssue(station.id, issueText, severity, image);

      // NEW — Add to user profile properly
      if (user?.email) {
        try {
          await profileAPI.addReportedIssue(user.email, {
            stationId: station.id,
            stationName: station.name,
            issue: issueText,
            severity,
            reportedAt: new Date().toISOString(),
            image: image?.uri || null,
          });

          // Refresh profile screen immediately
          route.params?.refreshReports?.();
        } catch (err) {
          console.log("Error saving report to profile:", err);
        }
      }

      Alert.alert("Issue Reported", "Thank you for reporting this accessibility issue.", [
        {
          text: "OK",
          onPress: () =>
            navigation.navigate("StationDetails", {
              station: {
                ...station,
                issues: [...(station.issues || []), `${issueText} (${severity})`],
              },
            }),
        },
      ]);
    } catch (err) {
      console.log("Error reporting issue:", err);
      Alert.alert("Error", "Failed to report issue. Please try again.");
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

      <Text style={[styles.sectionTitle, settings.largeText && styles.largeSectionTitle]}>
        What type of issue are you reporting?
      </Text>

      <View style={styles.issueGrid}>
        {commonIssues.map((issue) => (
          <TouchableOpacity
            key={issue.id}
            style={[styles.issueOption, selectedIssue === issue.id && styles.selectedIssue]}
            onPress={() => setSelectedIssue(issue.id)}
          >
            <Ionicons
              name={issue.icon}
              size={24}
              color={selectedIssue === issue.id ? "white" : "#2b8a3e"}
            />
            <Text
              style={[
                styles.issueOptionText,
                selectedIssue === issue.id && styles.selectedIssueText,
              ]}
            >
              {issue.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {selectedIssue === "other" && (
        <View style={styles.customIssueContainer}>
          <Text style={[styles.label, settings.largeText && styles.largeLabel]}>
            Please describe the issue:
          </Text>
          <TextInput
            style={[styles.input, settings.largeText && styles.largeInput]}
            placeholder="Describe the accessibility issue in detail..."
            value={customIssue}
            onChangeText={setCustomIssue}
            multiline
          />
        </View>
      )}

      <Text style={[styles.sectionTitle]}>Add Photo (Optional)</Text>

      <View style={styles.photoContainer}>
        {image ? (
          <View style={styles.imagePreviewContainer}>
            <Image source={{ uri: image.uri }} style={styles.imagePreview} />
            <TouchableOpacity
              style={styles.removeImageButton}
              onPress={removeImage}
            >
              <Ionicons name="close-circle" size={24} color="#dc3545" />
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity style={styles.addPhotoButton} onPress={showImageOptions}>
            <Ionicons name="camera" size={32} color="#2b8a3e" />
            <Text style={styles.addPhotoText}>Tap to add a photo</Text>
          </TouchableOpacity>
        )}
      </View>

      <Text style={styles.sectionTitle}>How severe is this issue?</Text>

      <View style={styles.severityContainer}>
        {severityLevels.map((level) => (
          <TouchableOpacity
            key={level.level}
            style={[
              styles.severityOption,
              { borderColor: level.color },
              severity === level.level && { backgroundColor: level.color },
            ]}
            onPress={() => setSeverity(level.level)}
          >
            <Text
              style={[
                styles.severityLabel,
                severity === level.level && styles.selectedSeverityLabel,
              ]}
            >
              {level.label}
            </Text>
            <Text
              style={[
                styles.severityDescription,
                severity === level.level && styles.selectedSeverityDescription,
              ]}
            >
              {level.description}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity
        style={[styles.submitButton, submitting && styles.submitButtonDisabled]}
        onPress={handleSubmit}
        disabled={submitting}
      >
        <Ionicons name="flag" size={20} color="white" />
        <Text style={styles.submitButtonText}>
          {submitting ? "Submitting..." : "Submit Report"}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

/* ---------------- STYLES (unchanged UI) ---------------- */
const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: 'white' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 8, color: '#333' },
  station: { fontSize: 18, marginBottom: 24, color: '#666', fontWeight: '500' },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginTop: 16, marginBottom: 12 },
  issueGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
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
  selectedIssue: { backgroundColor: '#2b8a3e' },
  issueOptionText: { marginTop: 8, textAlign: 'center', fontSize: 14, color: '#2b8a3e' },
  selectedIssueText: { color: 'white' },
  customIssueContainer: { marginTop: 16 },
  label: { fontSize: 16, marginBottom: 8 },
  input: { borderWidth: 1, borderColor: '#ccc', padding: 12, borderRadius: 6, fontSize: 16 },
  photoContainer: { marginTop: 16, marginBottom: 16 },
  addPhotoButton: {
    borderWidth: 2,
    borderColor: '#2b8a3e',
    borderStyle: 'dashed',
    borderRadius: 8,
    padding: 32,
    alignItems: 'center',
  },
  addPhotoText: { marginTop: 8, fontSize: 16, color: '#2b8a3e' },
  imagePreviewContainer: { position: 'relative', borderRadius: 8, overflow: 'hidden' },
  imagePreview: { width: '100%', height: 200, borderRadius: 8 },
  removeImageButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 4,
  },
  severityContainer: { marginTop: 8 },
  severityOption: {
    padding: 16,
    marginBottom: 12,
    borderWidth: 2,
    borderRadius: 8,
    backgroundColor: 'white',
  },
  severityLabel: { fontSize: 16, fontWeight: 'bold', color: '#333' },
  selectedSeverityLabel: { color: 'white' },
  severityDescription: { fontSize: 14, color: '#666' },
  selectedSeverityDescription: { color: 'white' },
  submitButton: {
    backgroundColor: '#2b8a3e',
    padding: 16,
    borderRadius: 8,
    marginTop: 24,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  submitButtonDisabled: { opacity: 0.6 },
  submitButtonText: { color: 'white', fontSize: 18, fontWeight: 'bold', marginLeft: 8 },
});
