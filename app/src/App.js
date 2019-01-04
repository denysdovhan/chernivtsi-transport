import React, { Component } from 'react';
import L from 'leaflet';
import * as RL from 'react-leaflet';
import EventStreamClient from './sse-client';
import renderSVG from './svg';
import MapBoxGLLayer from './MapboxGL';

const api = 'http://192.168.0.106:3001';
const tileLayer =
  'https://maps.tilehosting.com/c/3e872111-766b-403a-8b3e-82feeccc6995/styles/bright/style.json?key=Mu3jnev7PZ551DrAd6cY';

const root = {
  position: [48.2916063, 25.9345009],
  zoom: 13
};

class App extends Component {
  state = {
    markers: [],
    routes: []
  };

  componentDidMount() {
    fetch(`${api}/routes`)
      .then(response => response.json())
      .then(routes => this.setState({ routes }))
      .catch(console.error);

    const stream = new EventStreamClient(`${api}/events`);

    stream.receive((markers, event) => {
      console.log('receive data:', markers);
      if (Array.isArray(markers)) {
        this.setState({ markers });
      }
    });
  }

  render() {
    const { routes, markers } = this.state;

    return (
      <RL.Map
        center={root.position}
        zoom={13}
        zoomControl={false}
        style={{ height: '100%' }}
        onViewportChange={console.log}
      >
        <MapBoxGLLayer
          attribution={`<a href="https://www.maptiler.com/license/maps/" target="_blank">© MapTiler</a> <a href="https://www.openstreetmap.org/copyright" target="_blank">© OpenStreetMap contributors</a>`}
          accessToken="not-needed"
          style={tileLayer}
        />
        {markers.map(marker => {
          const route = routes.find(route => route.id === marker.routeId);

          return (
            <RL.Marker
              key={marker.id}
              position={[marker.latitude, marker.longitude]}
              icon={L.icon({
                iconUrl: renderSVG({
                  speed: marker.speed,
                  angle: marker.direction,
                  text: route ? route.name : 'A',
                  stroke: route ? route.color : 'gray'
                }),
                iconAnchor: [13, 19]
              })}
            >
              <RL.Popup>{JSON.stringify(marker, null, 2)}</RL.Popup>
            </RL.Marker>
          );
        })}
      </RL.Map>
    );
  }
}

export default App;
