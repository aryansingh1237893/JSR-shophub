import React from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity } from 'react-native';

const MockProducts = [
  { _id: '1', name: 'Product 1', price: 999, image: 'https://via.placeholder.com/100', rating: 4.5 },
  { _id: '2', name: 'Product 2', price: 1499, image: 'https://via.placeholder.com/100', rating: 4.2 },
];

export default function ProductListScreen() {
  return (
    <View style={styles.container}>
      <FlatList
        data={MockProducts}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.product}>
            <Image source={{uri: item.image}} style={styles.img} />
            <Text style={styles.name}>{item.name}</Text>
            <Text style={styles.price}>₹{item.price}</Text>
          </TouchableOpacity>
        )}
        keyExtractor={(item) => item._id}
        numColumns={2}
        columnWrapperStyle={styles.row}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F5F5', padding: 8 },
  row: { justifyContent: 'space-between' },
  product: { flex: 1, margin: 8, backgroundColor: '#FFF', borderRadius: 8, padding: 10, alignItems: 'center' },
  img: { width: 100, height: 100, borderRadius: 8 },
  name: { fontSize: 12, fontWeight: '600', marginTop: 8 },
  price: { fontSize: 14, color: '#FF9500', fontWeight: 'bold' },
});
