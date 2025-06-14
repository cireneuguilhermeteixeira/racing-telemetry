import React from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { useState } from 'react';
import templates from '../templates';


export default function PannelList() {
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);

  if (selectedTemplate) {
    const template = templates.find(t => t.id === selectedTemplate);
    return template?.component || null;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Selecionar Template</Text>
      <FlatList
        data={templates}
        keyExtractor={item => item.id}
        numColumns={2}
        contentContainerStyle={styles.grid}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() => setSelectedTemplate(item.id)}
          >
            <Text style={styles.cardText}>{item.name}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000', paddingTop: 60, alignItems: 'center' },
  title: { color: 'white', fontSize: 24, marginBottom: 20 },
  grid: { paddingHorizontal: 10 },
  card: {
    backgroundColor: '#222',
    margin: 10,
    padding: 20,
    borderRadius: 10,
    width: 140,
    alignItems: 'center',
  },
  cardText: { color: 'white', fontSize: 16 },
});
