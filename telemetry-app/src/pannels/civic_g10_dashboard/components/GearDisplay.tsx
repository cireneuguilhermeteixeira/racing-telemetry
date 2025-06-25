import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text } from 'react-native';




const GearDisplay = ({ gear }: { gear: number }) => {
  return (
    <View style={styles.gearBox}>
      <Text style={styles.gearText}>⚙️ {gear === 0 ? 'N' : gear}</Text>
    </View>
  );
}

export default GearDisplay;

const styles = StyleSheet.create({
  gearBox: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#222',
    borderRadius: 10,
    shadowColor: '#00BFFF',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.6,
    shadowRadius: 4,
  },
  gearText: {
    color: 'white',
    fontSize: 26,
    fontWeight: 'bold',
    fontFamily: 'Helvetica Neue',
  },
});
