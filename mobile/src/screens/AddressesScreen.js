import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const MockAddresses = [
  { id: '1', type: 'Home', address: '123 Main St, City', default: true },
];

export default function AddressesScreen() {
  return (
    <View style={styles.container}>
      <FlatList
        data={MockAddresses}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.header}>
              <Text style={styles.type}>{item.type}</Text>
              {item.default && <View style={styles.defaultBadge}><Text style={styles.badgeText}>Default</Text></View>}
            </View>
            <Text style={styles.address}>{item.address}</Text>
          </View>
        )}
        keyExtractor={(item) => item.id}
        ListFooterComponent={
          <TouchableOpacity style={styles.addBtn}>
            <MaterialIcons name="add" size={24} color="#FF9500" />
            <Text style={styles.addBtnText}>Add New Address</Text>
          </TouchableOpacity>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F5F5', padding: 16 },
  card: { backgroundColor: '#FFF', padding: 12, borderRadius: 8, marginBottom: 12 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  type: { fontSize: 14, fontWeight: 'bold' },
  defaultBadge: { backgroundColor: '#FF9500', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 4 },
  badgeText: { color: '#FFF', fontSize: 10, fontWeight: '600' },
  address: { color: '#666', fontSize: 13 },
  addBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#FFF', paddingVertical: 16, borderRadius: 8, borderWidth: 1, borderColor: '#DDD', borderStyle: 'dashed' },
  addBtnText: { marginLeft: 8, color: '#FF9500', fontWeight: 'bold' },
});
