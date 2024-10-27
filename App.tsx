import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Alert, Text, Linking, TouchableOpacity, ImageBackground } from 'react-native';

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

  const renderButton1 = (title: string, onPress: () => void, disabled = false) => (
    <TouchableOpacity
      style={[styles.submitbutton, disabled && styles.buttonDisabled]}
      onPress={onPress}
      disabled={disabled}
    >
      <Text style={styles.buttonText}>{title}</Text>
    </TouchableOpacity>
  );

  const renderButton2 = (title: string, onPress: () => void, disabled = false) => (
    <TouchableOpacity
      style={[styles.button, disabled && styles.buttonDisabled]}
      onPress={onPress}
      disabled={disabled}
    >
      <Text style={styles.buttonText}>{title}</Text>
    </TouchableOpacity>
  );

  return (
    <ImageBackground
      source={require('./assets/background.jpg')} 
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.container}>
        {!asteroidData ? (
          <>
            <Text style={styles.title}>AstroTracker</Text>
            <TextInput
              style={styles.input}
              placeholder="Search Here ..."
              placeholderTextColor="#bbb"
              value={asteroidId}
              onChangeText={setAsteroidId}
            />
            {renderButton1("Submit", () => fetchAsteroidData(asteroidId), !asteroidId)}
            <Text style={styles.smalltext}>
              OR
            </Text>
            {renderButton2("Random Asteroid", fetchRandomAsteroidData)}
          </>
        ) : (
          <View style={styles.detailsContainer}>
            <Text style={styles.label}>Name:</Text>
            <Text style={styles.value}>{asteroidData.name}</Text>

            <Text style={styles.label}>NASA JPL URL:</Text>
            <Text 
              style={styles.valueLink} 
              onPress={() => Linking.openURL(asteroidData.nasa_jpl_url)}
            >
              {asteroidData.nasa_jpl_url}
            </Text>

            <Text style={styles.label}>Hazardous:</Text>
            <Text style={styles.value}>
              {asteroidData.is_potentially_hazardous_asteroid ? 'Yes' : 'No'}
            </Text>
            {renderButton1("Back to Search", () => setAsteroidData(null))}
          </View>
        )}
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    justifyContent: 'center',
    padding: 20,
    backgroundColor: 'rgba(0, 31, 63, 0.8)',
    borderRadius: 30,
    
  },
  title: {
    fontSize: 30,
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 20,
    fontWeight: 'bold',
  },
  input: {
    height: 50,
    borderColor: '#FFffff',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 30,
    paddingHorizontal: 10,
    color: '#3d3d3d',
    backgroundColor: '#ffffff',
    fontWeight: 'bold'
  },
  detailsContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  label: {
    fontWeight: 'bold',
    fontSize: 18,
    color: '#FF4F00',
    marginBottom: 5,
  },
  value: {
    fontSize: 16,
    color: '#FFFFFF',
    marginBottom: 20,
  },
  valueLink: {
    fontSize: 16,
    color: '#00BFFF',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#00cdfe',
    borderRadius: 25,
    paddingVertical: 12,
    paddingHorizontal: 20,
    marginBottom: 15,
    alignItems: 'center',
    width: 200,
    alignSelf: 'center',
  },

  submitbutton: {
    backgroundColor: '#ff3558',
    borderRadius: 25,
    paddingVertical: 12,
    paddingHorizontal: 20,
    marginBottom: 15,
    alignItems: 'center',
    width: 200,
    alignSelf: 'center',
  },

  buttonDisabled: {
    backgroundColor: '#7B7B7B',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  smalltext: {
    color: 'white',
    textAlign: 'center',
    marginBottom: 15,
  }
});