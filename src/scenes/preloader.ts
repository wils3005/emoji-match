import { GameObjects, Scene, Types } from "phaser";

import { px, canvasScale } from "../px";

export class Preloader extends Scene {
  loadText?: GameObjects.Text;

  constructor() {
    super("Preloader");
  }

  preload() {
    this.setLoadText();
    this.loadAssets();
  }

  create() {
    if (this.sound.locked) {
      this.loadText?.setText("Click to Start");

      this.input.once("pointerdown", () => {
        this.scene.start("MainMenu");
      });
    } else {
      this.scene.start("MainMenu");
    }
  }

  private loadAssets() {
    this.load
      .setPath("assets/")
      .image([{ key: "background" }, { key: "logo" }])
      .atlas("emojis", "emojis.png", "emojis.json")
      .audio("music", ["music.ogg", "music.m4a", "music.mp3"])
      .audio("countdown", ["countdown.ogg", "countdown.m4a", "countdown.mp3"])
      .audio("match", ["match.ogg", "match.m4a", "match.mp3"]);
  }

  private setLoadText() {
    this.loadText = this.add
      .text(px(0.5), px(0.5), "Loading ...", loadTextTextStyle)
      .setOrigin(0.5)
      .setStroke("#203c5b", 6)
      .setShadow(2, 2, "#2d2d2d", 4, true, false)
      .setScale(canvasScale);
  }
}

const loadTextTextStyle: Types.GameObjects.Text.TextStyle = {
  fontFamily: "Arial",
  fontSize: "64",
  color: "#e3f2ed",
};
