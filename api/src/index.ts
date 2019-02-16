import express, { Router, Application, Request, Response } from 'express';
import cors from 'cors';
import DataLayer from './data-layer';
import EventStream from './event-stream';
import { Tracker, Route } from './types';

const PORT: number = Number(process.env.PORT) || 3001;

const app: Application = express();
const dataLayer: DataLayer = new DataLayer();

const api: Router = Router();

api.get('/routes', async (request: Request, response: Response) => {
  try {
    const routes: Route[] = await dataLayer.fetchRoutes();
    response.json(routes);
  } catch (error) {
    console.log(error);
    response.end(error.toString());
  }
});

api.get('/trackers', async (request: Request, response: Response) => {
  try {
    const trackers: Tracker[] = await dataLayer.fetchTrackers();
    response.json(trackers);
  } catch (error) {
    console.log(error);
    response.end(error.toString());
  }
});

api.get('/events', (request: Request, response: Response) => {
  const stream: EventStream = new EventStream(response);

  stream.open();

  // Keep the reference to the function, so we can unsubscribe then
  const sendTrackers = (trackers: Tracker[]): void => {
    stream.send(trackers);
  };

  dataLayer.subscribe(sendTrackers);

  request.on('finish', () => dataLayer.unsubscribe(sendTrackers));
  request.on('close', () => dataLayer.unsubscribe(sendTrackers));
});

app.use(cors());

app.use('/api', api);

app.get('*', (request: Request, response: Response) => {
  const { host } = request.headers;

  response.json({
    routes: `http://${host}/api/routes`,
    trackers: `http://${host}/api/trackers`,
    events: `http://${host}/api/events`
  });
});

app.listen(PORT, () => console.log(`Listening on http://localhost:${PORT}`));
