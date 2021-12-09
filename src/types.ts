declare global {
  interface Client {
    postMessage: (...args: unknown[]) => unknown;
  }

  interface Window {
    clients: {
      matchAll: (options: Record<string, unknown>) => Promise<Client[]>;
    };
    skipWaiting: () => unknown;
  }
}

export {};
