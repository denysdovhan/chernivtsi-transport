import React, { Component } from 'react';
import L from 'leaflet';
import EventStreamClient from './sse-client';
import renderSVG from './svg';

const tileLayer = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';

class App extends Component {
  mapEl = React.createRef();

  markers = new Map();

  componentDidMount() {
    this.map = L.map(this.mapEl.current, {
      center: [48.2916063, 25.9345009],
      zoom: 13
    });

    L.tileLayer(tileLayer).addTo(this.map);

    const stream = new EventStreamClient('http://localhost:3001/events');

    stream.receive((data, event) => {
      console.log('receive data:', event);

      data.forEach(tracker => {
        if (this.markers.has(tracker.id)) {
          return this.markers
            .get(tracker.id)
            .setLatLng([tracker.latitude, tracker.longitude])
            .setIcon(
              L.icon({
                iconUrl: renderSVG({
                  speed: tracker.speed,
                  angle: tracker.direction
                }),
                iconAnchor: [55, 40]
              })
            );
        }

        const marker = L.marker([tracker.latitude, tracker.longitude], {
          icon: L.icon({
            iconUrl: renderSVG({
              speed: tracker.speed,
              angle: tracker.direction
            }),
            iconAnchor: [55, 40]
          })
        }).addTo(this.map);

        this.markers.set(tracker.id, marker);
      });
    });
  }

  render() {
    return <div ref={this.mapEl} style={{ height: '100%' }} />;
  }
}

export default App;
