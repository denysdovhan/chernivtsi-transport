const express = require('express');
const cors = require('cors');
const DataLayer = require('./data-layer');

const EventStream = require('./event-stream');

const app = express();

const PORT = process.env.PORT || 3001;

const dataLayer = new DataLayer();

app.use(cors());

app.get('/routes', async (req, res) => {
  try {
    const routes = await dataLayer.fetchRoutes();
    res.json(routes);
  } catch (error) {
    console.log(error);
    res.end(err.toString());
  }
});

app.get('/trackers', async (req, res) => {
  try {
    const trackers = await dataLayer.fetchTrackers();
    res.json(trackers);
  } catch (error) {
    console.log(error);
    res.end(err.toString());
  }
});

app.get('/events', (req, res) => {
  const stream = new EventStream(res);

  stream.open();

  // Keep the reference to the function, so we can unsubscribe then
  const sendTrackers = trackers => stream.send(trackers);

  dataLayer.subscribe(sendTrackers);

  req.on('finish', () => dataLayer.unsubscribe(sendTrackers));
  req.on('close', () => dataLayer.unsubscribe(sendTrackers));
});

app.listen(PORT, () => console.log(`Listen on ${PORT}!`));
