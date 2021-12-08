import { GameObjects, Scene, Time, Types, Utils } from "phaser";
import { z } from "zod";

export class MainGame extends Scene {
  gameOver = () => {
    //  Show them where the match actually was
    this.circle1
      ?.setStrokeStyle(4, 0xfc29a6)
      .setPosition(this.child1?.x, this.child1?.y)
      .setVisible(true);

    this.circle2
      ?.setStrokeStyle(4, 0xfc29a6)
      .setPosition(this.child2?.x, this.child2?.y)
      .setVisible(true);

    this.input.off("gameobjectdown", this.selectEmoji, this);
    console.log(this.score, this.highscore);

    if (this.score > this.highscore) {
      console.log("high set");
      this.registry.set("highscore", this.score);
    }

    const onComplete: Types.Tweens.TweenOnCompleteCallback = () => {
      this.input.once(
        "pointerdown",
        () => {
          this.scene.start("MainMenu");
        },
        this
      );
    };

    this.tweens.add({
      targets: [this.circle1, this.circle2],
      alpha: 0,
      yoyo: true,
      repeat: 2,
      duration: 250,
      ease: "sine.inout",
      onComplete,
    });
  };

  selectEmoji = (_: unknown, emoji: GameObjects.Sprite) => {
    if (this.matched) {
      return;
    }

    //  Is this the first or second selection?
    if (!this.selectedEmoji) {
      //  Our first emoji
      this.circle1?.setPosition(emoji.x, emoji.y);
      this.circle1?.setVisible(true);

      this.selectedEmoji = emoji;
    } else if (emoji !== this.selectedEmoji) {
      //  Our second emoji

      //  Is it a match?
      if (emoji.frame.name === this.selectedEmoji.frame.name) {
        this.circle1?.setStrokeStyle(3, 0x00ff00);
        this.circle2?.setPosition(emoji.x, emoji.y);
        this.circle2?.setVisible(true);

        this.tweens.add({
          targets: [this.child1, this.child2],
          scale: 1.4,
          angle: "-=30",
          yoyo: true,
          ease: "sine.inout",
          duration: 200,
          completeDelay: 200,
          onComplete: () => this.newRound(),
        });

        this.sound.play("match");
      } else {
        this.circle1?.setPosition(emoji.x, emoji.y);
        this.circle1?.setVisible(true);
        this.selectedEmoji = emoji;
      }
    }
  };

  start = () => {
    this.score = 0;
    this.matched = false;

    this.timer = this.time.addEvent({
      delay: 60000,
      callback: this.gameOver,
      callbackScope: this,
    });

    this.sound.play("countdown", { delay: 57 });
  };

  highscore = 0;

  matched = false;

  score = 0;

  selectedEmoji: GameObjects.Sprite | null = null;

  child1?: GameObjects.Sprite;

  child2?: GameObjects.Sprite;

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
    this.add.image(300, 300, "background");
    this.circle1 = this.add.circle(0, 0, 42).setStrokeStyle(3, 0xf8960e);
    this.circle2 = this.add.circle(0, 0, 42).setStrokeStyle(3, 0x00ff00);
    this.circle1.setVisible(false);
    this.circle2.setVisible(false);
    this.emojis = this.add.group(emojiGroupCreateConfig);
    this.timerText = this.add.text(20, 20, "60.00", fontStyle);
    this.scoreText = this.add.text(20, 40, "Points: 0", fontStyle);
    const children = this.emojis.getChildren();

    children.forEach((child) => {
      child.setInteractive();
    });

    this.input.on("gameobjectdown", this.selectEmoji, this);
    this.input.once("pointerdown", this.start, this);
    this.highscore = z.number().parse(this.registry.get("highscore"));
    this.arrangeGrid();
  }

  newRound() {
    this.matched = false;
    this.score += 1;
    this.scoreText?.setText(`Points: ${this.score}`);
    this.circle1?.setStrokeStyle(3, 0xf8960e);
    this.circle1?.setVisible(false);
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
      onComplete: () => this.arrangeGrid(),
    });
  }

  arrangeGrid() {
    const frames = z.array(z.number()).parse(Utils.Array.NumberArray(1, 40));
    const selected = z.array(z.number()).parse(Utils.Array.NumberArray(0, 15));

    if (!this.emojis) {
      throw new Error("uh oh");
    }

    const children = z
      .array(z.instanceof(GameObjects.Sprite))
      .parse(this.emojis.getChildren());

    // Now we pick 16 random values, removing each one from the array so we
    // can't pick it again
    for (let i = 0; i < 16; i += 1) {
      const frame = z
        .number()
        .min(1)
        .max(40)
        .parse(Utils.Array.RemoveRandomElement(frames));

      if (children[i]) {
        children[i]?.setFrame(`smile${frame}`);
      }
    }

    // Finally, pick two random children and make them a pair:
    const index1 = z.number().parse(Utils.Array.RemoveRandomElement(selected));
    const index2 = z.number().parse(Utils.Array.RemoveRandomElement(selected));
    this.child1 = z.instanceof(GameObjects.Sprite).parse(children[index1]);
    this.child2 = z.instanceof(GameObjects.Sprite).parse(children[index2]);

    // Set the frame to match
    this.child2.setFrame(this.child1.frame.name);

    console.log({ index1, index2 });

    // Clear the currently selected emojis (if any)
    this.selectedEmoji = null;

    // Stagger tween them all in
    this.tweens.add({
      targets: children,
      scale: { start: 0, from: 0, to: 1 },
      ease: "bounce.out",
      duration: 600,
      delay: this.tweens.stagger(300 / 3, {
        grid: [4, 4],
        from: "center",
      }),
    });
  }

  update() {
    if (this.timer) {
      if (this.timer.getProgress() === 1) {
        this.timerText?.setText("00:00");
      } else {
        const remaining = (60 - this.timer.getElapsedSeconds()).toPrecision(4);
        const pos = remaining.indexOf(".");
        let seconds = remaining.substring(0, pos);
        seconds = Utils.String.Pad(seconds, 2, "0", 1);
        const ms = remaining.substr(pos + 1, 2);
        this.timerText?.setText(`${seconds}:${ms}`);
      }
    }
  }
}

const emojiGroupCreateConfig: Types.GameObjects.Group.GroupCreateConfig = {
  key: "emojis",
  quantity: 1,
  repeat: 15,
  gridAlign: {
    width: 4,
    height: 4,
    cellWidth: 90,
    cellHeight: 90,
    x: 180,
    y: 200,
  },
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
