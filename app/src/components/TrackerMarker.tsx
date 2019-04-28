import React, { memo, useRef } from 'react';
import * as L from 'leaflet';
import * as RL from 'react-leaflet';
import { toSVG } from '../utils';

export interface TrackerMarkerProps {
  position: L.LatLngTuple;
  speed: number;
  angle: number;
  detailed?: boolean;
  name?: string;
  color?: string;
  onClick?(e: React.SyntheticEvent): void;
}

const TrackerMarker: React.SFC<TrackerMarkerProps> = memo(
  ({
    position,
    speed,
    angle,
    detailed = true,
    name = 'Невідомий',
    color = 'gray',
    ...props
  }) => {
    const markerRef = useRef(null);

    return (
      <RL.Marker
        ref={markerRef}
        position={position}
        icon={L.icon({
          iconUrl: toSVG({
            speed,
            angle,
            text: name,
            stroke: color,
            detailed
          }),
          iconAnchor: [13, 19],
          className: 'animated-marker'
        })}
        onMoveStart={console.log}
        {...props}
      />
    );
  }
);

export default TrackerMarker;
