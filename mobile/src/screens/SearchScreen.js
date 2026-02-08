import React from 'react';
import { View, Text, StyleSheet, TextInput } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

export default function SearchScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.searchBar}>
        <MaterialIcons name="search" size={24} color="#FF9500" />
        <TextInput placeholder="Search products..." style={styles.input} autoFocus />
      </View>
      <Text style={styles.noResults}>No results yet. Start typing to search.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF', padding: 16 },
  searchBar: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#DDD', borderRadius: 8, paddingHorizontal: 12, marginBottom: 20 },
  input: { flex: 1, paddingVertical: 12, marginLeft: 8 },
  noResults: { color: '#666', textAlign: 'center', marginTop: 40 },
});
