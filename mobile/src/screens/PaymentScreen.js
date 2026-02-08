import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

export default function PaymentScreen() {
  const [selectedMethod, setSelectedMethod] = React.useState('card');

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.heading}>Select Payment Method</Text>
      {['card', 'upi', 'wallet'].map((method) => (
        <TouchableOpacity
          key={method}
          style={[styles.methodCard, selectedMethod === method && styles.selected]}
          onPress={() => setSelectedMethod(method)}
        >
          <MaterialIcons name={method === 'card' ? 'credit-card' : method === 'upi' ? 'payment' : 'account-balance-wallet'} size={24} color="#FF9500" />
          <Text style={styles.methodName}>{method.toUpperCase()}</Text>
        </TouchableOpacity>
      ))}
      <TouchableOpacity style={styles.payBtn}>
        <Text style={styles.payBtnText}>Pay ₹999</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F5F5', padding: 16 },
  heading: { fontSize: 16, fontWeight: 'bold', marginBottom: 16 },
  methodCard: { backgroundColor: '#FFF', padding: 16, borderRadius: 8, marginBottom: 12, flexDirection: 'row', alignItems: 'center', borderWidth: 2, borderColor: '#DDD' },
  selected: { borderColor: '#FF9500' },
  methodName: { marginLeft: 12, fontSize: 14, fontWeight: '600' },
  payBtn: { backgroundColor: '#FF9500', paddingVertical: 14, borderRadius: 8, alignItems: 'center', marginTop: 24 },
  payBtnText: { color: '#FFF', fontSize: 16, fontWeight: 'bold' },
});
