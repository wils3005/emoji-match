import { GameObjects, Scene, Types } from "phaser";
import { z } from "zod";

import { canvas050, canvasScale, canvas100 } from "../canvas-size";

export class MainMenu extends Scene {
  background?: GameObjects.Image;

  logo?: GameObjects.Image;

  music?: boolean;

  constructor() {
    super("MainMenu");
  }

  create() {
    this.addBackground();
    this.addLogo();
    this.addHighScoreText();
    this.animateBackground();
    this.animateLogo();
    this.playMusic();

    this.input.once("pointerdown", () => {
      this.scene.start("MainGame");
    });
  }

  private addBackground() {
    this.background = this.add
      .image(canvas050, canvas050, "background")
      .setScale(canvasScale);
  }

  private addHighScoreText() {
    const x = canvas100 * 0.05;
    const y = canvas100 * 0.05;

    const text = `High Score: ${z
      .number()
      .parse(this.registry.get("highscore"))}`;

    this.add.text(x, y, text, fontStyle).setScale(canvasScale);
  }

  private addLogo() {
    this.logo = this.add
      .image(canvas050, canvas050 - logoWidth, "logo")
      .setScale(canvasScale);
  }

  private animateBackground() {
    this.tweens.add({
      targets: this.background,
      alpha: { from: 0, to: 1 },
      duration: 1000,
    });
  }

  private animateLogo() {
    this.tweens.add({
      targets: this.logo,
      y: canvas100 * 0.5,
      ease: "bounce.out",
      duration: 1200,
    });
  }

  private playMusic() {
    if (this.music) return;

    this.music = this.sound.play("music", { loop: true });
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

const logoWidth = 498;
