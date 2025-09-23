import React from 'react';
import { StyleSheet, View, Dimensions } from 'react-native';
import MapView, { Marker } from 'react-native-maps';

export default function MapScreen({ navigation }) {
  const stations = [
    {
      id: 'pune_jn',
      name: 'Pune Junction',
      coords: { latitude: 18.5286, longitude: 73.8745 },
      description: 'Wheelchair accessible, elevators available',
    },
    {
      id: 'shivajinagar',
      name: 'Shivajinagar Station',
      coords: { latitude: 18.5331, longitude: 73.8540 },
      description: 'Check ramps, elevators under maintenance',
    },
    {
      id: 'swargate',
      name: 'Swargate Bus Stop',
      coords: { latitude: 18.5057, longitude: 73.8562 },
      description: 'Wheelchair accessible, no elevators',
    },
  ];

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: 18.5204,
          longitude: 73.8567,
          latitudeDelta: 0.07,
          longitudeDelta: 0.07,
        }}
      >
        {stations.map(station => (
          <Marker
            key={station.id}
            coordinate={station.coords}
            title={station.name}
            description={station.description}
            onPress={() => navigation.navigate('StationDetails', { station })}
          />
        ))}
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { width: Dimensions.get('window').width, height: Dimensions.get('window').height },
});
