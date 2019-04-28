import { useState, useEffect, useContext, useCallback } from 'react';
import { useEffectOnce, useAsync, useBoolean, useGeolocation } from 'react-use';
import { GeoLocationSensorState } from 'react-use/lib/useGeolocation';
import { Tracker, Route } from '@chernivtsi-transport/api'; // eslint-disable-line
import { withinBounds } from './utils';
import EventStreamClient from './utils/sse';
import { API_URI, MAP_DETAILED_ZOOM_THRESHOLD } from './config';
import { ViewportContext } from './components';

export function useTrackers(): Tracker[] {
  const [trackers, setTrackers] = useState<Tracker[]>([]);

  useEffectOnce(() => {
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
  });

  return trackers;
}

// eslint-disable-next-line
export function useRoutes() {
  return useAsync<Route[]>(
    () =>
      fetch(`${API_URI}/routes`).then((response: Response) => response.json()),
    []
  );
}

export function useUserLocation(): [GeoLocationSensorState | null, () => void] {
  const [viewport, setViewport] = useContext(ViewportContext);
  const [location, setLocation] = useState<GeoLocationSensorState | null>(null);
  const [determined, setDetermined] = useBoolean(false);
  const geolocation = useGeolocation();

  function isLocated(state: GeoLocationSensorState | null): boolean {
    return !!state && !!state.latitude && !!state.longitude;
  }

  useEffect(() => {
    if (!isLocated(geolocation)) return;

    const userCoords: L.PointTuple = [
      Number(geolocation.latitude),
      Number(geolocation.longitude)
    ];

    if (!withinBounds(userCoords)) return;

    setLocation(geolocation);

    if (!determined) {
      setDetermined();
      setViewport({ center: userCoords, zoom: MAP_DETAILED_ZOOM_THRESHOLD });
    }
  }, [geolocation]);

  const resetToUserLocation = useCallback(() => {
    if (!isLocated(geolocation)) return;

    const userCoords: L.PointTuple = [
      Number(geolocation.latitude),
      Number(geolocation.longitude)
    ];

    if (!withinBounds(userCoords)) return;

    setViewport({ center: userCoords, zoom: MAP_DETAILED_ZOOM_THRESHOLD });
  }, [geolocation]);

  return [location, resetToUserLocation];
}
