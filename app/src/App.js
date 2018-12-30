import React, { Component } from 'react';
import L from 'leaflet';
import * as RL from 'react-leaflet';
import EventStreamClient from './sse-client';
import renderSVG from './svg';

const api = 'http://localhost:3001';
const tileLayer = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';

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
      console.log('receive data:', event);
      if (Array.isArray(markers)) {
        this.setState({ markers });
      }
    });
  }

  render() {
    const { routes, markers } = this.state;

    return (
      <RL.Map center={root.position} zoom={13} style={{ height: '100%' }}>
        <RL.TileLayer
          attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          url={tileLayer}
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
                iconAnchor: [55, 40]
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
