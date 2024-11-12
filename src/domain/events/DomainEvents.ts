type EventHandler = (event: any) => void;

class DomainEvents {
  private static handlersMap: { [eventName: string]: EventHandler[] } = {};

  public static register(eventName: string, handler: EventHandler) {
    if (!this.handlersMap[eventName]) {
      this.handlersMap[eventName] = [];
    }
    this.handlersMap[eventName].push(handler);
  }

  public static dispatch(event: any) {
    const eventName = event.constructor.name;
    const handlers = this.handlersMap[eventName] || [];
    handlers.forEach(handler => handler(event));
  }
}

export { DomainEvents };