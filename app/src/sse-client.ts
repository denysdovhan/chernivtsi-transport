interface EventStreamEvent extends Event {
  data: string;
}
type Callback<Data> = (
  data: Data | null,
  nativeEvent: EventStreamEvent
) => void;

function safeJSONParse<T>(json: string): T | null {
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

  public on<Data>(event: string, callback: Callback<Data>): EventStreamClient {
    this.source.addEventListener(
      event,
      (nativeEvent: Event): void =>
        callback(
          safeJSONParse<Data>((nativeEvent as EventStreamEvent).data),
          nativeEvent as EventStreamEvent
        )
    );
    return this;
  }

  public receive<Data>(callback: Callback<Data>): EventStreamClient {
    this.on('message', callback);
    return this;
  }
}
