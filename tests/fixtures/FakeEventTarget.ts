import { vi } from 'vitest';

type Listener = (event: Event) => void;

export class FakeEventTarget {
  public clientWidth = 600;
  public readonly listeners = new Map<string, Listener[]>();

  public readonly addEventListener = vi.fn(
    (type: string, listener: EventListenerOrEventListenerObject | null): void => {
      if (typeof listener !== 'function') {
        return;
      }
      const current = this.listeners.get(type) ?? [];
      current.push(listener);
      this.listeners.set(type, current);
    },
  );

  public readonly removeEventListener = vi.fn(
    (type: string, listener: EventListenerOrEventListenerObject | null): void => {
      if (typeof listener !== 'function') {
        return;
      }
      const current = this.listeners.get(type) ?? [];
      this.listeners.set(
        type,
        current.filter((entry) => entry !== listener),
      );
    },
  );

  public emit(type: string, event: unknown): void {
    for (const listener of this.listeners.get(type) ?? []) {
      listener(event as Event);
    }
  }

  public listenerCount(type: string): number {
    return this.listeners.get(type)?.length ?? 0;
  }
}
