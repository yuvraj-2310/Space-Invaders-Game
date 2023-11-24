import sound from '../assets/sounds/enemy-death.wav';
import Enemy from './Enemy';
import MovingDirection from './MovingDirection';
/* // for iOS:
import sound1 from '../assets/sounds/enemy-death1.wav';
import sound2 from '../assets/sounds/enemy-death2.wav';
import sound3 from '../assets/sounds/enemy-death3.wav';
import sound4 from '../assets/sounds/enemy-death4.wav';
import sound5 from '../assets/sounds/enemy-death5.wav';
import sound6 from '../assets/sounds/enemy-death6.wav';
import sound7 from '../assets/sounds/enemy-death7.wav';
import sound8 from '../assets/sounds/enemy-death8.wav';
import sound9 from '../assets/sounds/enemy-death9.wav';
import sound10 from '../assets/sounds/enemy-death10.wav'; */

let w = window,
  d = document,
  g = d.getElementsByTagName('body')[0],
  xx = w.innerWidth || g.clientWidth;

let enemyWidth = 44;
let enemyHeight = 32;
let widthRatio = 1.36;
let heightRatio = 1.36;
let defaultXVelocityRatio = 1.6;
let defaultYVelocityRatio = 1;

if (xx <= 1024) {
  enemyWidth = enemyWidth * 0.85;
  enemyHeight = enemyHeight * 0.85;
}

if (xx <= 600) {
  enemyWidth = enemyWidth * 0.7;
  enemyHeight = enemyHeight * 0.7;
  widthRatio = widthRatio * 1.1;
  heightRatio = heightRatio * 1;
  defaultXVelocityRatio = 1;
  defaultYVelocityRatio = 0.7;
}
if (xx <= 425) {
  enemyWidth = enemyWidth * 0.55;
  enemyHeight = enemyHeight * 0.55;
  widthRatio = widthRatio * 1.2;
  heightRatio = heightRatio * 1.1;
  defaultXVelocityRatio = 0.9;
  defaultYVelocityRatio = 0.6;
}

Audio.prototype.stop = function () {
  this.pause();
  this.currentTime = 0;
};
Audio.prototype.restart = function () {
  this.pause();
  this.currentTime = 0;
  this.play();
};

export default class EnemyController {
  enemyMap = [
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [2, 2, 2, 3, 3, 3, 3, 2, 2, 2],
    [2, 2, 2, 3, 3, 3, 3, 2, 2, 2],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
  ];
  enemyRows = [];

  currentDirection = MovingDirection.right;
  xVelocity = 0;
  yVelocity = 0;
  defaultXVelocity = defaultXVelocityRatio;
  defaultYVelocity = defaultYVelocityRatio;
  moveDownTimerDefault = 32;
  moveDownTimer = this.moveDownTimerDefault;
  fireBulletTimerDefault = 100;
  fireBulletTimer = this.fireBulletTimerDefault;

  constructor(canvas, enemyBulletController, playerBulletController) {
    this.canvas = canvas;
    this.enemyBulletController = enemyBulletController;
    this.playerBulletController = playerBulletController;
    this.createEnemies();

    this.enemyDeathSound = new Audio(sound);
    this.enemyDeathSound.volume = 0.5;

    /* 		this.deathSound1 = new Audio(sound1);
		this.deathSound2 = new Audio(sound2);
		this.deathSound3 = new Audio(sound3);
		this.deathSound4 = new Audio(sound4);
		this.deathSound5 = new Audio(sound5);
		this.deathSound6 = new Audio(sound6);
		this.deathSound7 = new Audio(sound7);
		this.deathSound8 = new Audio(sound8);
		this.deathSound9 = new Audio(sound9);
		this.deathSound10 = new Audio(sound10);

		this.sounds = [
			this.deathSound1,
			this.deathSound2,
			this.deathSound3,
			this.deathSound4,
			this.deathSound5,
			this.deathSound6,
			this.deathSound7,
			this.deathSound8,
			this.deathSound9,
			this.deathSound10,
		];

		this.sounds.forEach(function (item) {
			item.volume = 0.5;
		}); */
  }

  draw(ctx) {
    this.decrementMoveDownTimer();
    this.updateVelocityAndDirection();
    this.collisionDetection();
    this.drawEnemies(ctx);
    this.resetMoveDownTimer();
    this.fireBullet();
  }

  /* 	copyArray = [];
	getRandomItem(array) {
		if (this.copyArray.length === 0) {
			for (let i = 0; i < array.length; i++) this.copyArray.push(i);
		}
		let randomIndexCopyArray = Math.floor(
			Math.random() * this.copyArray.length
		);
		let randomIndexOriginalArray = this.copyArray[randomIndexCopyArray];

		this.copyArray.splice(randomIndexCopyArray, 1);
		this.item = array[randomIndexOriginalArray];

		return this.item;
	} */

  /* 	arrayIndex = 0;
	getItem(array) {
		this.item = array[this.arrayIndex++];
		if (this.arrayIndex === array.length) {
			this.arrayIndex = 0;
		}
		this.item.stop();
		return this.item;
	} */

  collisionDetection() {
    this.enemyRows.forEach((enemyRow) => {
      enemyRow.forEach((enemy, enemyIndex) => {
        if (this.playerBulletController.collideWith(enemy)) {
          this.enemyDeathSound.restart();

          // this.enemyDeathSound.currentTime = 0;
          // this.enemyDeathSound.play();

          // for random sounds:
          /* 					let deathSound = this.getRandomItem(this.sounds);
					deathSound.currentTime = 0;
					deathSound.play();
					// console.log(deathSound); */

          /* 					let deathSound = this.getItem(this.sounds);
					deathSound.restart();
					// console.log(deathSound); */

          enemyRow.splice(enemyIndex, 1);
        }
      });
    });
    this.enemyRows = this.enemyRows.filter((enemyRow) => enemyRow.length > 0);
  }

  fireBullet() {
    this.fireBulletTimer--;
    if (this.fireBulletTimer <= 0) {
      this.fireBulletTimer = this.fireBulletTimerDefault;
      const allEnemies = this.enemyRows.flat();
      const enemyIndex = Math.floor(Math.random() * allEnemies.length);
      const enemy = allEnemies[enemyIndex];
      this.enemyBulletController.shoot(enemy.x, enemy.y, -4);
      // console.log(enemyIndex);
    }
  }

  decrementMoveDownTimer() {
    if (
      this.currentDirection === MovingDirection.downLeft ||
      this.currentDirection === MovingDirection.downRight
    ) {
      this.moveDownTimer--;
    }
  }

  resetMoveDownTimer() {
    if (this.moveDownTimer <= 0) {
      this.moveDownTimer = this.moveDownTimerDefault;
    }
  }

  updateVelocityAndDirection() {
    for (const enemyRow of this.enemyRows) {
      if (this.currentDirection === MovingDirection.right) {
        this.xVelocity = this.defaultXVelocity;
        this.yVelocity = 0;
        const rightMostEnemy = enemyRow[enemyRow.length - 1];
        if (rightMostEnemy.x && rightMostEnemy.x + rightMostEnemy.width >= this.canvas.width) {
          this.currentDirection = MovingDirection.downLeft;
          break;
        }
      } else if (this.currentDirection === MovingDirection.downLeft) {
        if (this.moveDown(MovingDirection.left)) {
          break;
        }
      } else if (this.currentDirection === MovingDirection.left) {
        this.xVelocity = -this.defaultXVelocity;
        this.yVelocity = 0;
        const leftMostEnemy = enemyRow[0];
        if (leftMostEnemy.x && leftMostEnemy.x <= 0) {
          this.currentDirection = MovingDirection.downRight;
          break;
        }
      } else if (this.currentDirection === MovingDirection.downRight) {
        if (this.moveDown(MovingDirection.right)) {
          break;
        }
      }
    }
  }

  moveDown(newDirection) {
    this.xVelocity = 0;
    this.yVelocity = this.defaultYVelocity;
    if (this.moveDownTimer <= 0) {
      this.currentDirection = newDirection;
      return true;
    }
    return false;
  }

  drawEnemies(ctx) {
    this.enemyRows.flat().forEach((enemy) => {
      enemy.move(this.xVelocity, this.yVelocity);
      enemy.draw(ctx);
    });
  }

  createEnemies() {
    this.enemyMap.forEach((row, rowIndex) => {
      this.enemyRows[rowIndex] = [];
      row.forEach((enemyNumber, enemyIndex) => {
        if (enemyNumber > 0) {
          this.enemyRows[rowIndex].push(
            new Enemy(
              enemyIndex * enemyWidth * widthRatio,
              rowIndex * enemyHeight * heightRatio,
              enemyNumber,
              enemyWidth,
              enemyHeight,
            ),
          );
        }
      });
    });
  }

  collideWith(sprite) {
    return this.enemyRows.flat().some((enemy) => enemy.collideWith(sprite));
  }
}
