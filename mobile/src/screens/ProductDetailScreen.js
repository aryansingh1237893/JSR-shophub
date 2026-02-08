import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

export default function ProductDetailScreen({ navigation }) {
  return (
    <ScrollView style={styles.container}>
      <Image source={{uri: 'https://via.placeholder.com/300'}} style={styles.image} />
      <View style={styles.details}>
        <Text style={styles.name}>Product Name</Text>
        <View style={styles.ratingRow}>
          <MaterialIcons name="star" size={16} color="#FFB800" />
          <Text style={styles.rating}>4.5 (120 reviews)</Text>
        </View>
        <Text style={styles.price}>₹999</Text>
        <Text style={styles.desc}>Product description goes here...</Text>
        <TouchableOpacity style={styles.addBtn}>
          <Text style={styles.addBtnText}>Add to Cart</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF' },
  image: { width: '100%', height: 300, backgroundColor: '#F0F0F0' },
  details: { padding: 16 },
  name: { fontSize: 20, fontWeight: 'bold', marginBottom: 8 },
  ratingRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  rating: { marginLeft: 8, fontSize: 14 },
  price: { fontSize: 22, color: '#FF9500', fontWeight: 'bold', marginBottom: 12 },
  desc: { color: '#666', marginBottom: 20 },
  addBtn: { backgroundColor: '#FF9500', paddingVertical: 14, borderRadius: 8, alignItems: 'center' },
  addBtnText: { color: '#FFF', fontSize: 16, fontWeight: 'bold' },
});
