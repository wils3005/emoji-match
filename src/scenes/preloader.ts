import { GameObjects, Scene, Types } from "phaser";

export class Preloader extends Scene {
  loadText?: GameObjects.Text;

  constructor() {
    super("Preloader");
  }

  preload() {
    this.loadText = this.add
      .text(300, 300, "Loading ...", loadTextTextStyle)
      .setOrigin(0.5)
      .setStroke("#203c5b", 6)
      .setShadow(2, 2, "#2d2d2d", 4, true, false);

    this.load
      .setPath("assets/")
      .image([{ key: "background" }, { key: "logo" }])
      .atlas("emojis", "emojis.png", "emojis.json")
      .audio("music", ["music.ogg", "music.m4a", "music.mp3"])
      .audio("countdown", ["countdown.ogg", "countdown.m4a", "countdown.mp3"])
      .audio("match", ["match.ogg", "match.m4a", "match.mp3"]);
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
}

const loadTextTextStyle: Types.GameObjects.Text.TextStyle = {
  fontFamily: "Arial",
  fontSize: "64",
  color: "#e3f2ed",
};
