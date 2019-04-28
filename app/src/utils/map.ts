/* eslint import/prefer-default-export: 0 */
import * as L from 'leaflet';
import { MAP_BOUNDS } from '../config';

export function withinBounds(coords: L.LatLngTuple): boolean {
  const bounds: L.Bounds = L.bounds(MAP_BOUNDS);
  return bounds.contains(coords);
}
