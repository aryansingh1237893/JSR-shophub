import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView } from 'react-native';

const SignupScreen = ({ navigation }) => {
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', password: '' });

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Create Account</Text>
      {['name', 'email', 'phone', 'password'].map((field) => (
        <View key={field} style={styles.inputGroup}>
          <Text style={styles.label}>{field.charAt(0).toUpperCase() + field.slice(1)}</Text>
          <TextInput
            style={styles.input}
            placeholder={`Enter ${field}`}
            value={formData[field]}
            onChangeText={(val) => setFormData({...formData, [field]: val})}
            secureTextEntry={field === 'password'}
          />
        </View>
      ))}
      <TouchableOpacity style={styles.btn}>
        <Text style={styles.btnText}>Create Account</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('Login')}>
        <Text style={styles.link}>Already have account? Login</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF', paddingHorizontal: 20, paddingTop: 40 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 24 },
  inputGroup: { marginBottom: 16 },
  label: { fontSize: 14, fontWeight: '600', marginBottom: 8 },
  input: { borderWidth: 1, borderColor: '#DDD', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 12 },
  btn: { backgroundColor: '#FF9500', paddingVertical: 14, borderRadius: 8, alignItems: 'center', marginTop: 24 },
  btnText: { color: '#FFF', fontSize: 16, fontWeight: 'bold' },
  link: { color: '#FF9500', textAlign: 'center', marginTop: 16, fontWeight: '600' },
});

export default SignupScreen;
