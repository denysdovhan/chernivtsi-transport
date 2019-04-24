import React, { ReactElement, useState, useEffect } from 'react';
import styled from 'styled-components';
import { useGeolocation, useAsync } from 'react-use';
import { Tracker, Route } from '@chernivtsi-transport/api'; // eslint-disable-line
import EventStreamClient from '../utils/sse';
import { API_URI, MAP_DETAILED_ZOOM_THRESHOLD } from '../config';
import { Card, UserMarker, LoadingScreen, Map } from '.';
import { Viewport } from '../types';
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

function useTrackers(): [Tracker[], (trackers: Tracker[]) => void] {
  const [trackers, setTrackers] = useState<Tracker[]>([]);

  useEffect(() => {
    let stream: EventStreamClient | null = new EventStreamClient(
      `${API_URI}/events`
    );

    stream.receive<Tracker[]>((data: Tracker[] | null) => {
      if (Array.isArray(data)) {
        setTrackers(data);
      }
    });

    return () => {
      stream = null;
    };
  }, []);

  return [trackers, setTrackers];
}

export const App: React.SFC = (): ReactElement => {
  const [viewport, setViewport] = useState<Viewport>({
    center: [48.2916063, 25.9345009],
    zoom: 13
  });
  const [selectedMarker, setSelectedMarker] = useState<string | null>(null);
  const [trackers] = useTrackers();
  const userLocation = useGeolocation();
  const routes = useAsync<Route[]>(
    () =>
      fetch(`${API_URI}/routes`).then((response: Response) => response.json()),
    []
  );

  useEffect(() => {
    if (userLocation && userLocation.latitude && userLocation.longitude) {
      setViewport({
        center: [Number(userLocation.latitude), Number(userLocation.longitude)],
        zoom: MAP_DETAILED_ZOOM_THRESHOLD
      });
    }
  }, []);

  if (routes.loading && !routes.value) {
    return <LoadingScreen />;
  }

  return (
    <>
      <TopBar />
      <Map
        {...viewport}
        onClick={() => setSelectedMarker(null)}
        onViewportChange={setViewport}
      >
        <Trackers
          trackers={trackers}
          routes={routes.value || []} // @TODO: Better solution
          onTrackerClick={tracker => setSelectedMarker(tracker.id)}
          detailed={viewport.zoom >= MAP_DETAILED_ZOOM_THRESHOLD}
        />
        {userLocation.latitude && userLocation.longitude && (
          <UserMarker
            position={[userLocation.latitude, userLocation.longitude]}
            accuracy={userLocation.accuracy}
          />
        )}
      </Map>
      <BottomBar>
        {selectedMarker && (
          <Card>
            {JSON.stringify(
              trackers.find(tracker => tracker.id === selectedMarker),
              null,
              2
            )}
          </Card>
        )}
      </BottomBar>
    </>
  );
};

export default App;
