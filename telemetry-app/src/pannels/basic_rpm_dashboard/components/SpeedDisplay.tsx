import React from 'react';
import { View, StyleSheet, Text } from 'react-native';


export const SpeedDisplay = ({ speed }: { speed: number }) => {
  return (
    <View style={styles.speedBox}>
      <Text style={styles.speedText}>{speed} km/h</Text>
    </View>
  );
}


const styles = StyleSheet.create({
  
  speedBox: {
    marginTop: 20,
  },
  speedText: {
    fontSize: 32,
    color: 'white',
    fontWeight: 'bold',
  },

});