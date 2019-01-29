const fetch = require('isomorphic-fetch');

// TODO: Collect route's checkpoints

const namespace = 'trans-gps';

const baseUrl = 'http://www.trans-gps.cv.ua/map';

const api = {
  routes: [`${baseUrl}/routes/1`, `${baseUrl}/routes/2`],
  trackers: `${baseUrl}/trackers/?selectedRoutesStr=`
};

// Transform trans-gps route object to unified format
//
// {
//   id: 21,             // route id, tracker's routeId is referenced to this field
//   name: '38',         // public route name
//   colour: 'deeppink', // route color
//   code: '38z',
//   sort: 130,
//   display: 1
// }
function toRoute({
  id, // route id, tracker's routeId is referenced to this field
  name, // public route name
  colour, // route color
  ...rest
}) {
  return {
    id: `${namespace}:${id}`,
    name,
    color: colour,
    description: null,
    ...rest
  };
}

// Transform trans-gps tracker object to unified format
//
// {
//   lat: '48.32459333333333',       // latitude
//   lng: '25.933766666666667',      // longitude
//   orientation: '000.00',          // angle
//   speed: '000.0',                 // speed
//   gpstime: '2018-12-23 15:16:27', // datetime
//   routeId: 20,                    // reference to id in route scheme
//
//   id: 197,
//   imei: '355227045600277',        // IMEI id of GPS-tracker
//   name: 'A115',
//   stateCode: 'used',
//   stateName: 'used',
//   routeName: 'A',                 // public number of route
//   routeColour: 'navy',
//   inDepo: true,                   // is on route
//   busNumber: '0745',
//   perevId: 1,                     // provider id
//   perevName: 'Денисівка',         // provider name
//   remark: '0745',
//   online: true
// }
function toTracker({
  id,
  lat,
  lng,
  orientation,
  speed,
  gpstime,
  routeId,
  ...rest
}) {
  return {
    id: `${namespace}:${id}`,
    latitude: Number(lat),
    longitude: Number(lng),
    direction: Number(orientation),
    speed: Number(speed),
    datetime: gpstime,
    routeId: `${namespace}:${routeId}`,
    ...rest
  };
}

function fetchRoutes() {
  const promises = api.routes.map(path =>
    fetch(path, {
      headers: {
        Connection: 'keep-alive'
      }
    })
  );

  return Promise.all(promises)
    .then(([response1, response2]) =>
      Promise.all([response1.json(), response2.json()])
    )
    .then(([json1, json2]) => Object.entries({ ...json1, ...json2 }))
    .then(entries => entries.map(([, route]) => toRoute(route)));
}

function fetchTrackers() {
  return fetch(api.trackers, {
    headers: {
      Connection: 'keep-alive'
    }
  })
    .then(res => res.json())
    .then(json => Object.entries(json))
    .then(entries => entries.map(([, tracker]) => toTracker(tracker)));
}

module.exports = {
  baseUrl,
  namespace,
  api,
  toRoute,
  toTracker,
  fetchRoutes,
  fetchTrackers
};
