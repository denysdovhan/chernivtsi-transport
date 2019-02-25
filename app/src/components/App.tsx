import React, { ReactElement } from 'react';
import styled from 'styled-components';
import { Tracker, Route } from '@chernivtsi-transport/api'; // eslint-disable-line
import EventStreamClient from '../utils/sse';
import { API_URI, MAP_DETAILED_ZOOM_THRESHOLD } from '../config';
import { Card, UserMarker, LoadingScreen, Map } from '.';
import { AppState, Viewport } from '../types';
import Trackers from './Trackers';

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
    stream.receive<Tracker[]>((data: Tracker[] | null) => {
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

          if (!userPosition) {
            return this.setState({
              viewport: {
                center: [position.coords.latitude, position.coords.longitude],
                zoom: MAP_DETAILED_ZOOM_THRESHOLD
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

  private handleViewportChange = (viewport: Viewport): void => {
    this.setState({ viewport });
  };

  public render(): ReactElement {
    const {
      routes,
      markers,
      currentMarkerId,
      userPosition,
      viewport
    } = this.state;

    if (routes.loading || markers.loading) {
      return <LoadingScreen />;
    }

    return (
      <>
        <TopBar />
        <Map
          {...viewport}
          onClick={() => this.setState({ currentMarkerId: null })}
          onViewportChange={this.handleViewportChange}
        >
          <Trackers
            trackers={markers.data}
            routes={routes.data}
            onTrackerClick={tracker =>
              this.setState({ currentMarkerId: tracker.id })
            }
            detailed={viewport.zoom >= MAP_DETAILED_ZOOM_THRESHOLD}
          />
          {userPosition && (
            <UserMarker
              position={[userPosition.latitude, userPosition.longitude]}
              accuracy={userPosition.accuracy}
            />
          )}
        </Map>
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
