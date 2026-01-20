const enemyImage = new Image();
enemyImage.src = "Assets/alien.png";

class Enemy {
  constructor(x, y, speed, curve) {
    this.width = 60;
    this.height = 60;
    this.x = x;
    this.y = y;
    this.speed = speed;
    this.curve = curve;
    this.markedForDeletion = false;
  }

  // phase 1 : simple
  static createLevel1(canvasWidth) {
    const x = Math.random() * (canvasWidth - 50);
    return new Enemy(x, -50, 2, 0);
  }

  // phase 2: zigzag
  static createLevel2(canvasWidth) {
    const x = Math.random() * (canvasWidth - 50);
    return new Enemy(x, -50, 3, 4);
  }

  // phase 3: array of enemies
  static createLevel3(canvasWidth) {
    const x = Math.random() * (canvasWidth - 50);
    const tempArray = [];
    for (let i = 0; i < 5; i++) {
      tempArray.push(new Enemy(x, -70 * i, 2.5, 2));
    }
    return tempArray;
  }

  update() {
    this.y += this.speed;
    this.x += Math.sin(this.y * 0.02) * this.curve;
    if (this.y > 800) this.markedForDeletion = true;
  }

  draw(ctx) {
    if (enemyImage.complete) {
      ctx.drawImage(enemyImage, this.x, this.y, this.width, this.height);
    } else {
      ctx.fillStyle = "green";
      ctx.fillRect(this.x, this.y, this.width, this.height);
    }
  }
}
