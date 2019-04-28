import { Viewport } from './types';

export const { NODE_ENV, PUBLIC_URL, REACT_APP_API_URI } = process.env;

export const API_URI =
  REACT_APP_API_URI || `http://${window.location.hostname}:3001/api`;

export const MAP_TILE_LAYER =
  'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png';

export const MAP_ATTRIBUTION =
  '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>';

export const MAP_DEFAULT_POSITION: Viewport = {
  center: [48.2916063, 25.9345009],
  zoom: 13
};

export const MAP_DETAILED_ZOOM_THRESHOLD = 16;
