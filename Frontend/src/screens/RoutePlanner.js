import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';

export default function RoutePlanner() {
  const [start, setStart] = useState('');
  const [end, setEnd] = useState('');
  const [result, setResult] = useState(null);

  // Example stations with accessibility info
  const stations = {
    'pune junction': { name: 'Pune Junction', wheelchair: true, elevators: true },
    'shivajinagar': { name: 'Shivajinagar', wheelchair: true, elevators: false },
    'swargate': { name: 'Swargate', wheelchair: true, elevators: false },
  };

  const findRoute = () => {
    const s = stations[start.toLowerCase()];
    const e = stations[end.toLowerCase()];

    if (!s || !e) {
      setResult('⚠️ Invalid station names. Try Pune Junction, Shivajinagar, or Swargate.');
      return;
    }

    let route = `Route from ${s.name} → ${e.name}`;
    let accessibility = '';

    if (s.wheelchair && e.wheelchair) {
      accessibility += '\n✅ Wheelchair accessible';
    } else {
      accessibility += '\n❌ Some stations not wheelchair accessible';
    }

    if (s.elevators && e.elevators) {
      accessibility += '\n✅ Elevators available';
    } else {
      accessibility += '\n⚠️ Elevators missing at some stations';
    }

    setResult(route + accessibility);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Accessible Route Planner</Text>

      <TextInput
        style={styles.input}
        placeholder="Enter Start Station (e.g. Pune Junction)"
        value={start}
        onChangeText={setStart}
      />

      <TextInput
        style={styles.input}
        placeholder="Enter End Station (e.g. Swargate)"
        value={end}
        onChangeText={setEnd}
      />

      <Button title="Find Route" onPress={findRoute} />

      {result && <Text style={styles.result}>{result}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 12 },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 6,
    marginBottom: 12,
  },
  result: { marginTop: 20, fontSize: 16, fontWeight: '500' },
});
