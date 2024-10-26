import { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Alert, Linking } from 'react-native';
import axios from 'axios';
import { useRoute } from '@react-navigation/native';

export default function AsteroidDetailsScreen() {
  const route = useRoute();
  const { id } = route.params as { id: string };
  const [asteroidData, setAsteroidData] = useState(null);

  useEffect(() => {
    const fetchAsteroidData = async () => {
      try {
        const response = await axios.get(`https://api.nasa.gov/neo/rest/v1/neo/${id}?api_key=YOUR_API_KEY`);
        setAsteroidData(response.data);
      } catch (error) {
        console.error(error);
        Alert.alert('Error', 'Failed to fetch asteroid data');
      }
    };
    fetchAsteroidData();
  }, [id]);

  if (!asteroidData) {
    return <Text>Loading...</Text>;
  }

  return (
    <View style={styles.container}>
      <Text>Name: {asteroidData.name}</Text>
      <Text>
        NASA JPL URL: 
        <Text style={{ color: 'blue' }} onPress={() => Linking.openURL(asteroidData.nasa_jpl_url)}>
          {asteroidData.nasa_jpl_url}
        </Text>
      </Text>
      <Text>
        Is Potentially Hazardous: {asteroidData.is_potentially_hazardous_asteroid ? 'Yes' : 'No'}
      </Text>
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
});
