function safeJSONParse(json) {
  try {
    return JSON.parse(json);
  } catch (e) {
    return null;
  }
}

class EventStreamClient {
  constructor(endpoint) {
    this.endpoint = endpoint;
    this.source = new EventSource(endpoint);
    this.source.onopen = event => console.log('open', event); // eslint-disable-line
    this.source.onerror = event => console.log('error', event); // eslint-disable-line
  }

  on(event, callback) {
    this.source.addEventListener(event, nativeEvent =>
      callback(safeJSONParse(nativeEvent.data), nativeEvent)
    );
    return this;
  }

  receive(callback) {
    this.on('message', callback);
    return this;
  }
}

export default EventStreamClient;
