import React from 'react';
import { Tracker, Route } from '@chernivtsi-transport/api'; // eslint-disable-line
import { TrackerMarker } from '.';

interface TrackersProps {
  trackers: Tracker[];
  routes: Route[];
  detailed?: boolean;
  onTrackerClick?: (tracker: Tracker, event: React.SyntheticEvent) => void;
}

function Trackers({
  trackers,
  routes,
  onTrackerClick,
  detailed = true
}: TrackersProps): React.ReactElement {
  function handleMarkerClick(
    tracker: Tracker
  ): (e: React.SyntheticEvent) => void {
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
        // FIXME: To be memoized
        const routeForMarker = routes.find(
          route => route.id === tracker.routeId
        );

        if (tracker.id !== 'trans-gps:149') {
          // return null;
        }

        return (
          <TrackerMarker
            key={tracker.id}
            position={[tracker.latitude, tracker.longitude]}
            speed={tracker.speed}
            angle={tracker.angle}
            name={routeForMarker && routeForMarker.name}
            color={routeForMarker && routeForMarker.color}
            detailed={detailed}
            onClick={handleMarkerClick(tracker)}
          />
        );
      })}
    </>
  );
}

export default Trackers;
