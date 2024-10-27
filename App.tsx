import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Alert, Text, Linking } from 'react-native';
import axios from 'axios';

const API_KEY = '1UChvHUEdaetDedrA8XMFANxrgEmS0leFcRGcxB4'; 

interface AsteroidData {
  id: string;
  name: string;
  nasa_jpl_url: string;
  is_potentially_hazardous_asteroid: boolean;
}

export default function App() {
  const [asteroidId, setAsteroidId] = useState<string>('');
  const [asteroidData, setAsteroidData] = useState<AsteroidData | null>(null);

  const fetchAsteroidData = async (id: string) => {
    try {
      const response = await axios.get<AsteroidData>(
        `https://api.nasa.gov/neo/rest/v1/neo/${id}?api_key=${API_KEY}`
      );
      setAsteroidData(response.data);
    } catch (error) {
      Alert.alert('Error', 'Could not retrieve asteroid data. Please check the ID and try again.');
    }
  };

  const fetchRandomAsteroidData = async () => {
    try {
      const response = await axios.get<{ near_earth_objects: AsteroidData[] }>(
        `https://api.nasa.gov/neo/rest/v1/neo/browse?api_key=${API_KEY}`
      );
      const asteroids = response.data.near_earth_objects;
      const randomAsteroid = asteroids[Math.floor(Math.random() * asteroids.length)];
      fetchAsteroidData(randomAsteroid.id);
    } catch (error) {
      Alert.alert('Error', 'Could not retrieve random asteroid data. Please try again later.');
    }
  };

  return (
    <View style={styles.container}>
      {!asteroidData ? (
        <>
          <TextInput
            style={styles.input}
            placeholder="Search Here"
            value={asteroidId}
            onChangeText={setAsteroidId}
          />
          <Button
            title="Submit"
            onPress={() => fetchAsteroidData(asteroidId)}
            disabled={!asteroidId}
          />
          <Button title="Random Asteroid" onPress={fetchRandomAsteroidData} />
        </>
      ) : (
        <View style={styles.detailsContainer}>
          <Text style={styles.label}>Name:</Text>
          <Text style={styles.value}>{asteroidData.name}</Text>

          <Text style={styles.label}>NASA JPL URL:</Text>
          <Text style={styles.value} onPress={() => Linking.openURL(asteroidData.nasa_jpl_url)}>
            {asteroidData.nasa_jpl_url}
          </Text>

          <Text style={styles.label}>Hazardous:</Text>
          <Text style={styles.value}>
            {asteroidData.is_potentially_hazardous_asteroid ? 'Yes' : 'No'}
          </Text>
          <Button title="Back to Search" onPress={() => setAsteroidData(null)} />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  input: {
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  detailsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  label: {
    fontWeight: 'bold',
    fontSize: 18,
    marginBottom: 5,
  },
  value: {
    fontSize: 16,
    marginBottom: 20,
  },
});
