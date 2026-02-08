import React from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native';

export default function OTPVerifyScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Enter OTP</Text>
      <Text style={styles.subtitle}>Code sent to your phone</Text>
      <TextInput style={styles.input} placeholder="Enter 6-digit OTP" keyboardType="numeric" />
      <TouchableOpacity style={styles.btn}>
        <Text style={styles.btnText}>Verify OTP</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 20, paddingTop: 40, backgroundColor: '#FFF' },
  title: { fontSize: 24, fontWeight: 'bold' },
  subtitle: { color: '#666', marginVertical: 12 },
  input: { borderWidth: 1, borderColor: '#DDD', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 12, marginBottom: 16 },
  btn: { backgroundColor: '#FF9500', paddingVertical: 14, borderRadius: 8, alignItems: 'center' },
  btnText: { color: '#FFF', fontWeight: 'bold' },
});
