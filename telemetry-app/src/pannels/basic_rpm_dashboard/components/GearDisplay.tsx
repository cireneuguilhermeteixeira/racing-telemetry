import React from 'react';
import { View, StyleSheet, Text } from 'react-native';

export const GearDisplay = ({ gear }: { gear: number }) => {
  return (
    <View style={styles.gearBox}>
      <Text style={styles.gearText}>⚙️ {gear === 0 ? 'N' : gear}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
    gearBox: {
      marginTop: 20,
      padding: 10,
      backgroundColor: '#222',
      borderRadius: 10,
    },
    gearText: {
      color: 'white',
      fontSize: 24,
    },
  });