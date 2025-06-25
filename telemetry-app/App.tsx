import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import PannelList from './src/pages/PannelList';
import { WebsocketProvider } from './src/contexts/WebsocketContext';

export default function App() {
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
