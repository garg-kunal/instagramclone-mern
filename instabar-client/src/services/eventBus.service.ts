export enum Events {
  "POST_CREATED" = "POST_CREATED",
  "POST_DELETED" = "POST_DELETED",
  "COMMENT_CREATED" = "COMMENT_CREATED",
  "COMMENT_DELETED" = "COMMENT_DELETED",
  "LIKE_CREATED" = "LIKE_CREATED",
  "LIKE_DELETED" = "LIKE_DELETED",
  "PROFILE_UPDATED" = "PROFILE_UPDATED",
}

class EventBus {
  private events: { [key in Events]?: ((data: any) => void)[] };
  private static instance: EventBus;

  constructor() {
    this.events = {} as any;
  }

  static getInstance(): EventBus {
    if (!EventBus.instance) {
      EventBus.instance = new EventBus();
    }

    return EventBus.instance;
  }

  on(event: Events, callback: (data: any) => void): void {
    if (!this.events[event]) {
      this.events[event] = [];
    }

    this.events[event].push(callback);
  }

  off(event: Events, callback: (data: any) => void): void {
    if (!this.events[event]) {
      return;
    }

    this.events[event] = this.events[event].filter(
      (cb: (data: any) => void) => cb !== callback
    );
  }

  emit(event: Events, data: any): void {
    if (!this.events[event]) {
      return;
    }

    this.events[event].forEach((callback: (data: any) => void) =>
      callback(data)
    );
  }
}

const eventBus = EventBus.getInstance();
export default eventBus;
