import React from 'react';
import * as RL from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { View, StyleSheet } from 'react-native';

export const MAP_DEFAULT_POSITION = {
  center: [48.2916063, 25.9345009],
  zoom: 13
};

export const MAP_TILE_LAYER =
  'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png';

export const MAP_ATTRIBUTION =
  '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignContent: 'center'
  },
  map: {
    height: '100%'
  }
});

export default () => (
  <View style={styles.container}>
    <RL.Map
      center={[48.2916063, 25.9345009]}
      zoom={13}
      maxZoom={20}
      minZoom={12}
      zoomControl={false}
      style={{ height: '100%' }}
    >
      <RL.TileLayer url={MAP_TILE_LAYER} attribution={MAP_ATTRIBUTION} />
      <RL.Marker position={[48.2916063, 25.9345009]}>
        <RL.Popup>A pretty CSS3 popup.</RL.Popup>
      </RL.Marker>
    </RL.Map>
  </View>
);
