import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

export default function OrderTrackingScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Order Tracking</Text>
      {['Confirmed', 'Packed', 'Shipped', 'Delivered'].map((step, idx) => (
        <View key={idx} style={styles.step}>
          <MaterialIcons name={idx <= 1 ? 'check-circle' : 'radio-button-unchecked'} size={24} color={idx <= 1 ? '#4CAF50' : '#CCC'} />
          <Text style={styles.stepText}>{step}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF', padding: 16 },
  heading: { fontSize: 18, fontWeight: 'bold', marginBottom: 20 },
  step: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  stepText: { marginLeft: 12, fontSize: 14 },
});
