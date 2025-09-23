import React from 'react';
import { View, Text, Button, ScrollView, StyleSheet } from 'react-native';

export default function StationDetails({ route, navigation }) {
  const { station } = route.params;

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>{station.name}</Text>
      <Text style={styles.description}>{station.description}</Text>
      <Button title="Go Back" onPress={() => navigation.goBack()} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 12 },
  description: { fontSize: 16, marginBottom: 12 },
});
