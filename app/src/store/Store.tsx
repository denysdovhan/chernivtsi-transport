import React, { useReducer } from 'react';
import { Viewport } from '../types';
import { Tracker, Route } from '@chernivtsi-transport/api'; // eslint-disable-line

const StoreContext = React.createContext({});

interface AppState {
  viewport: Viewport;
  currentMarkerId: string | null;
  markers: {
    loading: boolean;
    error: Error | null;
    data: Tracker[];
  };
  routes: {
    loading: boolean;
    error: Error | null;
    data: Route[];
  };
  userPosition: {
    latitude: number;
    longitude: number;
    accuracy: number;
  } | null;
}

interface StoreProps<AppState> {
  initialValue: AppState;
  rootReducer: (
    initialValue: AppState,
    action: { type: string; payload?: any }
  ) => AppState;
  children: React.ReactChild;
}

export default function Store(props: StoreProps<AppState>): React.ReactElement {
  const initialState = props.rootReducer(props.initialValue, {
    type: '__INIT__'
  });

  const [state, dispatch] = useReducer(props.rootReducer, initialState);

  return (
    <StoreContext.Provider value={[state, dispatch]}>
      {props.children}
    </StoreContext.Provider>
  );
}
