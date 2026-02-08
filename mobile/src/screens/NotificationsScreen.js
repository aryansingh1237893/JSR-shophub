import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';

const MockNotifications = [
  { id: '1', title: 'Order Confirmed', message: 'Your order #ORD001 has been confirmed' },
];

export default function NotificationsScreen() {
  return (
    <View style={styles.container}>
      <FlatList
        data={MockNotifications}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.message}>{item.message}</Text>
          </View>
        )}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F5F5', padding: 16 },
  card: { backgroundColor: '#FFF', padding: 12, borderRadius: 8, marginBottom: 10 },
  title: { fontSize: 14, fontWeight: 'bold', marginBottom: 4 },
  message: { color: '#666', fontSize: 13 },
});
