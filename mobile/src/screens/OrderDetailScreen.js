import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

export default function OrderDetailScreen() {
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.heading}>Order #ORD001</Text>
      <View style={styles.card}>
        <Text style={styles.label}>Status: Delivered</Text>
        <Text style={styles.label}>Date: Feb 8, 2026</Text>
        <Text style={styles.label}>Total: ₹999</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F5F5', padding: 16 },
  heading: { fontSize: 18, fontWeight: 'bold', marginBottom: 16 },
  card: { backgroundColor: '#FFF', padding: 16, borderRadius: 8 },
  label: { marginBottom: 10 },
});
