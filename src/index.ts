import { CANVAS, Game, Types } from "phaser";
import pino from "pino";

import { canvas100 } from "./canvas-size";
import { Boot, MainGame, MainMenu, Preloader } from "./scenes";

const defaultCallback = (...args: unknown[]) => {
  logger.debug({ args }, globalName);
};

const registrationCallback = (registration: ServiceWorkerRegistration) => {
  logger.debug({ registration }, globalName);
  void registration.update();
  registration.addEventListener("updatefound", defaultCallback);
};

const handleContainer = (container: ServiceWorkerContainer) => {
  container.addEventListener("controllerchange", defaultCallback);
  container.addEventListener("message", defaultCallback);
  container.addEventListener("messageerror", defaultCallback);

  container
    .register(serviceWorkerUrl)
    .then(registrationCallback)
    .catch(defaultCallback);
};

const windowLoadCallback = () => {
  const { serviceWorker: serviceWorkerContainer } = navigator;
  handleContainer(serviceWorkerContainer);
};

const gameConfig: Types.Core.GameConfig = {
  type: CANVAS,
  width: canvas100,
  height: canvas100,
  backgroundColor: "#008eb0",
  parent: "phaser",
  scene: [Boot, Preloader, MainMenu, MainGame],
};

const emojiMatch = new Game(gameConfig);

const logger = pino({
  browser: { asObject: true },
  level: "debug",
  timestamp: pino.stdTimeFunctions.isoTime,
});

const serviceWorkerUrl = "service-worker.js";

const { name: globalName } = globalThis.constructor;

addEventListener("error", defaultCallback);
addEventListener("load", windowLoadCallback);

Object.assign(globalThis, { emojiMatch });
