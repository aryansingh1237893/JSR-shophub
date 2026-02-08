import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

export default function ProfileScreen({ navigation }) {
  const menuItems = [
    { label: 'My Addresses', icon: 'location-on', screen: 'Addresses' },
    { label: 'Notifications', icon: 'notifications', screen: 'Notifications' },
    { label: 'Settings', icon: 'settings', screen: 'Settings' },
  ];

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <MaterialIcons name="account-circle" size={64} color="#FF9500" />
        <Text style={styles.name}>User Name</Text>
        <Text style={styles.email}>user@email.com</Text>
      </View>

      {menuItems.map((item, idx) => (
        <TouchableOpacity key={idx} style={styles.menuItem} onPress={() => navigation.navigate(item.screen)}>
          <MaterialIcons name={item.icon} size={24} color="#FF9500" />
          <Text style={styles.menuLabel}>{item.label}</Text>
          <MaterialIcons name="chevron-right" size={24} color="#CCC" />
        </TouchableOpacity>
      ))}

      <TouchableOpacity style={styles.logoutBtn}>
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F5F5' },
  header: { backgroundColor: '#FFF', alignItems: 'center', paddingVertical: 24 },
  name: { fontSize: 18, fontWeight: 'bold', marginTop: 12 },
  email: { color: '#666', marginTop: 4 },
  menuItem: { backgroundColor: '#FFF', flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: '#EEE' },
  menuLabel: { flex: 1, marginLeft: 16, fontSize: 14 },
  logoutBtn: { margin: 16, backgroundColor: '#FF9500', paddingVertical: 14, borderRadius: 8, alignItems: 'center' },
  logoutText: { color: '#FFF', fontWeight: 'bold' },
});
