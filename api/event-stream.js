// Features:
// * High-level API
// * Chainable aAPI
// * Auto JSON-stringify
// * Auto reconnect
class EventStream {
  // TODO: Create server or use a new one
  constructor(response) {
    this.response = response;
  }

  open(options = {}) {
    const { delay = 10000 } = options;
    this.response.set({
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive',
      'Access-Control-Allow-Origin': '*'
    });
    this.response.write(`retry: ${delay}\n`);
    return this;
  }

  emit(event, data) {
    const id = Date.now();
    console.log({ id });
    this.response.write(`id: ${id}\n`);
    this.response.write(`event: ${event}\n`);
    this.response.write(`data: ${JSON.stringify(data)}\n\n`);
    return this;
  }

  send(data) {
    this.emit('message', data);
    return this;
  }

  close(code = 503) {
    this.response.status(code);
    return this;
  }
}

module.exports = EventStream;
