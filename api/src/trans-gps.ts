import fetch, { Response } from 'node-fetch';
import { Route, Tracker } from './types';

// TODO: Collect route's checkpoints

export const namespace = 'trans-gps';

export const baseUrl = 'http://www.trans-gps.cv.ua/map';

export const api = {
  routes: [`${baseUrl}/routes/1`, `${baseUrl}/routes/2`],
  trackers: `${baseUrl}/tracker/?selectedRoutesStr=`
};

export interface TransGPSRoute {
  id: number; // route id, tracker's routeId is referenced to this field
  name: string; // public route name
  colour: string; // route color, i.e: 'deeppink'.
  code: string;
  sort: number;
  display: number;
}

export interface TransGPSTracker {
  id: number;
  lat: number; // latitude, i.e '48.32459333333333'
  lng: number; // longitude, i.e '25.933766666666667'
  orientation: string; // angle, i.e '000.00'
  speed: string; // speed, i.e '000.0'
  gpstime: string; // datetime, i.e '2018-12-23 15:16:27'
  routeId: number; // reference to id in route scheme
  // rest...
  imei: string; // IMEI id of GPS-tracker, i.e '355227045600277'
  name: string; // i.e 'A115'
  stateCode: string; // i.e 'used'. FIXME: Should be enum
  stateName: string; // i.e 'used'. FIXME: Should be enum
  routeName: string; // public number of route, i.e 'A'
  routeColour: string; // color on map, i.e 'navy'
  inDepo: boolean; // is on route
  busNumber: string; // i.e '0745'
  perevId: number; // provider id
  perevName: string; // provider name, i.e 'Денисівка'
  remark: string; // i.e '0745',
  online: boolean;
}

export function toRoute({ id, name, colour, ...rest }: TransGPSRoute): Route {
  return {
    id: `${namespace}:${id}`,
    name,
    color: colour,
    ...rest
  };
}

export function toTracker({
  id,
  lat,
  lng,
  orientation,
  speed,
  gpstime,
  routeId,
  ...rest
}: TransGPSTracker): Tracker {
  return {
    id: `${namespace}:${id}`,
    latitude: lat,
    longitude: lng,
    angle: Number(orientation),
    speed: Number(speed),
    datetime: gpstime,
    routeId: `${namespace}:${routeId}`,
    ...rest
  };
}

export function fetchRoutes(): Promise<Route[]> {
  const promises: Promise<Response>[] = api.routes.map((path: string) =>
    fetch(path, {
      headers: {
        Connection: 'keep-alive'
      }
    })
  );

  type TransGPSRouteResponse = { [key: string]: TransGPSRoute }[];
  type TransGPSRouteEntry = [string, TransGPSRoute];

  return Promise.all(promises)
    .then(
      ([busesResponse, trolleybusesResponse]: Response[]): Promise<
        TransGPSRouteResponse[]
      > => Promise.all([busesResponse.json(), trolleybusesResponse.json()])
    )
    .then(
      ([
        busesJson,
        trolleybusesJson
      ]: TransGPSRouteResponse[]): TransGPSRouteEntry[] =>
        Object.entries({ ...busesJson, ...trolleybusesJson })
    )
    .then(
      (entries: TransGPSRouteEntry[]): Route[] =>
        entries.map(([, route]: TransGPSRouteEntry): Route => toRoute(route))
    );
}

export function fetchTrackers(): Promise<Tracker[]> {
  interface TransGPSTrackerResponse {
    [key: string]: TransGPSTracker;
  }
  type TransGPSTrackerEntry = [string, TransGPSTracker];

  return fetch(api.trackers, {
    headers: {
      Connection: 'keep-alive'
    }
  })
    .then(
      (response: Response): Promise<TransGPSTrackerResponse> => response.json()
    )
    .then(
      (json: TransGPSTrackerResponse): TransGPSTrackerEntry[] =>
        Object.entries(json)
    )
    .then(
      (entries: TransGPSTrackerEntry[]): Tracker[] =>
        entries.map(
          ([, tracker]: TransGPSTrackerEntry): Tracker => toTracker(tracker)
        )
    );
}
