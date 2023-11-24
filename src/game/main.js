// for iOS
import space from '../assets/images/space2.png';
import soundSource from '../assets/sounds/shoot.wav';
import BulletController from './BulletController';
import EnemyController from './EnemyController';
import MovingDirection from './MovingDirection';
import Player from './Player';

export default function Game() {
  const canvas = document.querySelector('#game');
  const endGame = document.querySelector('#endGame');
  const startButton = document.querySelector('#start');
  const restartButton = document.querySelector('#restart');
  const box = document.querySelector('.section__content');
  const ctx = canvas.getContext('2d');

  const leftArrow = document.querySelector('#leftArrow');
  const rightArrow = document.querySelector('#rightArrow');
  const fireButton = document.querySelector('#fireButton');
  const controls = document.querySelector('#controls');

  controls.style.display = 'none';

  const w = window,
    d = document,
    g = d.getElementsByTagName('body')[0],
    xx = w.innerWidth || g.clientWidth;

  let boxStyle = window.getComputedStyle(box, null);
  let boxWidth = boxStyle.getPropertyValue('width');
  let boxHeight = boxStyle.getPropertyValue('height');

  canvas.width = parseInt(boxWidth);
  canvas.height = parseInt(boxHeight);

  let playerWidth = 50;
  let playerHeight = 48;

  if (xx <= 1024) {
    playerWidth = playerWidth * 0.85;
    playerHeight = playerHeight * 0.85;
  }
  if (xx <= 768) {
    canvas.height = canvas.height * 0.76;
    controls.style.display = 'flex';
    startButton.style.top = `${
      parseInt(boxHeight) / 2 - (parseInt(boxHeight) - canvas.height) / 2
    }px`;
    restartButton.style.top = `${
      parseInt(boxHeight) / 2 - (parseInt(boxHeight) - canvas.height) / 3.2
    }px`;
    endGame.style.top = `${
      parseInt(boxHeight) / 2 - (parseInt(boxHeight) - canvas.height) / 1.4
    }px`;
  }
  if (xx <= 600) {
    playerWidth = playerWidth * 0.7;
    playerHeight = playerHeight * 0.7;
  }
  if (xx <= 400) {
    playerWidth = playerWidth * 0.7;
    playerHeight = playerHeight * 0.7;
  }
  if (xx <= 360) {
    controls.style.bottom = '15px';
    startButton.style.top = `${
      parseInt(boxHeight) / 2 - (parseInt(boxHeight) - canvas.height) / 2.2
    }px`;
    restartButton.style.top = `${
      parseInt(boxHeight) / 2 - (parseInt(boxHeight) - canvas.height) / 3.2
    }px`;
    endGame.style.top = `${
      parseInt(boxHeight) / 2 - (parseInt(boxHeight) - canvas.height) / 1.4
    }px`;
  }

  const background = new Image();
  background.src = space;

  background.onload = function () {
    scaleToFill(this);
  };

  function scaleToFill(img) {
    // get the scale
    let scale = Math.max(canvas.width / img.width, canvas.height / img.height);
    // get the top left position of the image
    let x = canvas.width / 2 - (img.width / 2) * scale;
    let y = canvas.height / 2 - (img.height / 2) * scale;
    ctx.drawImage(img, x, y, img.width * scale, img.height * scale);
  }

  const playerBulletController = new BulletController(canvas, 20, 'lime', true);
  const player = new Player(
    canvas,
    4,
    playerBulletController,
    playerWidth,
    playerHeight,
    leftArrow,
    rightArrow,
    fireButton,
  );
  const enemyBulletController = new BulletController(canvas, 4, 'red', false);
  const enemyController = new EnemyController(
    canvas,
    enemyBulletController,
    playerBulletController,
  );

  let isGameOver = false;
  let didWin = false;
  let gameStart = 0;

  function game() {
    scaleToFill(background);
    checkGameOver();
    displayGameOver();

    if (!isGameOver) {
      enemyController.draw(ctx);
      player.draw(ctx);
      playerBulletController.draw(ctx);
      enemyBulletController.draw(ctx);
    }
  }

  function displayGameOver() {
    if (isGameOver) {
      clearInterval(gameStart);
      restartButton.style.display = 'block';
      endGame.style.display = 'block';
      endGame.textContent = didWin ? 'YOU WIN!' : 'GAME OVER';
    }
  }

  function checkGameOver() {
    if (isGameOver) {
      return;
    }
    if (enemyBulletController.collideWith(player)) {
      player.deathSound.currentTime = 0;
      player.deathSound.play();
      isGameOver = true;
    }
    if (enemyController.collideWith(player)) {
      player.deathSound.currentTime = 0;
      player.deathSound.play();
      isGameOver = true;
    }
    if (enemyController.enemyRows.length === 0) {
      didWin = true;
      isGameOver = true;
    }
  }

  /* 	// for iOS
	const sound = new Audio(soundSource);
	sound.volume = 0.5;
	const startSound = function () {
		startButton.removeEventListener('click', startSound);
		restartButton.removeEventListener('click', startSound);
		sound.currentTime = 0;
		sound.play();
	};
	// let isIOS = /iPad|iPhone|iPod/.test(navigator.platform);
	// if (isIOS) startButton.addEventListener('click', startSound); */

  startButton.addEventListener('click', function () {
    startButton.style.display = 'none';
    isGameOver = false;
    didWin = false;

    StartAnimation();
    // startSound();
  });

  restartButton.addEventListener('click', function () {
    restartButton.style.display = 'none';
    endGame.style.display = 'none';
    isGameOver = false;
    didWin = false;

    ResetCanvas();
    StopAnimation();
    StartAnimation();
    // startSound();
  });

  function ResetCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    player.x = canvas.width / 2 - playerWidth / 2;
    player.y = canvas.height - player.width * 2;
    if (player.y <= canvas.height - 75) {
      player.y = canvas.height - 75;
    }

    enemyController.createEnemies();
    enemyController.currentDirection = MovingDirection.right;

    enemyBulletController.bullets = [];
    enemyBulletController.timeTillNextBulletAllowed = 0;

    playerBulletController.bullets = [];
    playerBulletController.timeTillNextBulletAllowed = 0;
  }

  function StartAnimation() {
    gameStart = setInterval(game, 1000 / 60);
  }

  function StopAnimation() {
    clearInterval(gameStart);
  }
}
