import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Platform
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import { fetchFlightsFromAmadeus } from '../api/amadeus';
import { useNavigation } from '@react-navigation/native';

export default function FlightsScreen() {
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [tripType, setTripType] = useState('oneway');
  const [departureDate, setDepartureDate] = useState(new Date());
  const [returnDate, setReturnDate] = useState(new Date());

  const [showDeparture, setShowDeparture] = useState(false);
  const [showReturn, setShowReturn] = useState(false);

  const [passengers, setPassengers] = useState('1');
  const [travelClass, setTravelClass] = useState('ECONOMY');

  const navigation = useNavigation();

  const handleSearch = async () => {
    try {
      const formatDate = (d) => d.toISOString().split('T')[0];

      const params = {
        originLocationCode: origin,
        destinationLocationCode: destination,
        departureDate: formatDate(departureDate),
        adults: passengers,
        travelClass: travelClass,
        ...(tripType === 'roundtrip' && { returnDate: formatDate(returnDate) }),
        max: 10,
      };

      const flights = await fetchFlightsFromAmadeus(params);

      navigation.navigate('FlightResultsScreen', { flights });
    } catch (error) {
      console.error(error);
      alert("Erreur lors de la récupération des vols.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Recherche de Vols ✈️</Text>

      {/* Trip Type Selector */}
      <View style={styles.tripTypeContainer}>
        {['oneway', 'roundtrip', 'multi'].map((type) => (
          <TouchableOpacity
            key={type}
            style={[styles.tripTypeButton, tripType === type && styles.selectedButton]}
            onPress={() => setTripType(type)}
          >
            <Text style={tripType === type ? styles.selectedText : styles.tripTypeText}>
              {type === 'oneway' ? 'Aller simple' : type === 'roundtrip' ? 'Aller-retour' : 'Multi-destinations'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Origin & Destination */}
      <TextInput
        style={styles.input}
        placeholder="Départ (ex: ALG)"
        value={origin}
        onChangeText={setOrigin}
        autoCapitalize="characters"
      />
      <TextInput
        style={styles.input}
        placeholder="Arrivée (ex: CDG)"
        value={destination}
        onChangeText={setDestination}
        autoCapitalize="characters"
      />

      {/* Departure Date Picker */}
      <TouchableOpacity style={styles.input} onPress={() => setShowDeparture(true)}>
        <Text style={styles.dateText}>📅 Aller : {departureDate.toDateString()}</Text>
      </TouchableOpacity>
      {showDeparture && (
        <DateTimePicker
          value={departureDate}
          mode="date"
          display="default"
          onChange={(event, selectedDate) => {
            setShowDeparture(false);
            if (selectedDate) setDepartureDate(selectedDate);
          }}
        />
      )}

      {/* Return Date Picker */}
      {tripType === 'roundtrip' && (
        <>
          <TouchableOpacity style={styles.input} onPress={() => setShowReturn(true)}>
            <Text style={styles.dateText}>🔁 Retour : {returnDate.toDateString()}</Text>
          </TouchableOpacity>
          {showReturn && (
            <DateTimePicker
              value={returnDate}
              mode="date"
              display="default"
              onChange={(event, selectedDate) => {
                setShowReturn(false);
                if (selectedDate) setReturnDate(selectedDate);
              }}
            />
          )}
        </>
      )}

      {/* Passengers */}
      <TextInput
        style={styles.input}
        placeholder="Nombre de passagers"
        value={passengers}
        onChangeText={setPassengers}
        keyboardType="numeric"
      />

      {/* Travel Class */}
      <View style={styles.pickerContainer}>
        <Text style={styles.pickerLabel}>Classe :</Text>
        <Picker
          selectedValue={travelClass}
          style={styles.picker}
          onValueChange={(itemValue) => setTravelClass(itemValue)}
        >
          <Picker.Item label="Économie" value="ECONOMY" />
          <Picker.Item label="Premium Économie" value="PREMIUM_ECONOMY" />
          <Picker.Item label="Affaires" value="BUSINESS" />
          <Picker.Item label="Première" value="FIRST" />
        </Picker>
      </View>

      {/* Search Button */}
      <TouchableOpacity style={styles.button} onPress={handleSearch}>
        <Text style={styles.buttonText}>Rechercher</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#f5f5f5', paddingTop: 60 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },

  tripTypeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20
  },
  tripTypeButton: {
    flex: 1,
    marginHorizontal: 5,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: '#e0e0e0',
    alignItems: 'center'
  },
  tripTypeText: { fontSize: 14, color: '#333' },
  selectedButton: { backgroundColor: '#2E86DE' },
  selectedText: { fontSize: 14, color: '#fff', fontWeight: 'bold' },

  input: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
    marginBottom: 20,
    fontSize: 16,
    borderColor: '#ccc',
    borderWidth: 1
  },
  dateText: { fontSize: 16, color: '#333' },

  pickerContainer: {
    backgroundColor: '#fff',
    borderRadius: 8,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 20,
    padding: Platform.OS === 'ios' ? 5 : 0
  },
  pickerLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
    marginLeft: 10,
    marginTop: 10
  },
  picker: {
    height: 50,
    width: '100%'
  },

  button: {
    backgroundColor: '#2E86DE',
    padding: 15,
    borderRadius: 8
  },
  buttonText: { color: '#fff', fontSize: 16, textAlign: 'center', fontWeight: 'bold' }
});
