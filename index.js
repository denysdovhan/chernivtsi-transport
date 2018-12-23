const transGPSAPI = require('./trans-gps');
const transportCVAPI = require('./transport-cv');

transportCVAPI
  .fetchToken()
  .then(token =>
    Promise.all([
      transGPSAPI.fetchRoutes(),
      transGPSAPI.fetchTrackers(),
      transportCVAPI.fetchRoutes(token),
      transportCVAPI.fetchTrackers(token)
    ])
  )
  .then(
    ([
      transGPSRoutes,
      transGPSTrackers,
      transportCVRoutes,
      transportCVTrackers
    ]) => ({
      routes: [...transGPSRoutes, ...transportCVRoutes],
      trackers: [...transGPSTrackers, ...transportCVTrackers]
    })
  )
  .then(JSON.stringify)
  .then(console.log);

// Common route object:
//
// const route = {
//   id: 12, // route id, tracker's routeId is referenced to this field
//   name: '29', // public route name
//   color: 'red', // route color (TODO: Generate unique color)
//   description: 'Держуніверситет - вул. Ковальчука' // Optional description of the route
// };

// Common tracker object:
//
// const tracker = {
//   id: 123,
//   latitude: 12.12312313,
//   longitude: 23.23413413,
//   direction: 282.1, // angle/orientation
//   speed: 23.3,
//   datetime: '2018-12-23T15:12:24', // datetime/gpstime
//   routeId: 123
// };
