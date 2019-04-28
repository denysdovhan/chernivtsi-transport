import React, { ReactElement, useState, useContext, useCallback } from 'react';
import { useToggle } from 'react-use';
import styled from 'styled-components';
import { Tracker, Route } from '@chernivtsi-transport/api'; // eslint-disable-line
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

  // FILTER
  const [isFilterOpen, toggleFilter] = useToggle(false);
  const [filters, setFilter] = useState<string[]>([]);
  const handleCheckboxChange = useCallback(
    (route: Route) => (event: React.SyntheticEvent) => {
      const isChecked = filters.includes(route.id);

      if (isChecked) {
        return setFilter(filters.filter(id => id !== route.id));
      }

      return setFilter([...filters, route.id]);
    },
    [filters]
  );

  function applyFilter(
    allTrackers: Tracker[] = [],
    filterIds: string[] = []
  ): Tracker[] {
    if (filterIds.length === 0) return allTrackers;

    return allTrackers.filter(tracker => filterIds.includes(tracker.routeId));
  }

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
          trackers={applyFilter(trackers, filters)}
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
        {isFilterOpen && (
          <Card style={{ height: 300, overflow: 'scroll' }}>
            {routes.value.map(route => (
              <div key={route.id}>
                <input
                  type="checkbox"
                  checked={filters.includes(route.id)}
                  onChange={handleCheckboxChange(route)}
                />
                <span>{route.name}</span>
              </div>
            ))}
          </Card>
        )}
        <button type="button" onClick={resetToUserLocation}>
          {'📌'}
        </button>
        <button type="button" onClick={() => toggleFilter()}>
          Filter
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
