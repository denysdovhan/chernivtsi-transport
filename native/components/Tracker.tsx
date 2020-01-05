import React from 'react';
import { Marker } from 'react-native-maps';
import { SvgXml } from 'react-native-svg';
import { toRawSVG } from '../svg';

export default () => {
  const detailed = true;

  return (
    <Marker
      coordinate={{
        latitude: 48.2916063,
        longitude: 25.9345009
      }}
      title="Point"
      description="Description"
      anchor={{
        x: detailed ? 0.4 : 0,
        y: 0
      }}
      centerOffset={{
        x: detailed ? 40 : 0,
        y: 0
      }}
    >
      <SvgXml
        xml={toRawSVG({
          angle: 300,
          speed: 23,
          detailed
        })}
      />
    </Marker>
  );
};
