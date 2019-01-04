const EventEmmiter = require('events');
const transGPS = require('./trans-gps');
const transportCV = require('./transport-cv');

class DataLayer extends EventEmmiter {
  constructor() {
    super();
    this.token = null;
    this.trackers = [];
    this.updateTrackersInterval = null;

    this.fetchToken();
  }

  async fetchToken() {
    try {
      this.token = await transportCV.fetchToken();
      return this.token;
    } catch (error) {
      this.token = null;
      throw new Error(`Failed to fetch token: ${error}`);
    }
  }

  async fetchRoutes() {
    try {
      const [transGPSRoutes, transportCVRoutes] = await Promise.all([
        transGPS.fetchRoutes(),
        transportCV.fetchRoutes(this.token)
      ]);

      return [...transGPSRoutes, ...transportCVRoutes];
    } catch (error) {
      console.log('Failed to fetch routes:', error);
      await this.fetchToken();
      return this.fetchRoutes();
    }
  }

  async fetchTrackers() {
    try {
      const [transGPSTrackers, transportCVTrackers] = await Promise.all([
        transGPS.fetchTrackers(),
        transportCV.fetchTrackers(this.token)
      ]);

      return [...transGPSTrackers, ...transportCVTrackers];
    } catch (error) {
      console.log('Failed to fetch trackers:', error);
      await this.fetchToken();
      return this.fetchTrackers();
    }
  }

  async updateTrackers() {
    try {
      this.trackers = await this.fetchTrackers();
      this.emit('trackers', this.trackers);
    } catch (error) {
      console.error('Failed to update trackers:', error);
    }
  }

  subscribe(callback) {
    if (this.listenerCount('trackers') === 0) {
      // If this is the first listener, then update trackers immediately
      this.updateTrackers();
      // And start the interval for updates
      this.updateTrackersInterval = setInterval(
        () => this.updateTrackers(),
        5000
      );
    }
    // Send data from cache immediately
    callback(this.trackers);
    this.on('trackers', callback);
    console.log(`${this.listenerCount('trackers')} subscribers...`);
  }

  unsubcribe(callback) {
    if (this.listenerCount('trackers') === 1) {
      // If the last listener is unsubscribing, then stop the interval
      clearInterval(this.updateTrackersInterval);
    }
    this.off('trackers', callback);
    console.log(`${this.listenerCount('trackers')} subscribers...`);
  }
}

module.exports = DataLayer;
