import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import PannelList from './src/pages/PannelList';
import { WebsocketProvider } from './src/contexts/WebsocketContext';
import React, { useEffect } from 'react';
import * as ScreenOrientation from 'expo-screen-orientation';

export default function App() {
  useEffect(() => {
    ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE);
  }, []);

  return (
    <WebsocketProvider>
      <View style={styles.container}>
        <PannelList/>
      </View>
    </WebsocketProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'stretch',
    justifyContent: 'center',
  },
});
