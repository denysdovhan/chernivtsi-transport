import React, { ReactElement } from 'react';
import L, { LatLngTuple } from 'leaflet';
import * as RL from 'react-leaflet';
import styled from 'styled-components';
import { Tracker, Route } from '@chernivtsi-transport/api'; // eslint-disable-line
import EventStreamClient from './sse-client';
import toSVG from './svg';
import { API_URI } from './config';

const tileLayer =
  'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png';
const attribution =
  '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>';

const root = {
  position: [48.2916063, 25.9345009] as LatLngTuple,
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
  z-index: 8888;
  bottom: 0;
  left: 0;
  right: 0;
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

interface UserMakerProps {
  position: LatLngTuple;
  accuracy: number;
}

const UserMaker: React.SFC<UserMakerProps> = ({
  position,
  accuracy = 7
}): ReactElement => (
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

interface AppState {
  viewport: {
    center: LatLngTuple;
    zoom: number;
  };
  currentMarkerId: string | null;
  markers: {
    loading: boolean;
    error: Error | null;
    data: Tracker[];
  };
  routes: {
    loading: boolean;
    error: Error | null;
    data: Route[];
  };
  userPosition: {
    latitude: number;
    longitude: number;
    accuracy: number;
  } | null;
}

class App extends React.Component<{}, AppState> {
  public state: AppState = {
    viewport: {
      center: [48.2916063, 25.9345009],
      zoom: 13
    },
    currentMarkerId: null,
    markers: {
      loading: true,
      error: null,
      data: []
    },
    routes: {
      loading: true,
      error: null,
      data: []
    },
    userPosition: null
  };

  public componentDidMount(): void {
    this.fetchRoutes()
      .then(this.setupClient)
      .then(this.watchPosition);
  }

  private fetchRoutes = () => {
    return fetch(`${API_URI}/routes`)
      .then((response: Response) => response.json())
      .then((data: Route[]) =>
        this.setState({ routes: { loading: false, error: null, data } })
      )
      .catch(console.error); // eslint-disable-line
  };

  private setupClient = () => {
    const stream: EventStreamClient = new EventStreamClient(
      `${API_URI}/events`
    );
    stream.receive((data: Tracker[]) => {
      if (Array.isArray(data)) {
        this.setState({ markers: { loading: false, error: null, data } });
      }
    });
  };

  private watchPosition = () => {
    if (navigator.geolocation) {
      navigator.geolocation.watchPosition(
        position => {
          const { userPosition } = this.state;

          if (userPosition) {
            return this.setState({
              viewport: {
                center: [position.coords.latitude, position.coords.longitude],
                zoom: 16
              },
              userPosition: {
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
                accuracy: position.coords.accuracy
              }
            });
          }

          return this.setState({
            userPosition: {
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
              accuracy: position.coords.accuracy
            }
          });
        },
        // eslint-disable-next-line
        error => console.error(error)
      );
    } else {
      // eslint-disable-next-line
      // Show error about missing geolocation
    }
  };

  private jumpToUserPosition = () => {
    if (this.state.userPosition) {
      this.setState(({ userPosition }) => {
        return {
          viewport: {
            center: [userPosition!.latitude, userPosition!.longitude],
            zoom: 16
          }
        };
      });
    }
  };

  public render(): ReactElement {
    const {
      routes,
      markers,
      viewport,
      currentMarkerId,
      userPosition
    } = this.state;

    if (routes.loading || markers.loading) {
      return <LoadingScreen>Loading...</LoadingScreen>;
    }

    return (
      <>
        <TopBar />
        <RL.Map
          center={root.position}
          zoom={13}
          maxZoom={20}
          minZoom={12}
          maxBounds={[
            [48.37778737618847, 25.789501368999485],
            [48.1783186753248, 26.095058619976047]
          ]}
          zoomControl={false}
          style={{ height: '100%' }}
          onClick={() => this.setState({ currentMarkerId: null })}
          viewport={viewport}
        >
          <RL.TileLayer url={tileLayer} attribution={attribution} />
          {markers.data.map((marker: Tracker) => {
            const routeForMarker = routes.data.find(
              route => route.id === marker.routeId
            );

            return (
              <RL.Marker
                key={marker.id}
                position={[marker.latitude, marker.longitude]}
                icon={L.icon({
                  iconUrl: toSVG({
                    speed: marker.speed,
                    angle: marker.angle,
                    text: routeForMarker ? routeForMarker.name : 'Невідомий',
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
