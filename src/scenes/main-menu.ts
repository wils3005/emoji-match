import { GameObjects, Scene, Types } from "phaser";
import { z } from "zod";

export class MainMenu extends Scene {
  background?: GameObjects.Image;

  logo?: GameObjects.Image;

  music?: boolean;

  constructor() {
    super("MainMenu");
  }

  create() {
    this.background = this.add.image(300, 300, "background");

    this.logo = this.add.image(300, -200, "logo");

    this.tweens.add({
      targets: this.background,
      alpha: { from: 0, to: 1 },
      duration: 1000,
    });

    this.add.text(
      20,
      20,
      `High Score: ${z.number().parse(this.registry.get("highscore"))}`,
      fontStyle
    );

    if (!this.music) {
      this.music = this.sound.play("music", { loop: true });
    }

    this.tweens.add({
      targets: this.logo,
      y: 300,
      ease: "bounce.out",
      duration: 1200,
    });

    this.input.once("pointerdown", () => {
      this.scene.start("MainGame");
    });
  }
}

const fontStyle: Types.GameObjects.Text.TextStyle = {
  fontFamily: "Arial",
  fontSize: "48",
  color: "#ffffff",
  fontStyle: "bold",
  padding: { x: 16, y: 16 },
  shadow: {
    color: "#000000",
    fill: true,
    offsetX: 2,
    offsetY: 2,
    blur: 4,
  },
};
