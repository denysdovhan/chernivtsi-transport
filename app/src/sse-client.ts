type Callback = (...args: any) => any;
interface EventStreamEvent extends Event {
  data: any;
}

function safeJSONParse(json: string): JSON | null {
  try {
    return JSON.parse(json);
  } catch (e) {
    return null;
  }
}

export default class EventStreamClient {
  public constructor(endpoint: string) {
    this.source = new EventSource(endpoint);
    this.source.onopen = event => console.log('open', event); // eslint-disable-line
    this.source.onerror = event => console.log('error', event); // eslint-disable-line
  }

  private source: EventSource;

  public on(event: string, callback: Callback): EventStreamClient {
    this.source.addEventListener(
      event,
      (nativeEvent: Event): void =>
        callback(
          safeJSONParse((nativeEvent as EventStreamEvent).data),
          nativeEvent
        )
    );
    return this;
  }

  public receive(callback: Callback): EventStreamClient {
    this.on('message', callback);
    return this;
  }
}
