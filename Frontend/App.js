import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { AccessibilityProvider } from './src/context/AccessibilityContext';
import { AuthProvider, useAuth } from './src/context/AuthContext';

import HomeScreen from './src/screens/HomeScreen';
import LoginScreen from './src/screens/LoginScreen';
import SignupScreen from './src/screens/SignupScreen';
import MapScreen from './src/screens/MapScreen';
import StationDetails from './src/screens/StationDetails';
import ReportIssue from './src/screens/ReportIssue';
import RoutePlanner from './src/screens/RoutePlanner';
import StationList from './src/screens/StationList';
import EmergencyScreen from './src/screens/EmergencyScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import HomePage from './src/screens/Home';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();


function MapStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="MapHome" 
        component={MapScreen} 
        options={{ title: 'Transit Map' }}
      />
      <Stack.Screen 
        name="StationDetails" 
        component={StationDetails}
        options={{ title: 'Station Details' }}
      />
      <Stack.Screen 
        name="ReportIssue" 
        component={ReportIssue}
        options={{ title: 'Report Issue' }}
      />
    </Stack.Navigator>
  );
}

// Stations Stack Navigator  
function StationsStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="StationListHome" 
        component={StationList}
        options={{ title: 'All Stations' }}
      />
      <Stack.Screen 
        name="StationDetails" 
        component={StationDetails}
        options={{ title: 'Station Details' }}
      />
      <Stack.Screen 
        name="ReportIssue" 
        component={ReportIssue}
        options={{ title: 'Report Issue' }}
      />
    </Stack.Navigator>
  );
}

// Settings Stack Navigator
function SettingsStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="SettingsHome" 
        component={SettingsScreen}
        options={{ title: 'Settings' }}
      />
      <Stack.Screen 
        name="Emergency" 
        component={EmergencyScreen}
        options={{ title: 'Emergency Contacts' }}
      />
      <Stack.Screen 
        name="Profile" 
        component={ProfileScreen}
        options={{ title: 'Profile' }}
      />
    </Stack.Navigator>
  );
}

// Route Planner Stack Navigator
function RoutePlannerStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="RoutePlannerHome" 
        component={RoutePlanner}
        options={{ title: 'Route Planner' }}
      />
      <Stack.Screen 
        name="StationDetails" 
        component={StationDetails}
        options={{ title: 'Station Details' }}
      />
    </Stack.Navigator>
  );
}

// Auth Stack Navigator (Login/Signup)
function AuthStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="HomeIntro" component={HomePage} /> 
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Signup" component={SignupScreen} />
    </Stack.Navigator>
  );
}

// Main App Stack Navigator (Home + Tabs)
function MainAppNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="MainTabs" component={MainTabsNavigator} />
      <Stack.Screen 
        name="StationDetails" 
        component={StationDetails}
        options={{ title: 'Station Details' }}
      />
      <Stack.Screen 
        name="ReportIssue" 
        component={ReportIssue}
        options={{ title: 'Report Issue' }}
      />
      <Stack.Screen 
        name="Emergency" 
        component={EmergencyScreen}
        options={{ title: 'Emergency Contacts' }}
      />
    </Stack.Navigator>
  );
}

// Main Tabs Navigator
function MainTabsNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName = 'help-outline'; // Default icon

          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Map') {
            iconName = focused ? 'map' : 'map-outline';
          } else if (route.name === 'Stations') {
            iconName = focused ? 'train' : 'train-outline';
          } else if (route.name === 'Route Planner') {
            iconName = focused ? 'navigate' : 'navigate-outline';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person' : 'person-outline';
          } else if (route.name === 'Settings') {
            iconName = focused ? 'settings' : 'settings-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#2b8a3e',
        tabBarInactiveTintColor: 'gray',
        tabBarStyle: {
          paddingBottom: 8,
          paddingTop: 8,
          height: 65,
        },
        tabBarLabelStyle: {
          fontSize: 14,
          fontWeight: '600',
        },
        headerShown: false,
      })}
    >
      <Tab.Screen 
        name="Home" 
        component={HomeScreen}
        options={{ tabBarLabel: 'Home' }}
      />
      <Tab.Screen 
        name="Map" 
        component={MapStack}
        options={{ tabBarLabel: 'Map' }}
      />
      <Tab.Screen 
        name="Stations" 
        component={StationsStack}
        options={{ tabBarLabel: 'Stations' }}
      />
      <Tab.Screen 
        name="Route Planner" 
        component={RoutePlannerStack}
        options={{ tabBarLabel: 'Routes' }}
      />
      <Tab.Screen 
        name="Profile" 
        component={ProfileScreen}
        options={{ tabBarLabel: 'Profile' }}
      />
      <Tab.Screen 
        name="Settings" 
        component={SettingsStack}
        options={{ tabBarLabel: 'Settings' }}
      />
    </Tab.Navigator>
  );
}

// Root Navigator - decides which stack to show
function RootNavigator() {
  const { isAuthenticated } = useAuth();

  return (
    <NavigationContainer>
      {isAuthenticated ? <MainAppNavigator /> : <AuthStack />}
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <AccessibilityProvider>
      <AuthProvider>
        <StatusBar style="auto" />
        <RootNavigator />
      </AuthProvider>
    </AccessibilityProvider>
  );
}