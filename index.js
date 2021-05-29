class Control {
  static canvas = document.querySelector("canvas");
  static scoreControl = document.getElementById("score");
  static livesControl = document.getElementById("lives");
  static sheetControl = document.getElementById("sheet");
  static hiscoreControl = document.getElementById("hiscore");
  static debugControl = document.getElementById("dbg");
  static graphics = Control.canvas.getContext("2d");
  static #Control = (() => {
    Control.graphics.font = "20px Lucida Console";
  })();
}
class Sound {
  static volume = 2;
  static maxVolume = 20;
  static soundOn = true;
  static soundScale = 1 / Sound.maxVolume;
  static toggleSound() {
    Sound.soundOn = !Sound.soundOn;
    Sound.sounds.forEach((s) => (s.muted = !Sound.soundOn));
  }
  static increaseVolume() {
    if (!Sound.soundOn) Sound.toggleSound();
    if (Sound.volume < Sound.maxVolume) Sound.volume += 1;
    Sound.sounds.forEach((s) => (s.volume = Sound.volume * Sound.soundScale));
  }
  static decreaseVolume() {
    if (Sound.volume > 0) Sound.volume -= 1;
    Sound.sounds.forEach((s) => (s.volume = Sound.volume * Sound.soundScale));
  }
  static sounds = [];
  static audio(src) {
    const a = new Audio(src);
    a.volume = Sound.volume * (1 / Sound.maxVolume);
    this.sounds.push(a);
    return a;
  }
  static laserShoot = Sound.audio("./sounds/laser.wav");
  static killedInvader = Sound.audio("./sounds/kill.wav");
  static explosion = Sound.audio("./sounds/explosion.wav");
  static saucerHi = Sound.audio("./sounds/UfoHi10.wav");
  static saucerLo = Sound.audio("./sounds/ufo_lowpitch.wav");
  static soundSteps = [];
  static #Sound = (() => {
    Sound.soundSteps[0] = Sound.audio("./sounds/step1.wav");
    Sound.soundSteps[1] = Sound.audio("./sounds/step2.wav");
    Sound.soundSteps[2] = Sound.audio("./sounds/step3.wav");
    Sound.soundSteps[3] = Sound.audio("./sounds/step4.wav");
  })();
}
class Graphic {
  static image(src) {
    const i = new Image();
    i.src = src;
    return i;
  }
  static laserImage = Graphic.image("./base.png");
  static laserExplosion1 = Graphic.image("./laserexplode1.png");
  static laserExplosion2 = Graphic.image("./laserexplode2.png");
  static laserBeamExplode = Graphic.image("./laserexplode.png");
  static alienExplosion = Graphic.image("./alienexplode.png");
  static bombExplosion = Graphic.image("./BombExplode.png");
  static bombFrame = [
    [
      Graphic.image("./bombZ1.png"),
      Graphic.image("./bombZ2.png"),
      Graphic.image("./bombZ3.png"),
      Graphic.image("./bombZ4.png"),
    ],
    [
      Graphic.image("./bombP1.png"),
      Graphic.image("./bombP2.png"),
      Graphic.image("./bombP3.png"),
      Graphic.image("./bombP4.png"),
    ],
    [
      Graphic.image("./bombR1.png"),
      Graphic.image("./bombR2.png"),
      Graphic.image("./bombR3.png"),
      Graphic.image("./bombR4.png"),
    ],
  ];
}
class KeyInput {
  static isLeftDown = false;
  static isLeftKeyDown = false;
  static isRightDown = false;
  static isRightKeyDown = false;
  static isFireDown = false;
  static isFireKeyDown = false;
  static isPaused = false;
  static isLaserReloaded = true;
  static isGamePadConnected = false;
  static currentGamepad = null;
  static previousGamepad = null;
  static backButton = 8;
  static startButton = 9;
  static ButtonB = 1;
  static ButtonY = 3;
  static ButtonA = 0;
  static ButtonB = 1;
  static LeftHat = 14;
  static RightHat = 15;
  static CentreHat = 32;
  static LeftJoy = 30;
  static RightJoy = 31;
  static #KeyInput = (() => {
    addEventListener("keydown", KeyInput.keyDown);
    addEventListener("keyup", KeyInput.keyUp);
    addEventListener("gamepadconnected", KeyInput.gamepadConnected);
    addEventListener("gamepaddisconnected", KeyInput.gamepadDisconnected);
  })();
  static keyDown(event) {
    //console.log("KeyInput.keyDown");
    if (event.code == "KeyZ") KeyInput.isLeftKeyDown = true;
    if (event.code == "KeyX") KeyInput.isRightKeyDown = true;
    if (event.code == "Enter") KeyInput.isFireKeyDown = true;
  }
  static keyUp(event) {
    // game keyboard controls
    if (event.code == "KeyZ") KeyInput.isLeftKeyDown = false;
    if (event.code == "KeyX") KeyInput.isRightKeyDown = false;
    if (event.code == "Enter") {
      KeyInput.isFireKeyDown = false;
      KeyInput.isLaserReloaded = true;
    }
    if (event.code == "KeyQ") Sound.toggleSound();

    // debugging keyboard controls
    if (event.code == "KeyP") KeyInput.isPaused = !KeyInput.isPaused;
    if (KeyInput.isPaused && event.code == "KeyF")
      game.step(performance.now(), true);
    if (event.code == "KeyG") {
      var gamepads = navigator.getGamepads();
      console.log(gamepads);
    }
    if (event.code == "Space") game.reset();
    if (event.code == "KeyA") game.board.advance();
    if (event.code == "KeyL") game.addLife();
  }
  static gamepadConnected(event) {
    KeyInput.isGamePadConnected = true;
  }
  static gamepadDisconnected(event) {
    KeyInput.isGamePadConnected = false;
  }
  static get isMoveLeft() {
    return KeyInput.isLeftKeyDown || KeyInput.isLeftDown;
  }
  static get isMoveRight() {
    return KeyInput.isRightKeyDown || KeyInput.isRightDown;
  }
  static get isFire() {
    return (
      (KeyInput.isFireKeyDown || KeyInput.isFireDown) &&
      KeyInput.isLaserReloaded &&
      !game.laserBeam.isFiring
    );
    /*
    return (
      (KeyInput.isFireKeyDown && KeyInput.isLaserReloaded) ||
      KeyInput.isButtonPressed(KeyInput.ButtonB)
    );
    */
  }
  static Refresh() {
    KeyInput.previousGamepad = KeyInput.currentGamepad;
    KeyInput.currentGamepad = navigator.getGamepads()[0];
  }
  static isButtonPressed(button) {
    const current = KeyInput.currentGamepad?.buttons[button].pressed;
    if (current == null) KeyInput.Refresh();
    const previous = KeyInput.previousGamepad?.buttons[button].pressed;
    return current && (previous == null || !previous);
  }
  static isButtonDown(button) {
    if (button == KeyInput.CentreHat) {
      if (
        !KeyInput.currentGamepad.buttons[KeyInput.LeftHat].pressed &&
        !KeyInput.currentGamepad.buttons[KeyInput.RightHat].pressed
      )
        return true;
      else return false;
    }
    return KeyInput.currentGamepad.buttons[button].pressed;
  }
  static get isJoyLeft() {
    const sideways = KeyInput.currentGamepad.axes[0];
    return sideways < -0.15;
  }
  static get isJoyRight() {
    const sideways = KeyInput.currentGamepad.axes[0];
    return sideways > 0.15;
  }
  static get isJoyCentre() {
    const sideways = KeyInput.currentGamepad.axes[0];
    return sideways >= -0.15 && sideways <= 0.15;
  }
  static togglePause() {
    KeyInput.isPaused = !KeyInput.isPaused;
  }
}
class Ufo {
  constructor() {
    this.x = -50;
    this.direction = 6;
    this.saucerImage = Graphic.image("./invaders.png");
    this.isInFlight = false;
    this.flightCounter = 0;
    this.isDestroyed = false;
    this.destroyedCount = 0;
    this.saucerExplode = Graphic.image("./SaucerExplode.png");
    this.score = 0;
    this.explodeCount = 0;
  }
  get mysteryScore() {
    return Math.floor(Math.random() * 2.9999 + 1) * 100;
  }
  update(laserBeam) {
    if (this.isDestroyed) this.destroyedCount += 1;

    if (this.isInFlight) {
      if (this.x > 900 || this.x < -50) {
        this.direction = -this.direction;
        this.isInFlight = false;
        if (this.x > 900) this.x = 900;
        if (this.x < -50) this.x = -50;
        Sound.saucerHi.pause();
        Sound.saucerHi.currentTime = 0;
      }

      if (
        !this.isDestroyed &&
        laserBeam.isFiring &&
        this.hitzone.contains(laserBeam.tip)
      ) {
        this.isDestroyed = true;
        Sound.saucerHi.pause();
        Sound.saucerHi.currentTime = 0;
        Sound.saucerLo.play();
        this.score = this.mysteryScore;
        game.addScore(this.score);
      }

      if (this.isInFlight) {
        if (!this.isDestroyed) this.x += this.direction;
        if (this.destroyedCount >= 95) {
          this.isInFlight = false;
          this.isDestroyed = false;
          this.flightCounter = 0;
          this.destroyedCount = 0;
          if (this.direction > 0) this.x = 900;
          if (this.direction < 0) this.x = -50;
        } else {
          this.display();
        }
      }
    } else {
      this.flightCounter += 1;
      if (this.flightCounter >= 300) {
        this.isInFlight = true;
        this.flightCounter = 0;
        Sound.saucerHi.play();
      }
    }
  }
  display() {
    if (this.isDestroyed) {
      this.displaySaucerExplode();
    } else this.displaySaucer();
    /*
    const zone = this.hitzone;
    Control.graphics.beginPath();
    Control.graphics.strokeStyle = "red";
    Control.graphics.lineWidth = 1;
    Control.graphics.moveTo(zone.x, zone.y);
    Control.graphics.lineTo(zone.x + zone.width, zone.y);
    Control.graphics.lineTo(zone.x + zone.width, zone.y + zone.height);
    Control.graphics.lineTo(zone.x, zone.y + zone.height);
    Control.graphics.lineTo(zone.x, zone.y);
    Control.graphics.stroke();
    */
  }
  displaySaucer() {
    const xOffset = 20;
    const yOffset = 20;
    const subRectWidth = 140;
    const subRectHeight = 70;
    const width = 50;
    const ratio = 0.6;
    const height = width * ratio;

    Control.graphics.drawImage(
      this.saucerImage,
      xOffset, // x-offset into image  225=small-in  320=small-out
      yOffset, // y-offset into image
      subRectWidth, // sub-rectangle width
      subRectHeight, // sub-rectangle height
      this.x,
      0,
      width, // this.invaderOutputSize, //177,
      height //this.invaderOutputSize / this.imageRatio //100
    );
  }
  displaySaucerExplode() {
    this.explodeCount += 1;
    if (this.explodeCount < 20) {
      Control.graphics.drawImage(this.saucerExplode, this.x, 0, 50, 50 * 0.5);
    } else {
      const oldFillStype = Control.graphics.fillStyle;
      Control.graphics.fillStyle = "red";
      Control.graphics.fillText(this.score, this.x + 10, 25);
      Control.graphics.fillStyle = oldFillStype;
    }
  }
  get hitzone() {
    return {
      x: this.x + 2,
      y: 0,
      width: 46,
      height: 46 * 0.6,
      contains: function ({ x, y }) {
        return (
          x > this.x &&
          x < this.x + this.height &&
          y > this.y &&
          y < this.y + this.width
        );
      },
    };
  }
}
class Invader {
  static nextId = 0;
  constructor(board, x, y, size, column) {
    this.board = board;
    this.column = column;
    this.x = x;
    this.y = y;
    this.image = new Image();
    this.image.src = "./invaders.png";
    this.invaderSize = 400;
    this.imageRatio = 1.3; //7777778;
    this.invaderOutputSize = 40;
    this.previousUpdate = 0;
    this.direction = 1;
    this.currentImage = 1;
    this.isShot = false;
    this.size = size;
    this.isBomber = false;
    this.shotCount = 0;
    this.points = (4 - this.size) * 10;
    this.id = ++Invader.nextId;
  }
  update(timestamp) {
    let elapsed = timestamp - this.previousUpdate;
    if (elapsed > this.board.stepDelay) {
      this.x += this.board.speed * this.board.direction; // * this.direction;
      this.currentImage = -this.currentImage;
      this.previousUpdate = timestamp;
    }
    game.shields.checkShields(game.board.bombers); // bottomRow
    this.display();
  }
  get height() {
    if (this.size == 1) return 20;
    if (this.size == 2) return 20;
    if (this.size == 3) return 27;
  }
  get width() {
    if (this.size == 1) return 22;
    if (this.size == 2) return 30;
    if (this.size == 3) return 32;
  }
  display() {
    let xOffset = 0,
      yOffset = 92,
      subRectWidth = 100,
      subRectHeight = 92;
    if (this.size == 1) xOffset = this.currentImage == 1 ? 228 : 320;
    if (this.size == 2) xOffset = this.currentImage == 1 ? 10 : 120;
    if (this.size == 3) {
      xOffset = this.currentImage == 1 ? 170 : 290;
      yOffset = 15;
      subRectWidth = 110;
      subRectHeight = 70;
    }

    if (this.isShot) {
      //Control.graphics.beginPath();
      //Control.graphics.arc(this.x + 20, this.y + 15, 11, 0, fullCircle, false);
      //Control.graphics.strokeStyle = "#F00";
      //Control.graphics.stroke();
      this.shotCount += 1;
      if (this.shotCount < 10)
        Control.graphics.drawImage(
          Graphic.alienExplosion,
          this.x,
          this.y + 5,
          40,
          24
        );
    } else {
      Control.graphics.drawImage(
        this.image,
        xOffset, // x-offset into image  225=small-in  320=small-out
        yOffset, // y-offset into image
        subRectWidth, // sub-rectangle width
        subRectHeight, // sub-rectangle height
        this.x,
        this.y,
        this.invaderOutputSize, //177,
        this.invaderOutputSize / this.imageRatio //100
      );

      //Control.graphics.fillStyle = "yellow";
      //Control.graphics.fillText(this.column, this.x + 20, this.y + 15);

      //if (this.isBomber) {
      //  Control.graphics.beginPath();
      //  Control.graphics.arc(this.x + 20, this.y + 15, 5, 0, fullCircle, false);
      //  Control.graphics.strokeStyle = "#00F";
      //  Control.graphics.fill();
      // }

      // if (this.isInBottomRow) {
      //   const hitZone = this.hitZone;
      //   Control.graphics.beginPath();
      //   Control.graphics.strokeStyle = "red";
      //   Control.graphics.lineWidth = 1;
      //   Control.graphics.rect(hitZone.x, hitZone.y, hitZone.width, hitZone.height);
      //   Control.graphics.stroke();
      // }
    }
  }
  get isInBottomRow() {
    return game.board.bottomRow.some((inv) => inv.id == this.id);
  }
  get hitZone() {
    if (this.size == 1)
      return {
        x: this.x + 8,
        y: this.y + 5,
        width: 22,
        height: 20,
      };
    if (this.size == 2)
      return {
        x: this.x + 6,
        y: this.y + 5,
        width: 30,
        height: 20,
      };
    if (this.size == 3)
      return {
        x: this.x + 4,
        y: this.y + 2,
        width: 32,
        height: 27,
      };
  }
  isHit({ x, y }) {
    if (this.isShot) return null;
    this.isShot = this.isPointInsideArea({ x, y }, this.hitZone);
    if (this.isShot) {
      game.addScore(this.points);
      return this;
    } else return null;
  }
  isPointInsideArea(point, area) {
    return (
      point.x >= area.x &&
      point.x <= area.x + area.height &&
      point.y >= area.y &&
      point.y <= area.y + area.height
    );
  }
}
class Bomb {
  constructor(bombs, x, y) {
    this.bombs = bombs;
    this.x = x;
    this.y = y;
    this.animationFrame = 0;
    this.frameCount = 0;
    this.isDestroyed = false;
    this.isDestructing = false;
    this.destructCount = 0;
    const rnd = Math.random();
    if (rnd < 0.2) this.type = 0;
    // zigzag
    else if (rnd < 0.6) this.type = 1;
    // plunger
    else this.type = 2; // rolling
  }
  update() {
    if (this.isDestructing) {
      this.destructCount += 1;
      if (this.destructCount > 4) this.isDestroyed = true;
    } else if (!this.isDestroyed) {
      const bombSpeed = game.board.count >= 8 ? 7 : 12;
      this.y += bombSpeed;
      if (++this.frameCount % 3 == 0)
        if (++this.animationFrame > 3) this.animationFrame = 0;

      if (this.isLaserBaseHit) {
        Sound.explosion.play();
        this.destroyBomb();
        game.laserBase.hit();
      } else if (this.y > 476) {
        this.isDestructing = true;
      } else if (this.isShieldHit) {
        this.isDestructing = true;
      }
    }
    this.display();
  }
  destroyBomb() {
    this.isDestroyed = true;
  }
  display() {
    if (this.isDestructing) {
      Control.graphics.drawImage(Graphic.bombExplosion, this.x, this.y, 15, 20);
    } else {
      Control.graphics.drawImage(
        Graphic.bombFrame[this.type][this.animationFrame],
        this.x,
        this.y,
        9,
        24
      );
    }
    /*
    const hitZone = this.hitZone;
    Control.graphics.beginPath();
    Control.graphics.strokeStyle = "red";
    Control.graphics.lineWidth = 1;
    Control.graphics.rect(hitZone.x, hitZone.y, hitZone.width, hitZone.height);
    Control.graphics.stroke();
    */
  }
  get bombTip() {
    return { x: this.x + 5, y: this.y + 20 };
  }
  get bombMid() {
    // if the bomb is moving fast this check makes sure it does not skip over a shield segment
    return { x: this.x + 5, y: this.y + 10 };
  }
  get hitZone() {
    const bombTip = this.bombTip;
    return { x: bombTip.x - 3, y: bombTip.y - 20, width: 6, height: 24 };
  }
  isHit({ x, y }) {
    // is hit by laser beam?
    if (this.isDestroyed || this.isDestructing) return false;
    const hitZone = this.hitZone;
    if (
      x >= hitZone.x &&
      x <= hitZone.x + hitZone.width &&
      y >= hitZone.y &&
      y <= hitZone.y + hitZone.height
    ) {
      this.isDestructing = true;
      return true;
    }
  }
  get isLaserBaseHit() {
    if (game.laserBase.isShot) return false;
    const y = this.y + 18;
    return (
      this.x > game.laserBase.x + 1 &&
      this.x < game.laserBase.x + 36 &&
      y > 460 &&
      y < 475
    );
  }
  get isShieldHit() {
    return game.shields.isHit(this.bombMid) || game.shields.isHit(this.bombTip);
  }
}
class Board {
  static Left = 40;
  static Right = 800;
  static NewBombFactor = 0.01; // 0.01;
  static MaxBombs = 3;
  //static Direction = 1;
  constructor(level) {
    this.board = [];
    this.bombs = [];
    this.direction = 1;
    this.advanceCount = 0;

    const horizontalGap = 50;
    const topMargin = 40; // starting height position of aliens - 40
    const advanceLevel = level * 20; // each new board starts lower and lower
    let index = -1;
    /*
    this.board.push(
      new Invader(
        this,
        100, // + x * horizontalGap,
        topMargin + advanceLevel,
        1,
        ++index % 11
      )
    );

    this.board.push(
      new Invader(
        this,
        200, // + x * horizontalGap,
        topMargin + advanceLevel + 40,
        1,
        ++index % 11
      )
    );
*/

    for (let x = 0; x < 11; ++x) {
      this.board.push(
        new Invader(
          this,
          100 + x * horizontalGap,
          topMargin + advanceLevel,
          1,
          ++index % 11
        )
      );
    }

    for (let y = 0; y < 2; ++y) {
      for (let x = 0; x < 11; ++x) {
        this.board.push(
          new Invader(
            this,
            100 + x * horizontalGap,
            topMargin + (40 + y * 40) + advanceLevel,
            2,
            ++index % 11
          )
        );
      }
    }

    for (let y = 0; y < 2; ++y) {
      for (let x = 0; x < 11; ++x) {
        this.board.push(
          new Invader(
            this,
            100 + x * horizontalGap,
            topMargin + (120 + y * 40) + advanceLevel,
            3,
            ++index % 11
          )
        );
      }
    }
  }
  get isDropNewBomb() {
    // dropping new bomb should become more frequent as the number of aliens reduces
    return (
      !game.isGameFinishing &&
      Math.random() < Board.NewBombFactor + (55 - this.count) * 0.004
    );
  }
  get speed() {
    // make last few aliens even faster
    const c = this.count;
    if (c > 3) return 10;
    if (c == 3) return 15;
    if (c == 2) return 20;
    if (c == 1) return 30;
  }
  get stepDelay() {
    return this.count * 15 + 20;
  }
  get count() {
    return this.board.filter((i) => !i.isShot).length;
  }
  isAlienHit({ x, y }) {
    for (let i = 0; i < this.board.length; ++i) {
      if (this.board[i].isHit({ x, y })) {
        Sound.killedInvader.play();
        return true;
      }
    }
  }
  isBombHit({ x, y }) {
    for (let i = 0; i < this.bombs.length; ++i) {
      const currentBomb = this.bombs[i];
      if (currentBomb.isHit({ x, y })) {
        currentBomb.isDestructing = true;
        return true;
      }
    }
    return false;
  }
  get left() {
    const board = this.board.filter((i) => !i.isShot);
    if (board.length == 0) return -1;
    if (board.length == 1) return board[0].x;
    let search = board[0].x;
    for (let i = 1; i < board.length; ++i) {
      if (board[i].x < search) search = board[i].x;
    }
    return search;
  }
  get right() {
    const board = this.board.filter((i) => !i.isShot);
    if (board.length == 0) return -1;
    if (board.length == 1) return board[0].x;
    let search = board[0].x;
    for (let i = 1; i < board.length; ++i) {
      if (board[i].x > search) search = board[i].x;
    }
    return search;
  }
  get bottom() {
    const board = this.board.filter((i) => !i.isShot);
    if (board.length == 0) return -1;
    if (board.length == 1) return board[0].y;
    let search = board[0].y;
    for (let i = 1; i < board.length; ++i) {
      if (board[i].y > search) search = board[i].y;
    }
    return search;
  }
  get bombers() {
    // get invaders that are lowest in their column (they can drop bombs)
    let bombers = [];
    for (let i = 0; i < 11; ++i) {
      let column = this.board.filter((inv) => !inv.isShot && inv.column == i);
      if (column.length > 0) {
        let invader = column[column.length - 1];
        invader.isBomber = true;
        bombers.push(invader);
      }
    }
    return bombers;
  }
  get bottomRow() {
    // get invaders that are in the lowest row
    //const bottom = this.bottom;
    return this.bombers; //.filter((inv) => inv.y == bottom);
  }
  get isLanded() {
    return this.bottom > 400;
  }
  update(timestamp) {
    this.updateBombs(timestamp);
    this.updateInvaders(timestamp);
    this.updateNewBombs(timestamp);
  }
  advance() {
    this.advanceCount += 1;
    if (this.isLanded) {
      game.lost();
      // return;
    }
    this.board.forEach((i) => (i.y += 20));

    // TODO: work out which shield segments, if any, have been eaten by advancing aliens
    //if (this.bottom + 22 > game.shields.top) {
    //  console.log("eating shields");
    //  game.shields.checkShields(game.board.bottomRow);
    //}
  }
  updateInvaders(timestamp) {
    if (
      (this.direction == 1 && this.right > Board.Right) ||
      (this.direction == -1 && this.left < Board.Left)
    ) {
      this.direction = -this.direction;
      this.advance();
    }
    this.board.forEach((i) => i.update(timestamp));
    /*
    const bottom = this.bottom + 30;
    Control.graphics.beginPath();
    Control.graphics.strokeStyle = "lightblue";
    Control.graphics.lineWidth = 1;
    Control.graphics.moveTo(0, bottom);
    Control.graphics.lineTo(900, bottom);
    Control.graphics.stroke();
    */
  }
  updateBombs(timestamp) {
    this.bombs.forEach((b) => b.update());
    this.bombs = this.bombs.filter((b) => !b.isDestroyed);
  }
  updateNewBombs(timestamp) {
    if (this.bombs.length < Board.MaxBombs) {
      let bombers = this.bombers; // cache in local var to avoid recalc
      if (bombers.length == 0) return;
      if (this.isDropNewBomb) {
        if (bombers.length == 1) this.dropBomb(bombers[0]);
        else {
          const idx = Math.floor(Math.random() * 10000) % bombers.length;
          this.dropBomb(bombers[idx]);
        }
      }
    }
  }
  dropBomb({ x, y }) {
    this.bombs.push(new Bomb(this.bombs, x + 20, y + 20));
  }
}
class LaserBase {
  constructor() {
    this.x = 100;
    this.y = 450;
    //this.isShot = false;
    this.deadTimer = 0;
  }
  update(timestamp) {
    if (this.deadTimer > 120) {
      this.reset();
      return;
    }
    //if (this.isShot) this.deadTimer += 1;
    if (this.deadTimer > 0) this.deadTimer += 1;
    //if (!this.isShot) {
    else {
      if (KeyInput.isMoveLeft && this.x > 20) this.x -= 3;
      if (KeyInput.isMoveRight && this.x < 840) this.x += 3;
      /*
      if (
        KeyInput.isFire &&
        KeyInput.isLaserReloaded &&
        !game.laserBeam.isFiring &&
        this.deadTimer == 0
      )
        game.laserBeam.fireNewLaserBeam();
        */
    }
    this.display(timestamp);
  }
  display(timestamp) {
    //if (!this.isShot || this.deadTimer < 40) {
    if (this.deadTimer < 40) {
      Control.graphics.drawImage(this.image, this.x, 450, 36, 22);
    }
  }
  hit() {
    //this.isShot = true;
    this.deadTimer += 1;
    game.loseLife();
  }
  reset() {
    //this.isShot = false;
    this.x = 100;
    this.deadTimer = 0;
  }
  get image() {
    //if (!this.isShot) return Graphic.laserImage;
    if (this.deadTimer == 0) return Graphic.laserImage;
    return this.deadTimer % 4 >= 2
      ? Graphic.laserExplosion1
      : Graphic.laserExplosion2;
  }
  get isShot() {
    return this.deadTimer > 0;
  }
}
class LaserBeam {
  constructor() {
    this.x = 0;
    this.y = 0;
    this.isFiring = false;
    this.selfDestruct = false;
    this.selfDestructCount = 0;
  }
  get tip() {
    return { x: this.x, y: this.y };
  }
  fireNewLaserBeam() {
    this.x = game.laserBase.x + 18;
    this.y = 460;
    this.isFiring = true;
    KeyInput.isLaserReloaded = false;
    //KeyInput.isFireDown = false;
    this.selfDestruct = false;
    this.selfDestructCount = 0;
    Sound.laserShoot.play();
  }
  update() {
    if (this.selfDestruct) {
      this.selfDestructCount += 1;
      if (this.selfDestructCount < 7) {
        Control.graphics.drawImage(
          Graphic.laserBeamExplode,
          this.x - 8,
          this.y,
          20,
          24
        );
      } else {
        this.isFiring = false;
        this.selfDestruct = false;
      }
    } else if (this.isFiring) {
      for (let i = 0; i < 4; ++i) {
        // laser beam currently firing
        this.y -= 5; // 20
        if (this.y <= 10) {
          // laser beam has gone off top of screen
          this.selfDestruct = true;
          break;
        } else if (game.board.isAlienHit({ x: this.x, y: this.y })) {
          // laser beam has hit an alien
          this.isFiring = false;
          // laser beam just disappears immediately
          break;
        } else if (game.board.isBombHit({ x: this.x, y: this.y })) {
          // laser beam hit a bomb and explodes
          this.selfDestruct = true;
        } else if (game.shields.isHit(this)) {
          // laser beam hit a shield and disappears
          this.isFiring = false;
          break;
        }
      }
    }

    if (this.isFiring ^ this.selfDestruct) this.display();
  }
  display() {
    Control.graphics.beginPath();
    Control.graphics.strokeStyle = "#05FF05";
    Control.graphics.lineWidth = 3;
    Control.graphics.moveTo(this.x, this.y);
    Control.graphics.lineTo(this.x, this.y + 12); // -8
    Control.graphics.stroke();
  }
  isHit({ x, y }) {
    if (this.isFiring == false || this.selfDestruct) return false;
    else {
      const hitWidth = 3;
      const bombTip = y + 18;
      const bombTail = y;
      const hit =
        this.x >= x - hitWidth &&
        this.x <= x + hitWidth &&
        ((bombTip <= this.y + 10 && bombTip >= this.y - 10) ||
          (bombTail <= this.y + 10 && bombTail >= this.y - 10));

      //this.isFiring = !hit;
      if (hit) {
        this.selfDestruct = true;
        this.y = y;
      }
      return hit;
    }
  }
}
class Segment {
  constructor(x, y, width, height) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.isDestroyed = false;
  }
  display() {
    /*
    Control.graphics.beginPath();
    Control.graphics.strokeStyle = "green";
    Control.graphics.lineWidth = 1;
    Control.graphics.moveTo(this.x, this.y);
    Control.graphics.lineTo(this.x + this.width, this.y);
    Control.graphics.lineTo(this.x + this.width, this.y + this.height);
    Control.graphics.lineTo(this.x, this.y + this.height);
    Control.graphics.lineTo(this.x, this.y);
    if (!this.isDestroyed) Control.graphics.lineTo(this.x + this.width, this.y + this.height);
    Control.graphics.stroke();
    */

    if (!this.isDestroyed) {
      Control.graphics.fillStyle = "lime";
      Control.graphics.fillRect(
        this.x,
        this.y,
        this.width + 1,
        this.height + 1
      );
    }
  }
  get hitZone() {
    return { x: this.x, y: this.y, width: this.width, height: this.height };
  }
}
class Shield {
  static noShields = [
    { x: 0, y: 0 },
    { x: 0, y: 1 },
    { x: 1, y: 0 },
    { x: 6, y: 0 },
    { x: 7, y: 0 },
    { x: 7, y: 1 },
    { x: 2, y: 5 },
    { x: 3, y: 5 },
    { x: 4, y: 5 },
    { x: 5, y: 5 },
    //    { x: 2, y: 4 },
    { x: 3, y: 4 },
    { x: 4, y: 4 },
    //    { x: 5, y: 4 },
    //    { x: 3, y: 3 },
    //    { x: 4, y: 3 },
  ];
  constructor(x, y, width, height, xBlocks, yBlocks) {
    this.x = x;
    this.y = y;
    const segmentWidth = width / xBlocks;
    const segmentHeight = height / yBlocks;
    this.segments = [];
    for (x = 0; x < xBlocks; ++x) {
      for (y = 0; y < yBlocks; ++y) {
        const seg = new Segment(
          this.x + x * segmentWidth,
          this.y + y * segmentHeight,
          segmentWidth,
          segmentHeight
        );
        //if ((x == 1 || x == 2) && y == 3) seg.isDestroyed = true;
        //if (x + y < 2) seg.isDestroyed = true;
        //if (x == topRightX && y == topRightY) seg.isDestroyed = true;
        if (!Shield.noShields.find((s) => s.x === x && s.y === y))
          //seg.isDestroyed = true;
          this.segments.push(seg);
      }
    }
  }
  display() {
    this.segments.forEach((s) => s.display());
  }
  isHit(x, y) {
    const segments = this.segments.filter((s) => !s.isDestroyed);

    for (let i = 0; i < segments.length; ++i) {
      const s = segments[i];
      if (x >= s.x && x <= s.x + s.width && y > s.y && y < s.y + s.height) {
        s.isDestroyed = true;
        return true;
      }
    }

    return false;
  }
  checkSegments(invaders) {
    for (let i = 0; i < invaders.length; ++i) {
      const invader = invaders[i];
      const segments = this.segments.filter((s) => !s.isDestroyed);
      for (let i = 0; i < segments.length; ++i) {
        const segment = segments[i];
        if (this.isOverlap(invader.hitZone, segment.hitZone)) {
          segment.isDestroyed = true;
        }
      }
    }
  }
  isOverlap(rectA, rectB) {
    rectA.top = rectA.y;
    rectA.bottom = rectA.y + rectA.height;
    rectA.left = rectA.x;
    rectA.right = rectA.x + rectA.width;

    rectB.top = rectB.y;
    rectB.bottom = rectB.y + rectB.height;
    rectB.left = rectB.x;
    rectB.right = rectB.x + rectB.width;

    const left = rectA.left < rectB.right;
    const right = rectA.right > rectB.left;
    const top = rectA.top < rectB.bottom;
    const bottom = rectA.bottom > rectB.top;

    const ret = left && right && top && bottom;
    return ret;
  }
  get min() {
    let x = Number.MAX_SAFE_INTEGER;
    let y = Number.MAX_SAFE_INTEGER;
    this.segments.forEach((s) => {
      if (!s.isDestroyed && s.x < x) x = s.x;
      if (!s.isDestroyed && s.y < y) y = s.y;
    });
    return { x, y };
  }
  get max() {
    let x = -1;
    let y = -1;
    this.segments.forEach((s) => {
      if (!s.isDestroyed && s.x + s.width > x) x = s.x + s.width;
      if (!s.isDestroyed && s.y + s.height > y) y = s.y + s.height;
    });
    return { x, y };
  }
}
class Shields {
  constructor(x, y, gap, shields, width, height, xBlocks, yBlocks) {
    this.shields = [];
    for (let count = 0; count < shields; ++count) {
      let shield = new Shield(
        x + count * gap,
        y,
        width,
        height,
        xBlocks,
        yBlocks
      );
      this.shields.push(shield);
    }
  }
  display() {
    this.shields.forEach((s) => s.display());
    /*
    const top = this.top;
    Control.graphics.beginPath();
    Control.graphics.strokeStyle = "red";
    Control.graphics.lineWidth = 1;
    Control.graphics.moveTo(0, top);
    Control.graphics.lineTo(900, top);
    Control.graphics.stroke();
    */
  }
  isHit({ x, y }) {
    for (let i = 0; i < this.shields.length; ++i) {
      const shield = this.shields[i];
      const minPoint = shield.min;
      const maxPoint = shield.max;
      if (
        x >= minPoint.x &&
        x <= maxPoint.x &&
        y >= minPoint.y &&
        y <= maxPoint.y
      ) {
        return shield.isHit(x, y);
      }
    }
  }
  get top() {
    let search = Number.MAX_SAFE_INTEGER;
    for (let i = 0; i < this.shields.length; ++i) {
      if (this.shields[i].min.y < search) search = this.shields[i].min.y;
    }
    return search;
  }
  checkShields(invaders) {
    this.shields.forEach((shield) => shield.checkSegments(invaders));
  }
}
class Game {
  #score;
  #currentLivesLeft;
  #boardLevel;
  #hiScore = 0;
  constructor() {
    this.reset();
  }
  reset() {
    this.#score = 0;
    this.boardLevel = 1;
    this.addScore(0);
    this.#currentLivesLeft = 4;
    this.loseLife();
    this.board = new Board(this.advanceLevel);
    this.laserBase = new LaserBase();
    this.laserBeam = new LaserBeam();
    this.shields = new Shields(80, 380, 216, 4, 90, 50, 8, 6);
    this.soundTimestamp = 0;
    this.soundStep = 0;
    this.previousTimestamp = 0;
    this.gameOverCount = 0;
    this.isPausing = false;
    this.isResetting = false;
    KeyInput.isPaused = false;
    this.ufo = new Ufo();
  }
  addScore(points) {
    if (this.#score < 1500 && this.#score + points >= 1500) this.addLife();
    this.#score += points;
    const paddedScore = "000" + this.#score;
    Control.scoreControl.innerText = paddedScore.substr(paddedScore.length - 4);

    if (this.#score > this.#hiScore) {
      this.#hiScore = this.#score;
      Control.hiscoreControl.innerText = Control.scoreControl.innerText;
    }
  }
  addLife() {
    this.#currentLivesLeft += 1;
    Control.livesControl.innerText = this.#currentLivesLeft;
  }
  loseLife() {
    this.#currentLivesLeft -= 1;
    Control.livesControl.innerText = this.#currentLivesLeft;
    if (this.#currentLivesLeft == 0) this.lost();
  }
  get advanceLevel() {
    return this.boardLevel % 8;
  }
  get boardLevel() {
    return this.#boardLevel;
  }
  set boardLevel(level) {
    this.#boardLevel = level;
    Control.sheetControl.innerText = this.#boardLevel;
  }
  get over() {
    return this.gameOverCount > 60;
  }
  get isGameFinishing() {
    return this.gameOverCount > 0;
  }
  lost() {
    this.gameOverCount += 1;
    // if (this.#score > this.#hiScore) {
    //   this.#hiScore = this.#score;
    //   Control.hiscoreControl.innerText = this.#hiScore;
    // }
  }
  update(timestamp) {
    if (this.gameOverCount > 0) this.gameOverCount += 1;
    Control.debugControl.innerText = `GameOverCount=${this.gameOverCount}`;
    Control.graphics.clearRect(
      0,
      0,
      Control.canvas.width,
      Control.canvas.height
    );
    this.laserBase.update(timestamp);
    this.board.update(timestamp);
    this.laserBeam.update();

    if (
      !this.laserBeam.isFiring &&
      !this.laserBase.isShot &&
      KeyInput.isFire &&
      KeyInput.isLaserReloaded
    ) {
      this.laserBeam.fireNewLaserBeam();
    }

    this.shields.display();
    if (this.board.count < 1) {
      this.boardLevel += 1;
      this.board = new Board(this.advanceLevel);
      this.shields = new Shields(80, 380, 216, 4, 90, 50, 8, 6);
    }

    this.ufo.update(this.laserBeam);

    this.playSound(timestamp);
  }
  playSound(timestamp) {
    const elapsed = timestamp - this.soundTimestamp;
    if (elapsed > this.board.stepDelay) {
      Sound.soundSteps[this.soundStep].play();
      this.soundStep += 1;
      if (this.soundStep >= Sound.soundSteps.length) this.soundStep = 0;
      this.soundTimestamp = timestamp;
    }
  }
  getGamePadInfo() {
    KeyInput.Refresh();

    if (
      KeyInput.isButtonPressed(KeyInput.ButtonB) &&
      !game.laserBeam.isFiring
    ) {
      KeyInput.isLaserReloaded = true;
      KeyInput.isFireDown = true;
    }

    if (KeyInput.isButtonDown(KeyInput.CentreHat) && KeyInput.isJoyCentre) {
      KeyInput.isLeftDown = false;
      KeyInput.isRightDown = false;
    }
    if (KeyInput.isButtonDown(KeyInput.LeftHat) || KeyInput.isJoyLeft)
      KeyInput.isLeftDown = true;
    if (KeyInput.isButtonDown(KeyInput.RightHat) || KeyInput.isJoyRight)
      KeyInput.isRightDown = true;

    if (KeyInput.isButtonPressed(KeyInput.backButton)) this.reset();
    if (KeyInput.isButtonPressed(KeyInput.startButton)) KeyInput.togglePause();
    if (KeyInput.isButtonPressed(KeyInput.ButtonY)) Sound.increaseVolume();
    if (KeyInput.isButtonPressed(KeyInput.ButtonA)) Sound.decreaseVolume();
  }
  step(timestamp, override) {
    if (KeyInput.isGamePadConnected) this.getGamePadInfo();

    if (!this.over && (!KeyInput.isPaused || override)) {
      const elapsed = timestamp - this.previousTimestamp;
      if (elapsed > 30) {
        this.update(timestamp);
        this.previousTimestamp = timestamp;
      }
    }
    requestAnimationFrame(Game.animate);
  }
  start = () => requestAnimationFrame(Game.animate);
  static animate = (timestamp) => game.step(timestamp);
}

var game = new Game();
game.start();
