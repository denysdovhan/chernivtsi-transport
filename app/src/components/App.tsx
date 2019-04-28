import React, { ReactElement, useState, useContext } from 'react';
import styled from 'styled-components';
import { Tracker } from '@chernivtsi-transport/api'; // eslint-disable-line
import { useTrackers, useRoutes, useUserLocation } from '../hooks';
import {
  Card,
  UserMarker,
  LoadingScreen,
  Map,
  Trackers,
  ViewportContext
} from '.';
import { MAP_DETAILED_ZOOM_THRESHOLD } from '../config';

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

export const App: React.SFC = (): ReactElement => {
  const [viewport, setViewport] = useContext(ViewportContext);
  const [selectedMarker, setSelectedMarker] = useState<string | null>(null);
  const [userLocation, resetToUserLocation] = useUserLocation();
  const routes = useRoutes();
  const trackers = useTrackers();

  if (routes.loading || !routes.value) {
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
        {userLocation && userLocation.latitude && userLocation.longitude && (
          <UserMarker
            position={[userLocation.latitude, userLocation.longitude]}
            accuracy={userLocation.accuracy}
          />
        )}
      </Map>
      <BottomBar>
        <button type="button" onClick={resetToUserLocation}>
          x
        </button>
        {selectedMarker && (
          <Card>
            <pre>
              {JSON.stringify(
                trackers.find(tracker => tracker.id === selectedMarker),
                null,
                2
              )}
            </pre>
          </Card>
        )}
      </BottomBar>
    </>
  );
};

export default App;
