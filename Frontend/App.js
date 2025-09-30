import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { AccessibilityProvider } from './src/context/AccessibilityContext';

import MapScreen from './src/screens/MapScreen';
import StationDetails from './src/screens/StationDetails';
import ReportIssue from './src/screens/ReportIssue';
import RoutePlanner from './src/screens/RoutePlanner';
import StationList from './src/screens/StationList';
import EmergencyScreen from './src/screens/EmergencyScreen';
import SettingsScreen from './src/screens/SettingsScreen';

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
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <AccessibilityProvider>
      <StatusBar style="auto" />
      <NavigationContainer>
        <Tab.Navigator
          screenOptions={({ route }) => ({
            tabBarIcon: ({ focused, color, size }) => {
              let iconName;

              if (route.name === 'Map') {
                iconName = focused ? 'map' : 'map-outline';
              } else if (route.name === 'Stations') {
                iconName = focused ? 'train' : 'train-outline';
              } else if (route.name === 'Route Planner') {
                iconName = focused ? 'navigate' : 'navigate-outline';
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
            component={RoutePlanner}
            options={{ tabBarLabel: 'Routes' }}
          />
          <Tab.Screen 
            name="Settings" 
            component={SettingsStack}
            options={{ tabBarLabel: 'Settings' }}
          />
        </Tab.Navigator>
      </NavigationContainer>
    </AccessibilityProvider>
  );
}