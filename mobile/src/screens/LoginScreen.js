import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <MaterialIcons name="shopping-bag" size={48} color="#FF9500" />
        <Text style={styles.title}>ShopHub</Text>
        <Text style={styles.subtitle}>Welcome Back!</Text>
      </View>

      <View style={styles.form}>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Password</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
        </View>

        <TouchableOpacity onPress={() => navigation.navigate('ForgotPassword')}>
          <Text style={styles.forgotText}>Forgot Password?</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.loginBtn}>
          <Text style={styles.loginBtnText}>Login</Text>
        </TouchableOpacity>

        <View style={styles.divider}>
          <View style={styles.line} />
          <Text style={styles.dividerText}>OR</Text>
          <View style={styles.line} />
        </View>

        <TouchableOpacity style={styles.otpBtn}>
          <MaterialIcons name="mobile-screen-share" size={20} color="#FF9500" />
          <Text style={styles.otpBtnText}>Login with OTP</Text>
        </TouchableOpacity>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Don't have an account? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
            <Text style={styles.signupLink}>Sign Up</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF' },
  header: { alignItems: 'center', paddingTop: 60, paddingBottom: 40 },
  title: { fontSize: 28, fontWeight: 'bold', color: '#000', marginTop: 12 },
  subtitle: { fontSize: 14, color: '#666', marginTop: 4 },
  form: { paddingHorizontal: 20 },
  inputGroup: { marginBottom: 20 },
  label: { fontSize: 14, fontWeight: '600', color: '#000', marginBottom: 8 },
  input: { borderWidth: 1, borderColor: '#DDD', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 12, fontSize: 14 },
  forgotText: { color: '#FF9500', textAlign: 'right', fontSize: 13, fontWeight: '600', marginBottom: 20 },
  loginBtn: { backgroundColor: '#FF9500', paddingVertical: 14, borderRadius: 8, alignItems: 'center', marginBottom: 16 },
  loginBtnText: { color: '#FFF', fontSize: 16, fontWeight: 'bold' },
  divider: { flexDirection: 'row', alignItems: 'center', marginVertical: 20 },
  line: { flex: 1, height: 1, backgroundColor: '#DDD' },
  dividerText: { marginHorizontal: 12, color: '#999', fontSize: 12 },
  otpBtn: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#FF9500', paddingVertical: 12, borderRadius: 8, marginBottom: 20 },
  otpBtnText: { color: '#FF9500', marginLeft: 8, fontWeight: 'bold' },
  footer: { flexDirection: 'row', justifyContent: 'center', paddingVertical: 20 },
  footerText: { color: '#666', fontSize: 14 },
  signupLink: { color: '#FF9500', fontWeight: 'bold' },
});

export default LoginScreen;
