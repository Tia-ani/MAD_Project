import React, { useContext } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Switch, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AccessibilityContext } from '../context/AccessibilityContext';
import { useAuth } from '../context/AuthContext';

export default function SettingsScreen({ navigation }) {
  const { settings, updateSettings } = useContext(AccessibilityContext);
  const { logout } = useAuth();

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: () => {
            logout();
          },
        },
      ]
    );
  };

  const SettingItem = ({ icon, title, description, value, onValueChange, type = 'switch' }) => (
    <View style={styles.settingItem}>
      <View style={styles.settingIcon}>
        <Ionicons name={icon} size={24} color="#2b8a3e" />
      </View>
      <View style={styles.settingContent}>
        <Text style={[styles.settingTitle, settings.largeText && styles.largeSettingTitle]}>
          {title}
        </Text>
        <Text style={[styles.settingDescription, settings.largeText && styles.largeSettingDescription]}>
          {description}
        </Text>
      </View>
      {type === 'switch' && (
        <Switch
          value={value}
          onValueChange={onValueChange}
          trackColor={{ false: '#d0d0d0', true: '#6ec589' }}
          thumbColor={value ? '#2b8a3e' : '#f4f3f4'}
        />
      )}
      {type === 'navigation' && (
        <Ionicons name="chevron-forward" size={24} color="#999" />
      )}
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={[styles.title, settings.largeText && styles.largeTitle]}>
          Settings
        </Text>
        <Text style={[styles.subtitle, settings.largeText && styles.largeSubtitle]}>
          Customize your accessibility preferences
        </Text>
      </View>

      {/* Accessibility Settings */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, settings.largeText && styles.largeSectionTitle]}>
          Accessibility
        </Text>

        <SettingItem
          icon="text"
          title="Large Text"
          description="Increase text size throughout the app"
          value={settings.largeText}
          onValueChange={(value) => updateSettings({ largeText: value })}
        />

        <SettingItem
          icon="contrast"
          title="High Contrast Mode"
          description="Enhanced contrast for better visibility"
          value={settings.highContrast}
          onValueChange={(value) => updateSettings({ highContrast: value })}
        />

        <SettingItem
          icon="volume-high"
          title="Audio Navigation"
          description="Enable voice-guided navigation and announcements"
          value={settings.audioNavigation}
          onValueChange={(value) => updateSettings({ audioNavigation: value })}
        />

        <SettingItem
          icon="notifications"
          title="Accessibility Alerts"
          description="Get notified about accessibility issues on your routes"
          value={settings.accessibilityAlerts}
          onValueChange={(value) => updateSettings({ accessibilityAlerts: value })}
        />
      </View>

      {/* Navigation Preferences */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, settings.largeText && styles.largeSectionTitle]}>
          Navigation Preferences
        </Text>

        <SettingItem
          icon="accessibility"
          title="Prefer Wheelchair Routes"
          description="Prioritize wheelchair-accessible routes"
          value={settings.preferWheelchair}
          onValueChange={(value) => updateSettings({ preferWheelchair: value })}
        />

        <SettingItem
          icon="apps"
          title="Require Elevators"
          description="Only show routes with elevator access"
          value={settings.requireElevators}
          onValueChange={(value) => updateSettings({ requireElevators: value })}
        />

        <SettingItem
          icon="warning"
          title="Avoid Reported Issues"
          description="Avoid stations with reported accessibility problems"
          value={settings.avoidIssues}
          onValueChange={(value) => updateSettings({ avoidIssues: value })}
        />
      </View>

      {/* Notifications */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, settings.largeText && styles.largeSectionTitle]}>
          Notifications
        </Text>

        <SettingItem
          icon="notifications-outline"
          title="Push Notifications"
          description="Receive updates about accessibility changes"
          value={settings.pushNotifications}
          onValueChange={(value) => updateSettings({ pushNotifications: value })}
        />

        <SettingItem
          icon="time"
          title="Real-time Updates"
          description="Get instant alerts about transit disruptions"
          value={settings.realTimeUpdates}
          onValueChange={(value) => updateSettings({ realTimeUpdates: value })}
        />
      </View>

      {/* Emergency & Support */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, settings.largeText && styles.largeSectionTitle]}>
          Emergency & Support
        </Text>

        <TouchableOpacity
          style={styles.settingItem}
          onPress={() => navigation.navigate('Emergency')}
          accessible={true}
          accessibilityLabel="Access emergency contacts and assistance"
        >
          <View style={styles.settingIcon}>
            <Ionicons name="call" size={24} color="#dc3545" />
          </View>
          <View style={styles.settingContent}>
            <Text style={[styles.settingTitle, settings.largeText && styles.largeSettingTitle]}>
              Emergency Contacts
            </Text>
            <Text style={[styles.settingDescription, settings.largeText && styles.largeSettingDescription]}>
              Quick access to emergency services
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={24} color="#999" />
        </TouchableOpacity>
      </View>

      {/* Account */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, settings.largeText && styles.largeSectionTitle]}>
          Account
        </Text>

        <TouchableOpacity
          style={styles.settingItem}
          onPress={handleLogout}
          accessible={true}
          accessibilityLabel="Logout from your account"
        >
          <View style={[styles.settingIcon, { backgroundColor: '#ffe0e0' }]}>
            <Ionicons name="log-out-outline" size={24} color="#dc3545" />
          </View>
          <View style={styles.settingContent}>
            <Text style={[styles.settingTitle, settings.largeText && styles.largeSettingTitle]}>
              Logout
            </Text>
            <Text style={[styles.settingDescription, settings.largeText && styles.largeSettingDescription]}>
              Sign out of your account
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={24} color="#999" />
        </TouchableOpacity>
      </View>

      {/* About */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, settings.largeText && styles.largeSectionTitle]}>
          About
        </Text>

        <View style={styles.aboutContainer}>
          <Text style={[styles.aboutTitle, settings.largeText && styles.largeAboutTitle]}>
            Inclusive Public Transit Navigator
          </Text>
          <Text style={[styles.aboutVersion, settings.largeText && styles.largeAboutVersion]}>
            Version 1.0.0
          </Text>
          <Text style={[styles.aboutText, settings.largeText && styles.largeAboutText]}>
            Empowering accessible travel for everyone. This app provides real-time accessibility 
            information to help people with disabilities navigate public transit with confidence.
          </Text>
          <Text style={[styles.aboutCredit, settings.largeText && styles.largeAboutCredit]}>
            Created by: Anishka Khurana
          </Text>
          <Text style={[styles.aboutCredit, settings.largeText && styles.largeAboutCredit]}>
            URN-Number: 2024-B-24082006A
            Batch: Turing 
          </Text>
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
    padding: 24,
    backgroundColor: '#f8f9fa',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  largeTitle: {
    fontSize: 34,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
  },
  largeSubtitle: {
    fontSize: 16,
  },
  section: {
    marginTop: 8,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#666',
    marginTop: 16,
    marginBottom: 8,
    marginHorizontal: 16,
    textTransform: 'uppercase',
  },
  largeSectionTitle: {
    fontSize: 18,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: 'white',
  },
  settingIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#e8f5e9',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  settingContent: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  largeSettingTitle: {
    fontSize: 18,
  },
  settingDescription: {
    fontSize: 13,
    color: '#666',
  },
  largeSettingDescription: {
    fontSize: 15,
  },
  aboutContainer: {
    padding: 16,
    backgroundColor: '#f8f9fa',
    margin: 16,
    borderRadius: 12,
  },
  aboutTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2b8a3e',
    marginBottom: 8,
  },
  largeAboutTitle: {
    fontSize: 22,
  },
  aboutVersion: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
  },
  largeAboutVersion: {
    fontSize: 16,
  },
  aboutText: {
    fontSize: 14,
    color: '#333',
    lineHeight: 22,
    marginBottom: 16,
  },
  largeAboutText: {
    fontSize: 16,
    lineHeight: 26,
  },
  aboutCredit: {
    fontSize: 13,
    color: '#666',
    marginTop: 4,
  },
  largeAboutCredit: {
    fontSize: 15,
  },
});