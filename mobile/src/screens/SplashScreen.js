import React from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

export default function SplashScreen() {
  return (
    <View style={styles.container}>
      <MaterialIcons name="shopping-bag" size={80} color="#FF9500" />
      <Text style={styles.title}>ShopHub</Text>
      <ActivityIndicator size="large" color="#FF9500" style={{marginTop: 30}} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#FFF' },
  title: { fontSize: 32, fontWeight: 'bold', color: '#FF9500', marginTop: 16 },
});
