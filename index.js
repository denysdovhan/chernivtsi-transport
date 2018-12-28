const express = require('express');
const transGPS = require('./trans-gps');
const transportCV = require('./transport-cv');
const EventStream = require('./event-stream');

const app = express();

const PORT = process.env.PORT || 3000;

function fetchRoutes() {
  return transportCV
    .fetchToken()
    .then(token =>
      Promise.all([transGPS.fetchRoutes(), transportCV.fetchRoutes(token)])
    )
    .then(([transGPSRoutes, transportCVRoutes]) => [
      ...transGPSRoutes,
      ...transportCVRoutes
    ]);
}

function fetchTrackers() {
  return transportCV
    .fetchToken()
    .then(token =>
      Promise.all([transGPS.fetchTrackers(), transportCV.fetchTrackers(token)])
    )
    .then(([transGPSTrackers, transportCVTrackers]) => [
      ...transGPSTrackers,
      ...transportCVTrackers
    ]);
}

app.get('/routes', (req, res) => {
  return fetchRoutes()
    .then(routes => res.json(routes))
    .catch(err => {
      console.error(err);
      res.end(err.toString());
    });
});

app.get('/trackers', (req, res) => {
  return fetchTrackers()
    .then(trackers => res.json(trackers))
    .catch(err => {
      console.error(err);
      res.end(err.toString());
    });
});

function sendTrackers(stream) {
  return fetchTrackers()
    .then(trackers => {
      stream.send(trackers);
    })
    .catch(err => {
      console.log(err);
      stream.send('error!');
    });
}

app.get('/events', (req, res) => {
  const stream = new EventStream(res);

  stream.open();

  sendTrackers(stream);

  const intervalId = setInterval(() => sendTrackers(stream), 5000);

  req.on('finish', () => {
    console.log('finished!');
    clearInterval(intervalId);
  });
  req.on('close', () => {
    console.log('closed!');
    clearInterval(intervalId);
  });
});

app.use('/app', express.static('app'));

app.listen(PORT, () => console.log(`Listen on ${PORT}!`));
