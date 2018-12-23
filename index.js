const express = require('express');
const transGPS = require('./trans-gps');
const transportCV = require('./transport-cv');

const app = express();

const PORT = process.env.HOST || 3000;

function fetchGPS() {
  return transportCV
    .fetchToken()
    .then(token =>
      Promise.all([
        transGPS.fetchRoutes(),
        transGPS.fetchTrackers(),
        transportCV.fetchRoutes(token),
        transportCV.fetchTrackers(token)
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
    );
}

app.get('*', (req, res) => {
  fetchGPS()
    .then(data => res.json(data))
    .catch(err => {
      console.error(err);
      res.end(err.toString());
    });
});

app.listen(PORT, () => console.log(`Listen on ${HOST}!`));
