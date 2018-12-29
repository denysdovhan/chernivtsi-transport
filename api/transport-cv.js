const fetch = require('isomorphic-fetch');

// TODO: Fetch routeCheckpoints (points on map to draw a route)

const namespace = 'transport-cv';

const baseUrl = 'http://www.transport.cv.ua:8080/DTM';

const api = {
  token: `${baseUrl}/j_spring_security_check?j_username=ChernivtsyPublicUser&j_password=peopleoF4e`,
  routes: `${baseUrl}/routescheme/findAllShort.action`,
  trackers: `${baseUrl}/routescheme/findPositionExtsByUser.action`
};

// Raw route looks like this:
//
// {
//   id: 201, // route id, tracker's routeId is referenced to this field
//   name: ' Т №1', // public route name
//   lineColor: 'red', // route color
//   description: 'Держуніверситет - вул. Ковальчука',
//   maxDuration: 50,
//   rteId: 1
// };
function toRoute({ id, name, lineColor, description, ...rest }) {
  return {
    id: `${namespace}:${id}`,
    name,
    color: lineColor,
    description,
    ...rest
  };
}

// Raw tracker looks like this:
//
// {
//   latitude: 48.26802, // latitude
//   longitude: 25.9336866667, // logitude
//   angle: 282.1, // angle
//   speed: 32, // speed
//   datetime: '2018-12-23T15:12:24', // datetime
//   routeId: 1501, // reference to id in route scheme
//   //
//   // rest...
//   //
//   difference: null,
//   duration: '0:0:0:52',
//   id: 6544,
//   number: '0358',
//   startStatusDate: '2018-12-23T15:11:32',
//   statusName: 'move', // status of moving (stay/move/noresponse)
//   tteId: 41 // reference to type of transport bus/trolleybus/etc (stored in separate collection)
// };
function toTracker({
  id,
  latitude,
  longitude,
  angle,
  speed,
  datetime,
  routeId,
  ...rest
}) {
  return {
    id: `${namespace}:${id}`,
    latitude,
    longitude,
    angle,
    speed,
    datetime,
    routeId,
    ...rest
  };
}

function fetchToken() {
  return fetch(api.token)
    .then(response => response.url)
    .then(url => url.match(/jsessionid=([A-Z0-9]+)/i)[1]);
}

function fetchRoutes(token) {
  return fetch(api.routes, {
    headers: {
      cookie: `JSESSIONID=${token}`,
      connection: 'keep-alive'
    }
  })
    .then(response => response.json())
    .then(json => json.routes)
    .then(routes => routes.map(toRoute));
}

function fetchTrackers(token) {
  return fetch(api.trackers, {
    headers: {
      cookie: `JSESSIONID=${token}`,
      connection: 'keep-alive'
    }
  })
    .then(response => response.json())
    .then(trackers => trackers.map(toTracker));
}

module.exports = {
  baseUrl,
  namespace,
  api,
  toRoute,
  toTracker,
  fetchToken,
  fetchRoutes,
  fetchTrackers
};
