import React from 'react';
import { View, Text, StyleSheet, Switch, ScrollView } from 'react-native';

export default function SettingsScreen() {
  const [notifications, setNotifications] = React.useState(true);
  const [darkMode, setDarkMode] = React.useState(false);

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.heading}>Preferences</Text>

      <View style={styles.settingCard}>
        <Text style={styles.label}>Push Notifications</Text>
        <Switch value={notifications} onValueChange={setNotifications} />
      </View>

      <View style={styles.settingCard}>
        <Text style={styles.label}>Dark Mode</Text>
        <Switch value={darkMode} onValueChange={setDarkMode} />
      </View>

      <Text style={{marginTop: 20, fontSize: 12, color: '#999', textAlign: 'center'}}>ShopHub v1.0.0</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F5F5', padding: 16 },
  heading: { fontSize: 18, fontWeight: 'bold', marginBottom: 16 },
  settingCard: { backgroundColor: '#FFF', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 12, borderRadius: 8, marginBottom: 10 },
  label: { fontSize: 14 },
});
