import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

import MapScreen from './src/screens/MapScreen';
// import StationList from './src/screens/StationList';
import RoutePlanner from './src/screens/RoutePlanner';

const Tab = createBottomTabNavigator();

export default function App() {
  return (
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
            }

            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: '#2b8a3e', // green highlight
          tabBarInactiveTintColor: 'gray',
        })}
      >
        <Tab.Screen name="Map" component={MapScreen} />
        {/* <Tab.Screen name="Stations" component={StationList} /> */}
        <Tab.Screen name="Route Planner" component={RoutePlanner} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
