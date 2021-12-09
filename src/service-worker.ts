import pino from "pino";

export const defaultEventCallback = (event: unknown) => {
  logger.debug({ event }, globalName);
};

export const installCallback = (event: unknown) => {
  logger.debug({ event }, globalName);
  self.skipWaiting();
};

const logger = pino({
  browser: { asObject: true },
  level: "debug",
  timestamp: pino.stdTimeFunctions.isoTime,
});

const { name: globalName } = self.constructor;

self.addEventListener("install", installCallback);
self.addEventListener("activate", defaultEventCallback);
self.addEventListener("contentdelete", defaultEventCallback);
self.addEventListener("fetch", defaultEventCallback);
self.addEventListener("message", defaultEventCallback);
self.addEventListener("notificationclick", defaultEventCallback);
self.addEventListener("notificationclose", defaultEventCallback);
self.addEventListener("sync", defaultEventCallback);
self.addEventListener("periodicsync", defaultEventCallback);
self.addEventListener("push", defaultEventCallback);
self.addEventListener("pushsubscriptionchange", defaultEventCallback);
