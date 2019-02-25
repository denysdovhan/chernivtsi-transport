import React, { SyntheticEvent } from 'react';
import * as L from 'leaflet';
import * as RL from 'react-leaflet';
import { Tracker, Route } from '@chernivtsi-transport/api'; // eslint-disable-line
import toSVG from '../utils/svg';

interface TrackersProps {
  trackers: Tracker[];
  routes: Route[];
  detailed?: boolean;
  onTrackerClick?: (tracker: Tracker, event: SyntheticEvent) => void;
}

export default function Trackers({
  trackers,
  routes,
  onTrackerClick,
  detailed = true
}: TrackersProps): React.ReactElement {
  function handleMarkerClick(tracker: Tracker): (e: SyntheticEvent) => void {
    return event => {
      if (onTrackerClick) {
        return onTrackerClick(tracker, event);
      }
      return undefined;
    };
  }

  return (
    <>
      {trackers.map((tracker: Tracker) => {
        const routeForMarker = routes.find(
          route => route.id === tracker.routeId
        );

        return (
          <RL.Marker
            key={tracker.id}
            position={[tracker.latitude, tracker.longitude]}
            icon={L.icon({
              iconUrl: toSVG({
                speed: tracker.speed,
                angle: tracker.angle,
                text: routeForMarker ? routeForMarker.name : 'Невідомий',
                stroke: routeForMarker ? routeForMarker.color : 'gray',
                detailed
              }),
              iconAnchor: [13, 19],
              className: 'animated-marker'
            })}
            onClick={handleMarkerClick(tracker)}
          />
        );
      })}
    </>
  );
}
