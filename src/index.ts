import { CANVAS, Game, Types } from "phaser";

import { Boot, MainGame, MainMenu, Preloader } from "./scenes";

const gameConfig: Types.Core.GameConfig = {
  type: CANVAS,
  width: 600,
  height: 600,
  backgroundColor: "#008eb0",
  parent: "phaser",
  scene: [Boot, Preloader, MainMenu, MainGame],
  zoom: Math.min(innerHeight, innerWidth, 600) / 600,
};

onerror = (message, source, lineno, colno, error) => {
  console.log({ message, source, lineno, colno, error });
};

new Game(gameConfig);
