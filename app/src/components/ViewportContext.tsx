import React, { memo } from 'react';
import { useSetState } from 'react-use';
import { Viewport } from '../types';
import { MAP_DEFAULT_POSITION } from '../config';

type ViewportSetter = (viewport: Partial<Viewport>) => void;
type ViewportState = [Viewport, ViewportSetter];

const ViewportContext = React.createContext<ViewportState>([
  MAP_DEFAULT_POSITION,
  () => {}
]);

export function useViewport(): ViewportState {
  return useSetState<Viewport>(MAP_DEFAULT_POSITION);
}

export const ViewportProvider: React.SFC<{}> = memo(props => (
  <ViewportContext.Provider value={useViewport()} {...props} />
));

export default ViewportContext;
