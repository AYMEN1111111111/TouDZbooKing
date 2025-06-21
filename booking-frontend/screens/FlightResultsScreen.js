import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Image
} from 'react-native';
import { useRoute } from '@react-navigation/native';

export default function FlightResultsScreen() {
  const route = useRoute();
  const { flights } = route.params || {};

  const [nonStopOnly, setNonStopOnly] = useState(false);
  const [showDZD, setShowDZD] = useState(false);
  const exchangeRate = 145; // 1 EUR = 145 DZD (fixed)

  if (!flights || flights.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.noFlights}>Aucun vol trouvé.</Text>
      </View>
    );
  }

  const formatTime = (isoString) => {
    const date = new Date(isoString);
    return `${date.getHours()}h${String(date.getMinutes()).padStart(2, '0')}`;
  };

  const renderSegments = (segments, label) => (
    <View style={styles.segmentBlock}>
      <Text style={styles.segmentLabel}>{label}</Text>
      {segments.map((segment, index) => (
        <View key={index} style={styles.segment}>
          <Text style={styles.airport}>
            {segment.departure.iataCode} ({formatTime(segment.departure.at)}) ➔ {segment.arrival.iataCode} ({formatTime(segment.arrival.at)})
          </Text>
          <Text style={styles.duration}>Durée : {segment.duration.replace('PT', '').toLowerCase()}</Text>
        </View>
      ))}
    </View>
  );

  const renderItem = ({ item }) => {
    const outboundSegments = item.itineraries[0]?.segments || [];
    const inboundSegments = item.itineraries[1]?.segments || [];
    const airline = item.validatingAirlineCodes[0];
    const price = parseFloat(item.price.total);
    const currency = item.price.currency;

    return (
      <View style={styles.card}>
        <View style={styles.row}>
          <Text style={styles.airline}>Compagnie: {airline}</Text>
          <Image
            source={{
              uri: `https://content.airhex.com/content/logos/airlines_${airline}_200_200_s.png?fallback=default.png`
            }}
            style={styles.logo}
          />
        </View>

        {renderSegments(outboundSegments, '🛫 Aller')}
        {inboundSegments.length > 0 && renderSegments(inboundSegments, '🔁 Retour')}

        <Text style={styles.price}>
          💰 {price} {currency}
          {showDZD && ` ≈ ${Math.round(price * exchangeRate)} DZD`}
        </Text>

        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Réserver</Text>
        </TouchableOpacity>
      </View>
    );
  };

  const filteredFlights = nonStopOnly
    ? flights.filter(flight =>
        flight.itineraries.every(it => it.segments.length === 1)
      )
    : flights;

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.filterBar}>
        <TouchableOpacity
          onPress={() => setNonStopOnly(!nonStopOnly)}
          style={[
            styles.filterButton,
            { backgroundColor: nonStopOnly ? '#2E86DE' : '#ccc' }
          ]}
        >
          <Text style={{ color: '#fff' }}>
            {nonStopOnly ? '✅ ' : '⬜ '}Sans escale
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setShowDZD(!showDZD)}
          style={[
            styles.filterButton,
            { backgroundColor: showDZD ? '#27AE60' : '#ccc', marginLeft: 10 }
          ]}
        >
          <Text style={{ color: '#fff' }}>
            {showDZD ? '✅ ' : '💱 '} Convertir en DZD
          </Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={filteredFlights}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f0f0f0'
  },
  noFlights: { fontSize: 18, color: 'gray' },
  list: { padding: 10 },

  filterBar: {
    flexDirection: 'row',
    padding: 10,
    backgroundColor: '#f8f8f8',
    borderBottomColor: '#ddd',
    borderBottomWidth: 1
  },
  filterButton: {
    padding: 10,
    borderRadius: 8,
    alignItems: 'center'
  },

  card: {
    backgroundColor: '#fff',
    padding: 15,
    marginVertical: 8,
    borderRadius: 12,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 }
  },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  airline: { fontSize: 16, fontWeight: 'bold', color: '#333' },
  logo: { width: 40, height: 40, borderRadius: 20 },

  segmentBlock: { marginTop: 10 },
  segmentLabel: { fontWeight: 'bold', marginBottom: 5, color: '#333' },
  segment: { marginBottom: 5 },
  airport: { fontSize: 15, fontWeight: '500' },
  duration: { fontSize: 12, color: '#777' },

  price: { marginTop: 10, fontSize: 16, color: '#2E86DE', fontWeight: 'bold' },
  button: {
    marginTop: 10,
    backgroundColor: '#2E86DE',
    paddingVertical: 8,
    borderRadius: 8
  },
  buttonText: { color: '#fff', textAlign: 'center', fontWeight: 'bold' }
});
