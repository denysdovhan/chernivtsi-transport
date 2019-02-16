import { Response } from 'express';

// Features:
// * High-level API
// * Chainable aAPI
// * Auto JSON-stringify
// * Auto reconnect
interface EventStreamOptions {
  delay?: number;
}

export default class EventStream {
  public constructor(response: Response) {
    // TODO: Create server or use a new one
    this.response = response;
  }

  private response: Response;

  private defaultOptions: EventStreamOptions = {
    delay: 1000
  };

  public open(options?: EventStreamOptions): EventStream {
    const { delay } = { ...this.defaultOptions, ...options };
    this.response.set({
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive',
      'Access-Control-Allow-Origin': '*'
    });
    this.response.write(`retry: ${delay}\n`);
    return this;
  }

  public emit<Data>(event: string, data: Data): EventStream {
    const id = Date.now();
    this.response.write(`id: ${id}\n`);
    this.response.write(`event: ${event}\n`);
    this.response.write(`data: ${JSON.stringify(data)}\n\n`);
    return this;
  }

  public send<Data>(data: Data): EventStream {
    this.emit('message', data);
    return this;
  }

  public close(code: number = 503): EventStream {
    this.response.status(code);
    return this;
  }
}
