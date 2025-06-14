import React from 'react';
import { View, StyleSheet } from 'react-native';


export const RpmBar = ({ rpm }: { rpm: number }) => {
  const totalBlocks = 10;
  const activeBlocks = Math.round((rpm / 8000) * totalBlocks);
  return (
    <View style={styles.rpmBar}>
      {Array.from({ length: totalBlocks }).map((_, i) => (
        <View
          key={i}
          style={[
            styles.rpmBlock,
            {
              backgroundColor: i < activeBlocks ? (i > 7 ? 'red' : 'lime') : '#444',
            },
          ]}
        />
      ))}
    </View>
  );
}


const styles = StyleSheet.create({
    rpmBar: {
      flexDirection: 'row',
      marginTop: 30,
    },
    rpmBlock: {
      width: 20,
      height: 20,
      margin: 2,
      borderRadius: 4,
    },
  });