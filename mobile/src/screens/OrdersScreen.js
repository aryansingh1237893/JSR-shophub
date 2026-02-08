import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';

const MockOrders = [
  { id: '1', orderId: '#ORD001', total: '₹999', status: 'Delivered' },
  { id: '2', orderId: '#ORD002', total: '₹1499', status: 'In Transit' },
];

export default function OrdersScreen() {
  return (
    <View style={styles.container}>
      <FlatList
        data={MockOrders}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.orderId}>{item.orderId}</Text>
            <Text style={styles.total}>{item.total}</Text>
            <Text style={[styles.status, item.status === 'Delivered' ? styles.delivered : styles.transit]}>{item.status}</Text>
          </View>
        )}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F5F5', padding: 16 },
  card: { backgroundColor: '#FFF', padding: 12, borderRadius: 8, marginBottom: 12 },
  orderId: { fontSize: 14, fontWeight: 'bold' },
  total: { color: '#FF9500', fontWeight: 'bold', marginVertical: 6 },
  status: { fontSize: 12 },
  delivered: { color: '#4CAF50' },
  transit: { color: '#FF9500' },
});
