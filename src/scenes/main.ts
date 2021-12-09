import { Display, GameObjects, Scene, Time, Types, Utils } from "phaser";
import { z } from "zod";

import { canvas005, canvas010, canvas050, canvas100 } from "../canvas-size";

export class MainGame extends Scene {
  private gameOverCallback = () => {
    this.circle1
      ?.setStrokeStyle(4, 0xfc29a6)
      .setPosition(this.emojiSprite1?.x, this.emojiSprite1?.y)
      .setVisible(true);

    this.circle2
      ?.setStrokeStyle(4, 0xfc29a6)
      .setPosition(this.emojiSprite2?.x, this.emojiSprite2?.y)
      .setVisible(true);

    this.input.off("gameobjectdown", this.selectEmojiCallback, this);

    if (this.score > this.highscore) {
      this.registry.set("highscore", this.score);
    }

    this.animateGameOverCircles();
  };

  private matchCompleteCallback = () => {
    this.matched = false;
    this.score += 1;
    this.scoreText?.setText(`Points: ${this.score}`);
    this.circle1?.setStrokeStyle(3, 0xf8960e).setVisible(false);
    this.circle2?.setVisible(false);

    //  Stagger tween them all out
    this.tweens.add({
      targets: this.emojis?.getChildren(),
      scale: 0,
      ease: "power2",
      duration: 600,
      delay: this.tweens.stagger(300 / 3, {
        grid: [4, 4],
        from: "center",
      }),
      onComplete: () => this.setEmojiGrid(),
    });
  };

  private selectEmojiCallback = (_: unknown, emoji: GameObjects.Sprite) => {
    if (this.matched) return;

    if (!this.selectedEmoji) {
      this.circle1?.setPosition(emoji.x, emoji.y).setVisible(true);
      this.selectedEmoji = emoji;
    } else if (emoji !== this.selectedEmoji) {
      if (emoji.frame.name === this.selectedEmoji.frame.name) {
        this.circle1?.setStrokeStyle(3, 0x00ff00);
        this.circle2?.setPosition(emoji.x, emoji.y).setVisible(true);

        this.animateMatch();
        this.sound.play("match");
      } else {
        this.circle1?.setPosition(emoji.x, emoji.y);
        this.circle1?.setVisible(true);
        this.selectedEmoji = emoji;
      }
    }
  };

  private startGameCallback = () => {
    this.score = 0;
    this.matched = false;

    this.timer = this.time.addEvent({
      delay: gameDuration * 1000,
      callback: this.gameOverCallback,
      callbackScope: this,
    });

    this.sound.play("countdown", {
      delay: gameDuration - countdownDuration,
    });
  };

  highscore = 0;

  matched = false;

  score = 0;

  selectedEmoji: GameObjects.Sprite | null = null;

  emojiSprite1?: GameObjects.Sprite;

  emojiSprite2?: GameObjects.Sprite;

  circle1?: GameObjects.Arc;

  circle2?: GameObjects.Arc;

  emojis?: GameObjects.Group;

  scoreText?: GameObjects.Text;

  timer?: Time.TimerEvent;

  timerText?: GameObjects.Text;

  constructor() {
    super("MainGame");
  }

  create() {
    this.add.image(canvas050, canvas050, "background");

    this.circle1 = this.add
      .circle(0, 0, 42)
      .setStrokeStyle(3, 0xf8960e)
      .setVisible(false);

    this.circle2 = this.add
      .circle(0, 0, 42)
      .setStrokeStyle(3, 0x00ff00)
      .setVisible(false);

    this.emojis = this.add.group(emojiGroupCreateConfig);
    this.timerText = this.add.text(
      canvas005,
      canvas005,
      `${gameDuration}.00`,
      fontStyle
    );

    this.scoreText = this.add.text(
      canvas005,
      canvas010,
      "Points: 0",
      fontStyle
    );

    const emojiSprites = this.emojis.getChildren();
    emojiSprites.forEach((x) => x.setInteractive());
    this.input.on("gameobjectdown", this.selectEmojiCallback, this);
    this.input.once("pointerdown", this.startGameCallback, this);
    this.highscore = z.number().parse(this.registry.get("highscore"));
    this.setEmojiGrid();
  }

  update() {
    if (!this.timer) return;

    if (this.timer.getProgress() === 1) {
      this.timerText?.setText("00:00");
    } else {
      this.updateTimerText();
    }
  }

  private animateEmojis() {
    this.tweens.add({
      targets: this.getEmojiSprites(),
      scale: { start: 0, from: 0, to: 1 },
      ease: "bounce.out",
      duration: 600,
      delay: this.tweens.stagger(300 / 3, {
        grid: [4, 4],
        from: "center",
      }),
    });
  }

  private animateGameOverCircles() {
    this.tweens.add({
      targets: [this.circle1, this.circle2],
      alpha: 0,
      yoyo: true,
      repeat: 2,
      duration: 250,
      ease: "sine.inout",
      onComplete: () =>
        this.input.once(
          "pointerdown",
          () => this.scene.start("MainMenu"),
          this
        ),
    });
  }

  private animateMatch() {
    this.tweens.add({
      targets: [this.emojiSprite1, this.emojiSprite2],
      scale: 1.4,
      angle: "-=30",
      yoyo: true,
      ease: "sine.inout",
      duration: 200,
      completeDelay: 200,
      onComplete: this.matchCompleteCallback,
    });
  }

  private getEmojiSprites() {
    return z
      .array(z.instanceof(GameObjects.Sprite))
      .parse(this.emojis?.getChildren());
  }

  private setEmojiGrid() {
    const emojiFrames = z
      .array(z.number())
      .parse(Utils.Array.NumberArray(1, 40));

    const selected = z.array(z.number()).parse(Utils.Array.NumberArray(0, 15));

    for (let i = 0; i < 16; i += 1) {
      const randomEmojiFrame = z
        .number()
        .min(1)
        .max(40)
        .parse(Utils.Array.RemoveRandomElement(emojiFrames));

      if (this.getEmojiSprites()[i]) {
        this.getEmojiSprites()[i]?.setFrame(`smile${randomEmojiFrame}`);
      }
    }

    // Finally, pick two random emojiSprites and make them a pair:
    const emojiIndex1 = z
      .number()
      .parse(Utils.Array.RemoveRandomElement(selected));

    const emojiIndex2 = z
      .number()
      .parse(Utils.Array.RemoveRandomElement(selected));

    this.emojiSprite1 = z
      .instanceof(GameObjects.Sprite)
      .parse(this.getEmojiSprites()[emojiIndex1]);

    this.emojiSprite2 = z
      .instanceof(GameObjects.Sprite)
      .parse(this.getEmojiSprites()[emojiIndex2]);

    this.emojiSprite2.setFrame(this.emojiSprite1.frame.name);
    this.selectedEmoji = null;
    this.animateEmojis();
  }

  private updateTimerText() {
    if (!this.timer) return;

    const remaining = (
      gameDuration - this.timer.getElapsedSeconds()
    ).toPrecision(4);

    const pos = remaining.indexOf(".");
    const seconds = Utils.String.Pad(remaining.substring(0, pos), 2, "0", 1);
    const ms = remaining.substr(pos + 1, 2);
    this.timerText?.setText(`${seconds}:${ms}`);
  }
}

const countdownDuration = 6;

const emojiGroupCreateConfig: Types.GameObjects.Group.GroupCreateConfig = {
  key: "emojis",
  quantity: 1,
  repeat: 15,
  gridAlign: {
    width: 4,
    height: 4,
    cellWidth: canvas100 * 0.18,
    cellHeight: canvas100 * 0.18,
    position: Display.Align.TOP_LEFT,
    x: canvas100 * 0.25,
    y: canvas100 * 0.25,
  },
  visible: true,
};

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

const gameDuration = 60;
