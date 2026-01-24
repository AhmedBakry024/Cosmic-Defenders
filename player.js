const bulletImage = new Image();
bulletImage.src = "Assets/bullet.png";
const bulletSound = new Audio('Assets/shot.mp3');
bulletSound.volume = 0.2;

class Bullet {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = 30;
        this.height = 30;
        this.speed = 4;
        this.markedForDeletion = false;
        this.image = bulletImage;
    }

    update() {
        this.y -= this.speed;
        if (this.y < 0) this.markedForDeletion = true; 
    }

    draw(ctx) {
        if (this.image.complete) ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
    }
}

class Player {
    constructor(gameCanvas) {
        this.canvas = gameCanvas;
        this.width = 128;
        this.height = 128;
        this.maxHp = 90;
        this.hp = this.maxHp;
        this.x = this.canvas.width / 2 - this.width / 2;
        this.y = this.canvas.height - 150;
        this.speed = 6;
        this.image = new Image();
        this.image.src = "Assets/ship.png"; 
        this.earthImage = new Image();
        this.earthImage.src = "Assets/earth.png"; 
        this.earthHeight = 100;
        this.keys = {
            left: false,
            right: false,
            shoot: false
        };
        this.bullets = [];
        this.shootTimer = 0;    
        this.shootInterval = 30;
        this.edgeOffset = 20;
        this.addEventListeners();
    }

    addEventListeners() {
        window.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') this.keys.left = true;
            if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') this.keys.right = true;
            if (e.key === ' ' || e.code === 'Space') this.keys.shoot = true;
        });
        window.addEventListener('keyup', (e) => {
            if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') this.keys.left = false;
            if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') this.keys.right = false;
            if (e.key === ' ' || e.code === 'Space') this.keys.shoot = false;
        });
    }

    shoot() {
        if (this.shootTimer === 0) {
            const bulletWidth = 30; 
            const bulletX = (this.x + (this.width / 2)) - (bulletWidth / 2);
            const bulletY = this.y;
            this.bullets.push(new Bullet(bulletX, bulletY));
            this.shootTimer = this.shootInterval;

            bulletSound.currentTime = 0;
            bulletSound.play().catch(() => {});
        }
    }

    // Damaging
    takeDamage() {
        this.hp -= 30;
        if (this.hp < 0) this.hp = 0;
    }

    reset() {
        this.hp = this.maxHp;
        this.x = this.canvas.width / 2 - this.width / 2;
        this.bullets = []; 
        this.keys.shoot = false;
        this.keys.left = false;
        this.keys.right = false;
    }

    update() {
        if (this.keys.left) this.x -= this.speed;
        if (this.keys.right) this.x += this.speed;

        if (this.keys.shoot) this.shoot();
        if (this.shootTimer > 0) this.shootTimer--;

        if (this.x < -this.edgeOffset) this.x = -this.edgeOffset;
        
        if (this.x > this.canvas.width - this.width + this.edgeOffset) {
            this.x = this.canvas.width - this.width + this.edgeOffset;
        }

        this.bullets.forEach(bullet => bullet.update());
        this.bullets = this.bullets.filter(bullet => !bullet.markedForDeletion);
    }

    draw(ctx) {
        if (this.earthImage.complete) {
            ctx.drawImage(
                this.earthImage, 
                0,
                this.canvas.height - this.earthHeight,
                this.canvas.width, 
                this.earthHeight 
            );
        }
        if (this.image.complete) {
            ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
        }
        this.bullets.forEach(bullet => bullet.draw(ctx));
    }
}