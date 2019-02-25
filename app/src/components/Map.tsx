import React from 'react';
import * as RL from 'react-leaflet';
import {
  MAP_TILE_LAYER,
  MAP_ATTRIBUTION,
  MAP_DEFAULT_POSITION
} from '../config';
import { Viewport } from '../types';

interface MapProps extends RL.MapProps {
  onClick?: () => void;
  onViewportChange?: (viewport: Viewport) => void;
}

export default function Map({
  children,
  ...props
}: MapProps): React.ReactElement {
  return (
    <RL.Map
      {...MAP_DEFAULT_POSITION}
      maxZoom={20}
      minZoom={12}
      maxBounds={[
        [48.3777873761884, 25.789501368999485],
        [48.1783186753248, 26.095058619976047]
      ]}
      zoomControl={false}
      style={{ height: '100%' }}
      {...props}
    >
      <RL.TileLayer url={MAP_TILE_LAYER} attribution={MAP_ATTRIBUTION} />
      {children}
    </RL.Map>
  );
}
