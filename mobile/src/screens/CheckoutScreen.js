import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';

export default function CheckoutScreen({ navigation }) {
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.heading}>Delivery Address</Text>
      <View style={styles.card}>
        <Text style={styles.label}>Select or add delivery address</Text>
        <TouchableOpacity style={styles.btn}>
          <Text style={styles.btnText}>Add New Address</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.heading} style={{marginTop: 20}}>Order Summary</Text>
      <View style={styles.card}>
        <Text>Subtotal: ₹999</Text>
        <Text>Shipping: Free</Text>
        <Text style={styles.total}>Total: ₹999</Text>
      </View>

      <TouchableOpacity style={styles.proceedBtn} onPress={() => navigation.navigate('Payment')}>
        <Text style={styles.proceedBtnText}>Proceed to Payment</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F5F5', padding: 16 },
  heading: { fontSize: 16, fontWeight: 'bold', marginBottom: 12 },
  card: { backgroundColor: '#FFF', padding: 12, borderRadius: 8, marginBottom: 16 },
  label: { color: '#666', marginBottom: 12 },
  btn: { backgroundColor: '#FF9500', paddingVertical: 10, borderRadius: 6, alignItems: 'center' },
  btnText: { color: '#FFF', fontWeight: 'bold' },
  total: { fontWeight: 'bold', marginTop: 8, fontSize: 16 },
  proceedBtn: { backgroundColor: '#FF9500', paddingVertical: 14, borderRadius: 8, alignItems: 'center', marginTop: 20 },
  proceedBtnText: { color: '#FFF', fontSize: 16, fontWeight: 'bold' },
});
