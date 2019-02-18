import EventEmmiter from 'events';
import * as TransGPS from './trans-gps';
import * as TransportCV from './transport-cv';
import { Tracker, Route } from './types';

type Token = string | null;
type Callback<Data> = (data: Data) => void;

export default class DataLayer extends EventEmmiter {
  public constructor() {
    super();
    this.token = null;
    this.trackers = [];
    this.updateTrackersIntervalId = null;

    this.fetchToken();
  }

  private token: Token;

  private trackers: Tracker[];

  private updateTrackersIntervalId: number | null;

  private async fetchToken(): Promise<Token> {
    try {
      this.token = await TransportCV.fetchToken();
      return this.token;
    } catch (error) {
      this.token = null;
      throw new Error(`Failed to fetch token: ${error}`);
    }
  }

  public async fetchRoutes(): Promise<Route[]> {
    try {
      const [transGPSRoutes, transportCVRoutes] = await Promise.all([
        TransGPS.fetchRoutes(),
        TransportCV.fetchRoutes(this.token as string)
      ]);

      return [...transGPSRoutes, ...transportCVRoutes];
    } catch (error) {
      console.log('Failed to fetch routes:', error);
      await this.fetchToken();
      return this.fetchRoutes();
    }
  }

  public async fetchTrackers(): Promise<Tracker[]> {
    try {
      const [transGPSTrackers, transportCVTrackers] = await Promise.all([
        TransGPS.fetchTrackers(),
        TransportCV.fetchTrackers(this.token as string)
      ]);

      return [...transGPSTrackers, ...transportCVTrackers];
    } catch (error) {
      console.log('Failed to fetch trackers:', error);
      await this.fetchToken();
      return this.fetchTrackers();
    }
  }

  private async updateTrackers(): Promise<void> {
    try {
      this.trackers = await this.fetchTrackers();
      this.emit('trackers', this.trackers);
    } catch (error) {
      console.error('Failed to update trackers:', error);
    }
  }

  public subscribe(callback: Callback<Tracker[]>): void {
    if (this.listenerCount('trackers') === 0) {
      // If this is the first listener, then update trackers immediately
      this.updateTrackers();
      // And start the interval for updates
      this.updateTrackersIntervalId = setInterval(
        () => this.updateTrackers(),
        5000
      );
    }

    // Send data from cache immediately
    callback(this.trackers);
    this.on('trackers', callback);
    console.log(`${this.listenerCount('trackers')} subscribers...`);
  }

  public unsubscribe(callback: Callback<Tracker[]>): void {
    if (this.listenerCount('trackers') === 1 && this.updateTrackersIntervalId) {
      // If the last listener is unsubscribing, then stop the interval
      clearInterval(this.updateTrackersIntervalId);
    }
    this.off('trackers', callback);
    console.log(`${this.listenerCount('trackers')} subscribers...`);
  }
}
