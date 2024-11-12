"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DomainEvents = void 0;
class DomainEvents {
    static register(eventName, handler) {
        if (!this.handlersMap[eventName]) {
            this.handlersMap[eventName] = [];
        }
        this.handlersMap[eventName].push(handler);
    }
    static dispatch(event) {
        const eventName = event.constructor.name;
        const handlers = this.handlersMap[eventName] || [];
        handlers.forEach(handler => handler(event));
    }
}
exports.DomainEvents = DomainEvents;
DomainEvents.handlersMap = {};
