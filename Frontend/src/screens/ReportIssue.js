import React, { useState } from 'react';
import { View, Text, Button, StyleSheet, TextInput } from 'react-native';

export default function ReportIssue({ route, navigation }) {
  const { station } = route.params; // station passed from StationDetails
  const [issue, setIssue] = useState('');

  const handleSubmit = () => {
    if (issue.trim() === '') return;

    // For now, just console log (later push to Firebase)
    console.log(`Issue reported for ${station.name}: ${issue}`);

    // Go back to StationDetails with issue info
    navigation.navigate('StationDetails', { station, reportedIssue: issue });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Report an Issue</Text>
      <Text style={styles.station}>Station: {station.name}</Text>

      <TextInput
        style={styles.input}
        placeholder="Describe the issue (e.g. Elevator not working)"
        value={issue}
        onChangeText={setIssue}
      />

      <Button title="Submit Report" onPress={handleSubmit} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 12 },
  station: { fontSize: 18, marginBottom: 12 },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 12,
    marginBottom: 16,
    borderRadius: 6,
  },
});
