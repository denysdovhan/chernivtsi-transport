import fetch, { Response } from 'node-fetch';
import { Tracker, Route } from './types';

// TODO: Fetch routeCheckpoints (points on map to draw a route)

export const namespace = 'transport-cv';

export const baseUrl = 'http://www.transport.cv.ua:8080/DTM';

export const api = {
  token: `${baseUrl}/j_spring_security_check?j_username=ChernivtsyPublicUser&j_password=peopleoF4e`,
  routes: `${baseUrl}/routescheme/findAllShort.action`,
  trackers: `${baseUrl}/routescheme/findPositionExtsByUser.action`
};

export interface TransportCVRoute {
  id: number; // route id, tracker's routeId is referenced to this field
  name: string; // public route name
  lineColor: string; // route color
  description: string; // route description (usually 'from — to')
  maxDuration: 50;
  rteId: 1;
}

export interface TransportCVTracker {
  id: number;
  latitude: number;
  longitude: number;
  angle: number;
  speed: number;
  datetime: string;
  routeId: number; // reference to id in route scheme
  // rest...
  difference: null;
  duration: string; // '0:0:0:52' 🤷‍
  number: string; // '0358' ‍‍🤷‍
  startStatusDate: string; // '2018-12-23T15:11:32' ‍🤷‍
  statusName: 'move' | 'stay' | 'noresponse'; // status of moving (stay/move/noresponse)
  tteId: number; // reference to type of
}

export function toRoute({
  id,
  name,
  lineColor,
  description,
  ...rest
}: TransportCVRoute): Route {
  return {
    id: `${namespace}:${id}`,
    name,
    color: lineColor,
    description,
    ...rest
  };
}

export function toTracker({
  id,
  latitude,
  longitude,
  angle,
  speed,
  datetime,
  routeId,
  ...rest
}: TransportCVTracker): Tracker {
  return {
    id: `${namespace}:${id}`,
    latitude,
    longitude,
    angle,
    speed,
    datetime,
    routeId: `${namespace}:${routeId}`,
    ...rest
  };
}

export function fetchToken(): Promise<string> {
  return fetch(api.token)
    .then((response: Response) => response.url)
    .then((url: string) => {
      const match = url.match(/jsessionid=([A-Z0-9]+)/i);

      if (match && match.length > 0) {
        return match[0];
      }

      throw new Error('Cannot get token for transport.cv.ua!');
    });
}

export function fetchRoutes(token: string): Promise<Route[]> {
  return fetch(api.routes, {
    headers: {
      cookie: `JSESSIONID=${token}`,
      connection: 'keep-alive'
    }
  })
    .then((response: Response) => response.json())
    .then((json: { routes: TransportCVRoute[] }) => json.routes)
    .then((routes: TransportCVRoute[]) => routes.map(toRoute));
}

export function fetchTrackers(token: string): Promise<Tracker[]> {
  return fetch(api.trackers, {
    headers: {
      cookie: `JSESSIONID=${token}`,
      connection: 'keep-alive'
    }
  })
    .then((response: Response) => response.json())
    .then((trackers: TransportCVTracker[]) => trackers.map(toTracker));
}
