import React, { useState, useContext, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AccessibilityContext } from '../context/AccessibilityContext';
import { useAuth } from '../context/AuthContext';
import { profileAPI } from '../services/api';

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

  // ---------------- 1. LOAD PROFILE FROM BACKEND ----------------
  const loadProfile = async () => {
    if (!user?.email) return;

    try {
      setLoading(true);

      // Try fetching existing profile
      let fetchedProfile = await profileAPI.getProfile(user.email);

      setProfile(fetchedProfile);
      setFormData({
        name: fetchedProfile.name,
        phone: fetchedProfile.phone || '',
        accessibilityPreferences: fetchedProfile.accessibilityPreferences,
      });

    } catch (error) {
      console.log("No existing profile — creating new one...");

      // Create a new profile in backend
      const newProfile = {
        email: user.email,
        name: user.name || "",
        phone: "",
        accessibilityPreferences: formData.accessibilityPreferences,
      };

      const created = await profileAPI.updateProfile(user.email, newProfile);

      setProfile(created.user);
      setFormData({
        name: created.user.name,
        phone: created.user.phone,
        accessibilityPreferences: created.user.accessibilityPreferences,
      });
    } finally {
      setLoading(false);
    }
  };

  // ---------------- 2. MY REPORTS LIST ----------------
  const loadMyReports = async () => {
    if (!user?.email) return;

    try {
      const reports = await profileAPI.getMyReports(user.email);
      setMyReports(reports);
    } catch (error) {
      console.error("Error loading reports:", error);
      setMyReports([]);
    }
  };

  // ---------------- 3. SAVE PROFILE TO BACKEND ----------------
  const handleSave = async () => {
    if (!user?.email) return;

    try {
      const updatedProfile = {
        email: user.email,
        name: formData.name,
        phone: formData.phone,
        accessibilityPreferences: formData.accessibilityPreferences,
      };

      const result = await profileAPI.updateProfile(user.email, updatedProfile);
      setProfile(result.user);

      setIsEditing(false);
      Alert.alert("Success", "Profile updated successfully!");

    } catch (error) {
      console.error("Error updating profile:", error);
      Alert.alert("Error", "Failed to update profile.");
    }
  };

  // ---------------- UI COMPONENTS ----------------
  const togglePreference = (key) => {
    setFormData({
      ...formData,
      accessibilityPreferences: {
        ...formData.accessibilityPreferences,
        [key]: !formData.accessibilityPreferences[key],
      },
    });
  };

  const PreferenceToggle = ({ icon, label, prefKey, value }) => (
    <TouchableOpacity
      style={styles.preferenceItem}
      onPress={() => togglePreference(prefKey)}
    >
      <View style={styles.preferenceLeft}>
        <Ionicons name={icon} size={24} color={value ? "#2b8a3e" : "#999"} />
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
      {/* HEADER */}
      <View style={styles.header}>
        <View style={styles.avatar}>
          <Ionicons name="person" size={48} color="#2b8a3e" />
        </View>

        <Text style={[styles.name, settings.largeText && styles.largeName]}>
          {formData.name || user?.name || "User"}
        </Text>
        <Text style={[styles.email, settings.largeText && styles.largeEmail]}>
          {user?.email}
        </Text>

        {!isEditing && (
          <TouchableOpacity
            style={styles.editButton}
            onPress={() => setIsEditing(true)}
          >
            <Ionicons name="create-outline" size={20} color="#2b8a3e" />
            <Text style={styles.editButtonText}>Edit Profile</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* PERSONAL INFO */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, settings.largeText && styles.largeSectionTitle]}>
          Personal Information
        </Text>

        {/* Full Name */}
        <View style={styles.inputContainer}>
          <Text style={[styles.label]}>Full Name</Text>
          {isEditing ? (
            <TextInput
              style={[styles.input]}
              value={formData.name}
              onChangeText={(text) => setFormData({ ...formData, name: text })}
            />
          ) : (
            <Text style={styles.value}>{formData.name}</Text>
          )}
        </View>

        {/* Phone */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Phone Number</Text>
          {isEditing ? (
            <TextInput
              style={styles.input}
              value={formData.phone}
              onChangeText={(text) => setFormData({ ...formData, phone: text })}
              keyboardType="phone-pad"
            />
          ) : (
            <Text style={styles.value}>{formData.phone || "Not set"}</Text>
          )}
        </View>
      </View>

      {/* ACCESSIBILITY PREFERENCES */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle]}>Accessibility Preferences</Text>

        <PreferenceToggle icon="accessibility" label="Wheelchair Access Required" prefKey="wheelchair"
 value={formData.accessibilityPreferences.wheelchair} />
        <PreferenceToggle icon="apps" label="Require Elevators" key="requiresElevator" value={formData.accessibilityPreferences.requiresElevator} />
        <PreferenceToggle icon="volume-high" label="Audio Announcements" key="audioAnnouncements" value={formData.accessibilityPreferences.audioAnnouncements} />
        <PreferenceToggle icon="hand-left" label="Braille Signage" key="brailleSignage" value={formData.accessibilityPreferences.brailleSignage} />
        <PreferenceToggle icon="walk" label="Tactile Paving" key="tactilePaving" value={formData.accessibilityPreferences.tactilePaving} />
      </View>

      {/* MY REPORTS */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>My Reported Issues</Text>

        {myReports.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="flag-outline" size={48} color="#999" />
            <Text style={styles.emptyStateText}>
              You haven't reported any issues yet.
            </Text>
          </View>
        ) : (
          myReports.map((report, i) => (
            <View key={i} style={styles.reportItem}>
              <Ionicons name="flag" size={20} color="#dc3545" />
              <View style={styles.reportContent}>
                <Text style={styles.reportStation}>{report.stationName}</Text>
                <Text style={styles.reportIssue}>{report.issue}</Text>
                <Text style={styles.reportDate}>
                  {new Date(report.reportedAt).toLocaleDateString()}
                </Text>
              </View>
            </View>
          ))
        )}
      </View>

      {/* SAVE BUTTONS */}
      {isEditing && (
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.button, styles.cancelButton]}
            onPress={() => {
              setIsEditing(false);
              loadProfile(); // restore original
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

// ---------------- STYLES ----------------

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "white" },
  header: { alignItems: "center", padding: 24, backgroundColor: "#f8f9fa" },
  avatar: {
    width: 100, height: 100, borderRadius: 50,
    backgroundColor: "#e8f5e9", justifyContent: "center",
    alignItems: "center", borderWidth: 3, borderColor: "#2b8a3e",
  },
  name: { fontSize: 24, fontWeight: "bold", marginTop: 8 },
  email: { fontSize: 14, color: "#666", marginBottom: 16 },
  editButton: {
    flexDirection: "row",
    padding: 8,
    borderWidth: 1,
    borderRadius: 20,
    borderColor: "#2b8a3e",
    paddingHorizontal: 16,
  },
  editButtonText: { marginLeft: 8, color: "#2b8a3e", fontWeight: "600" },
  section: { padding: 24, borderBottomWidth: 1, borderBottomColor: "#eee" },
  sectionTitle: { fontSize: 20, fontWeight: "bold", marginBottom: 12 },
  inputContainer: { marginBottom: 20 },
  label: { fontSize: 14, color: "#333", marginBottom: 6 },
  input: {
    borderWidth: 1, borderColor: "#ddd", borderRadius: 8,
    padding: 12, backgroundColor: "#f8f9fa",
  },
  value: { fontSize: 16, color: "#333" },
  preferenceItem: {
    flexDirection: "row", justifyContent: "space-between",
    padding: 12, backgroundColor: "#f8f9fa", borderRadius: 8, marginBottom: 8,
  },
  preferenceLeft: { flexDirection: "row", alignItems: "center" },
  preferenceLabel: { marginLeft: 10, fontSize: 16 },
  toggle: {
    width: 50, height: 28, borderRadius: 14,
    backgroundColor: "#ddd", justifyContent: "center", padding: 2,
  },
  toggleActive: { backgroundColor: "#2b8a3e" },
  toggleCircle: { width: 24, height: 24, borderRadius: 12, backgroundColor: "white" },
  toggleCircleActive: { alignSelf: "flex-end" },
  emptyState: { alignItems: "center", padding: 20 },
  emptyStateText: { marginTop: 10, color: "#666" },
  reportItem: {
    flexDirection: "row", padding: 12,
    backgroundColor: "#fff3cd",
    borderLeftWidth: 4,
    borderLeftColor: "#dc3545",
    marginBottom: 8,
    borderRadius: 8,
  },
  reportContent: { marginLeft: 10 },
  reportStation: { fontWeight: "bold", fontSize: 16 },
  reportIssue: { fontSize: 14, color: "#555" },
  reportDate: { fontSize: 12, color: "#999" },
  buttonContainer: { flexDirection: "row", padding: 20, gap: 10 },
  button: {
    flex: 1, padding: 14, borderRadius: 8, alignItems: "center",
  },
  cancelButton: { backgroundColor: "#eee" },
  cancelButtonText: { color: "#333" },
  saveButton: { backgroundColor: "#2b8a3e" },
  saveButtonText: { color: "white", fontWeight: "bold" },
});

