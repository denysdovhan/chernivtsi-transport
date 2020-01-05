import React from 'react';
import * as L from 'leaflet';
import * as RL from 'react-leaflet';
import { toRawSVG } from '../svg';

export default () => {
  const detailed = true;

  return (
    <RL.Marker
      position={[48.2916063, 25.9345009]}
      icon={L.divIcon({
        html: toRawSVG({
          angle: 300,
          speed: 23,
          detailed
        }),
        iconAnchor: [13, 19],
        iconSize: [detailed ? 120 : 40, 40],
        className: null
      })}
    />
  );
};
