const express = require('express');
const cors = require('cors');
const DataLayer = require('./data-layer');

const EventStream = require('./event-stream');

const app = express();

const PORT = process.env.PORT || 3001;

const dataLayer = new DataLayer();

const api = new express.Router();

api.get('/routes', async (req, res) => {
  try {
    const routes = await dataLayer.fetchRoutes();
    res.json(routes);
  } catch (error) {
    console.log(error);
    res.end(error.toString());
  }
});

api.get('/trackers', async (req, res) => {
  try {
    const trackers = await dataLayer.fetchTrackers();
    res.json(trackers);
  } catch (error) {
    console.log(error);
    res.end(error.toString());
  }
});

api.get('/events', (req, res) => {
  const stream = new EventStream(res);

  stream.open();

  // Keep the reference to the function, so we can unsubscribe then
  const sendTrackers = trackers => stream.send(trackers);

  dataLayer.subscribe(sendTrackers);

  req.on('finish', () => dataLayer.unsubscribe(sendTrackers));
  req.on('close', () => dataLayer.unsubscribe(sendTrackers));
});

app.use(cors());

app.use('/api', api);

app.get('*', (req, res) => {
  const { host } = req.headers;

  res.json({
    routes: `http://${host}/api/routes`,
    trackers: `http://${host}/api/trackers`,
    events: `http://${host}/api/events`
  });
});

app.listen(PORT, () => console.log(`Listening on https://localhost:${PORT}`));
