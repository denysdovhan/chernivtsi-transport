import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, InteractionManager } from 'react-native';
import MapView, { Marker } from 'react-native-maps';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  map: {
    // Custom styles
    ...StyleSheet.absoluteFillObject
  }
});

export default props => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    InteractionManager.runAfterInteractions(() => {
      setLoading(false);
    });
  }, [setLoading, InteractionManager]);

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        rotateEnabled={false}
        initialRegion={{
          latitude: 48.2916063,
          longitude: 25.9345009,
          latitudeDelta: 0.15,
          longitudeDelta: 0.05
        }}
      >
        {props.children}
      </MapView>
    </View>
  );
};
