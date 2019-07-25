import React from 'react';
import * as RL from 'react-leaflet';
import {
  MAP_DEFAULT_POSITION,
  MAP_BOUNDS,
  MAP_TILE_LAYER,
  MAP_ATTRIBUTION
} from '../config';
import { Viewport } from '../types';

interface MapProps extends RL.MapProps {
  onClick?: () => void;
  onViewportChange?: (viewport: Viewport) => void;
}

const Map: React.SFC<MapProps> = ({ children, ...props }) => (
  <RL.Map
    {...MAP_DEFAULT_POSITION}
    maxZoom={20}
    minZoom={12}
    maxBounds={MAP_BOUNDS}
    zoomControl={false}
    style={{ height: '100%' }}
    {...props}
  >
    <RL.TileLayer url={MAP_TILE_LAYER} attribution={MAP_ATTRIBUTION} />
    {children}
  </RL.Map>
);

export default Map;
