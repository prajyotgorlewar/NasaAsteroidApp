import { useState } from 'react';
import { StyleSheet, Text, View, TextInput, Button, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';

export default function HomeScreen() {
  const [asteroidId, setAsteroidId] = useState('');
  const navigation = useNavigation();

  const handleSubmit = () => {
    if (!asteroidId.trim()) {
      Alert.alert('Error', 'Please enter an asteroid ID');
      return;
    }
    navigation.navigate('AsteroidDetails', { id: asteroidId });
  };

  const fetchRandomAsteroid = async () => {
    try {
      const response = await axios.get('https://api.nasa.gov/neo/rest/v1/neo/browse?api_key=DEMO_KEY');
      const asteroids = response.data.near_earth_objects;
      const randomAsteroid = asteroids[Math.floor(Math.random() * asteroids.length)];
      navigation.navigate('AsteroidDetails', { id: randomAsteroid.id });
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Failed to fetch random asteroid');
    }
  };

  return (
    <View style={styles.container}>
      <Text>Enter Asteroid ID:</Text>
      <TextInput
        style={styles.input}
        placeholder="Search Here"
        value={asteroidId}
        onChangeText={setAsteroidId}
      />
      <Button title="Submit" onPress={handleSubmit} disabled={!asteroidId.trim()} />
      <Button title="Random Asteroid" onPress={fetchRandomAsteroid} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    width: '100%',
    marginVertical: 10,
    paddingHorizontal: 10,
  },
});
