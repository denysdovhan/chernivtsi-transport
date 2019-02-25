import { LatLngTuple } from 'leaflet';
import { Tracker, Route } from '@chernivtsi-transport/api'; // eslint-disable-line

export interface Viewport {
  center: LatLngTuple;
  zoom: number;
}

export interface AppState {
  viewport: Viewport;
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
