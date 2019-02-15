export interface Route {
  id: string;
  name: string;
  color: string;
  description?: string;
}

export interface Tracker {
  id: string;
  routeId: string;
  datetime: string;
  speed: number;
  angle: number;
  latitude: number;
  longitude: number;
}
