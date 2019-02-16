import React from 'react';
import L from 'leaflet';
import * as RL from 'react-leaflet';
import styled from 'styled-components';
import EventStreamClient from './sse-client';
import renderSVG from './svg';
import { API_URI } from './config';

const tileLayer =
  'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png';
const attribution =
  '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>';

const root = {
  position: [48.2916063, 25.9345009],
  zoom: 13
};

const LoadingScreen = styled.div`
  background-color: yellow;
  height: 100%;
  width: 100%;
`;

const TopBar = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 999;
  width: 100%;
  min-height: 55px;
  overflow: auto;
  background-image: linear-gradient(
    rgba(255, 255, 255, 1) 10%,
    rgba(255, 255, 255, 0) 100%
  );
`;

const BottomBar = styled.div`
  position: fixed;
  height: 250px;
  z-index: 8888;
  overflow-y: scroll;
`;

const Card = styled.div`
  background-color: white;
  margin: 0.5rem;
  padding: 1rem;
  border-radius: 5px;
  color: #666;
  box-shadow: 0 2px 3px #d6d6d6;
  border: 1px solid #eee;
`;

const UserMaker = ({ position, accuracy = 7 }) => (
  <>
    <RL.Circle center={position} radius={accuracy} weight={1} />
    <RL.CircleMarker
      center={position}
      radius={7}
      fillColor="#3388ff"
      color="#2277ee"
      fillOpacity={1}
    />
  </>
);

class App extends React.Component {
  state = {
    currentMarkerId: null,
    markers: {
      isLoading: true,
      data: []
    },
    routes: {
      isLoading: true,
      data: []
    },
    userPosition: null
  };

  componentDidMount() {
    this.fetchRoutes();
    this.setupClient();
    this.watchPosition();
  }

  fetchRoutes = () => {
    fetch(`${API_URI}/routes`)
      .then(response => response.json())
      .then(data => this.setState({ routes: { isLoading: false, data } }))
      .catch(console.error); // eslint-disable-line
  };

  setupClient = () => {
    const stream = new EventStreamClient(`${API_URI}/events`);
    stream.receive(data => {
      if (Array.isArray(data)) {
        this.setState({ markers: { isLoading: false, data } });
      }
    });
  };

  watchPosition = () => {
    if (navigator.geolocation) {
      navigator.geolocation.watchPosition(
        position => {
          this.setState({
            userPosition: {
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
              accuracy: position.coords.accuracy
            }
          });
        },
        error => console.error(error)
      );
    } else {
      alert('no geo');
    }
  };

  render() {
    const { routes, markers, currentMarkerId, userPosition } = this.state;

    if (routes.isLoading || markers.isLoading) {
      return <LoadingScreen />;
    }

    return (
      <>
        <TopBar>
          <Card>Пошук за маршрутом</Card>
        </TopBar>
        <RL.Map
          center={root.position}
          zoom={13}
          // maxZoom={20}
          // minZoom={12}
          // maxBounds={[
          //   [48.37778737618847, 25.789501368999485],
          //   [48.1783186753248, 26.095058619976047]
          // ]}
          zoomControl={false}
          style={{ height: '100%' }}
          onClick={() => this.setState({ currentMarkerId: null })}
          onViewportChanged={console.log}
        >
          <RL.TileLayer url={tileLayer} attribution={attribution} />
          {markers.data.map(marker => {
            const routeForMarker = routes.data.find(
              route => route.id === marker.routeId
            );

            return (
              <RL.Marker
                key={marker.id}
                position={[marker.latitude, marker.longitude]}
                icon={L.icon({
                  iconUrl: renderSVG({
                    speed: marker.speed,
                    angle: marker.direction,
                    text: routeForMarker ? routeForMarker.name : 'A',
                    stroke: routeForMarker ? routeForMarker.color : 'gray'
                  }),
                  iconAnchor: [13, 19]
                })}
                onClick={() => this.setState({ currentMarkerId: marker.id })}
              />
            );
          })}
          {userPosition && (
            <UserMaker
              position={[userPosition.latitude, userPosition.longitude]}
              accuracy={userPosition.accuracy}
            />
          )}
        </RL.Map>
        <BottomBar>
          {currentMarkerId && (
            <Card>
              <h3>Card 1</h3>
              {JSON.stringify(
                markers.data.find(marker => marker.id === currentMarkerId),
                null,
                2
              )}
            </Card>
          )}
        </BottomBar>
      </>
    );
  }
}

export default App;
