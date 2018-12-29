const { EventEmmiter } = require('events');

class DataProvider extends EventEmmiter {
  constructor() {
    super();

    // Fetch token
    // Refetch token if request fails
    this.token = null;
  }

  fetchRoutes() {
    // single fetch routes
  }

  fetchTrackers() {
    // single fetch trackers
  }

  // add ability to subscribe for trackers
  // poll trackers if there are connected listeners
  //
}
