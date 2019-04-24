import React from 'react';
import * as L from 'leaflet';
import * as RL from 'react-leaflet';

interface UserMakerProps {
  position: L.LatLngTuple;
  accuracy: number | null;
}

const UserMaker: React.SFC<UserMakerProps> = ({
  position,
  accuracy = 7
}): React.ReactElement => (
  <>
    <RL.Circle center={position} radius={Number(accuracy)} weight={1} />
    <RL.CircleMarker
      center={position}
      radius={7}
      fillColor="#3388ff"
      color="#2277ee"
      fillOpacity={1}
    />
  </>
);

export default UserMaker;
