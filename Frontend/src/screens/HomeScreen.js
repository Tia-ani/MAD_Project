import React, { useContext } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AccessibilityContext } from '../context/AccessibilityContext';
import { useAuth } from '../context/AuthContext';

export default function HomeScreen({ navigation }) {
  const { settings } = useContext(AccessibilityContext);
  const { user } = useAuth();

  const QuickActionCard = ({ icon, title, description, onPress, color }) => (
    <TouchableOpacity
      style={styles.quickActionCard}
      onPress={onPress}
      accessible={true}
      accessibilityLabel={`${title}, ${description}`}
    >
      <View style={[styles.iconContainer, { backgroundColor: color + '20' }]}>
        <Ionicons name={icon} size={32} color={color} />
      </View>
      <Text style={[styles.cardTitle, settings.largeText && styles.largeCardTitle]}>
        {title}
      </Text>
      <Text style={[styles.cardDescription, settings.largeText && styles.largeCardDescription]}>
        {description}
      </Text>
    </TouchableOpacity>
  );

  const FeatureCard = ({ icon, title, description }) => (
    <View style={styles.featureCard}>
      <Ionicons name={icon} size={24} color="#2b8a3e" />
      <Text style={[styles.featureTitle, settings.largeText && styles.largeFeatureTitle]}>
        {title}
      </Text>
      <Text style={[styles.featureDescription, settings.largeText && styles.largeFeatureDescription]}>
        {description}
      </Text>
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={[styles.greeting, settings.largeText && styles.largeGreeting]}>
            Welcome{user?.name ? `, ${user.name}` : ''}!
          </Text>
          <Text style={[styles.subtitle, settings.largeText && styles.largeSubtitle]}>
            Your accessible transit companion
          </Text>
        </View>
        <View style={styles.logoContainer}>
          <Ionicons name="train" size={48} color="#2b8a3e" />
        </View>
      </View>

      {/* Quick Actions */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, settings.largeText && styles.largeSectionTitle]}>
          Quick Actions
        </Text>
        <View style={styles.quickActionsGrid}>
          <QuickActionCard
            icon="map"
            title="View Map"
            description="Explore stations on map"
            color="#2b8a3e"
            onPress={() => navigation.navigate('Map')}
          />
          <QuickActionCard
            icon="train"
            title="Stations"
            description="Browse all stations"
            color="#6f42c1"
            onPress={() => navigation.navigate('Stations')}
          />
          <QuickActionCard
            icon="navigate"
            title="Plan Route"
            description="Find accessible routes"
            color="#fd7e14"
            onPress={() => navigation.navigate('Route Planner')}
          />
          <QuickActionCard
            icon="call"
            title="Emergency"
            description="Get help quickly"
            color="#dc3545"
            onPress={() => navigation.navigate('Settings')}
          />
        </View>
      </View>

      {/* App Features */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, settings.largeText && styles.largeSectionTitle]}>
          Key Features
        </Text>
        <FeatureCard
          icon="accessibility"
          title="Accessibility First"
          description="Comprehensive accessibility information for all stations"
        />
        <FeatureCard
          icon="location"
          title="Real-time Updates"
          description="Stay informed about station conditions and issues"
        />
        <FeatureCard
          icon="route"
          title="Smart Routing"
          description="Find routes that match your accessibility needs"
        />
        <FeatureCard
          icon="notifications"
          title="Issue Reporting"
          description="Report accessibility issues to help others"
        />
      </View>

      {/* Stats */}
      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text style={[styles.statNumber, settings.largeText && styles.largeStatNumber]}>12+</Text>
          <Text style={[styles.statLabel, settings.largeText && styles.largeStatLabel]}>Stations</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={[styles.statNumber, settings.largeText && styles.largeStatNumber]}>8+</Text>
          <Text style={[styles.statLabel, settings.largeText && styles.largeStatLabel]}>Accessible</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={[styles.statNumber, settings.largeText && styles.largeStatNumber]}>24/7</Text>
          <Text style={[styles.statLabel, settings.largeText && styles.largeStatLabel]}>Support</Text>
        </View>
      </View>

      {/* Get Started */}
      <View style={styles.getStartedSection}>
        <Text style={[styles.getStartedTitle, settings.largeText && styles.largeGetStartedTitle]}>
          Ready to explore?
        </Text>
        <Text style={[styles.getStartedText, settings.largeText && styles.largeGetStartedText]}>
          Start by viewing the map or browsing stations to plan your accessible journey.
        </Text>
        <TouchableOpacity
          style={styles.exploreButton}
          onPress={() => navigation.navigate('Map')}
          accessible={true}
          accessibilityLabel="Explore stations on map"
        >
          <Text style={styles.exploreButtonText}>Explore Now</Text>
          <Ionicons name="arrow-forward" size={20} color="white" />
        </TouchableOpacity>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 24,
    backgroundColor: '#f8f9fa',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  greeting: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  largeGreeting: {
    fontSize: 34,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
  largeSubtitle: {
    fontSize: 18,
  },
  logoContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#e8f5e9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  section: {
    padding: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  largeSectionTitle: {
    fontSize: 24,
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  quickActionCard: {
    width: '48%',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    elevation: 2,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  largeCardTitle: {
    fontSize: 18,
  },
  cardDescription: {
    fontSize: 12,
    color: '#666',
    lineHeight: 16,
  },
  largeCardDescription: {
    fontSize: 14,
    lineHeight: 20,
  },
  featureCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
    marginLeft: 12,
    flex: 1,
  },
  largeFeatureTitle: {
    fontSize: 18,
  },
  featureDescription: {
    fontSize: 13,
    color: '#666',
    marginLeft: 12,
    flex: 1,
    lineHeight: 18,
  },
  largeFeatureDescription: {
    fontSize: 15,
    lineHeight: 22,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#2b8a3e',
    marginHorizontal: 24,
    marginVertical: 16,
    borderRadius: 16,
    padding: 24,
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 4,
  },
  largeStatNumber: {
    fontSize: 38,
  },
  statLabel: {
    fontSize: 14,
    color: 'white',
    opacity: 0.9,
  },
  largeStatLabel: {
    fontSize: 16,
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  getStartedSection: {
    backgroundColor: '#f8f9fa',
    margin: 24,
    padding: 24,
    borderRadius: 16,
    alignItems: 'center',
  },
  getStartedTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
    textAlign: 'center',
  },
  largeGetStartedTitle: {
    fontSize: 26,
  },
  getStartedText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 20,
  },
  largeGetStartedText: {
    fontSize: 16,
    lineHeight: 24,
  },
  exploreButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2b8a3e',
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 25,
    elevation: 3,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  exploreButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 8,
  },
});
