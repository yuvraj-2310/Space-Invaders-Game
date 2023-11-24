import src1 from '../assets/images/enemy1.png';
import src2 from '../assets/images/enemy2.png';
import src3 from '../assets/images/enemy3.png';

export default class Enemy {
  constructor(x, y, imageNumber, width, height) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;

    this.image = new Image();
    if (imageNumber === 1) {
      this.image.src = src1;
    } else if (imageNumber === 2) {
      this.image.src = src2;
    } else if (imageNumber === 3) {
      this.image.src = src3;
    }
  }

  draw(ctx) {
    ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
  }

  move(xVelocity, yVelocity) {
    this.x += xVelocity;
    this.y += yVelocity;
  }

  collideWith(sprite) {
    if (
      this.x + this.width > sprite.x &&
      this.x < sprite.x + sprite.width &&
      this.y + this.height > sprite.y &&
      this.y < sprite.y + sprite.height
    ) {
      return true;
    } else {
      return false;
    }
  }
}
