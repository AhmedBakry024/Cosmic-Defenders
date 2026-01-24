const explosionSound = new Audio('Assets/Audio/boom.wav');
explosionSound.volume = 0.1;
const victorySound = new Audio('Assets/Audio/victory.mp3');
victorySound.volume = 0.3;

class Game {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.player = new Player(this.canvas);
        this.enemies = [];
        this.score = 0;
        this.wave = 1;
        this.maxWaves = 12;
        this.gameRunning = false;
        this.waveTimer = 0;
        this.waveInterval = 400;
        this.enemiesPerWave = 8;
        this.animationId = null;
        this.spawnQueue = []; 
        this.spawnDelay = 0; 
        this.spawnInterval = 60;
        this.uiUpdateCounter = 0;
        this.uiUpdateInterval = 5;
        
        this.init();
    }

    init() {
        window.addEventListener('game-start', () => this.start());
        window.addEventListener('game-restart', () => this.restart());
        
        UI.showStartScreen();
    }

    start() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
            this.animationId = null;
        }
        this.gameRunning = true;
        this.reset();
        UI.showHUD();
        this.animate();
    }

    restart() {
        this.start();
    }

    reset() {
        this.player.reset();
        this.enemies = [];
        this.score = 0;
        this.wave = 1;
        this.waveTimer = 0;
        this.spawnQueue = [];
        this.spawnDelay = 0;
        this.uiUpdateCounter = 0;
        UI.updateScore(this.score);
        UI.updateWave(this.wave);
        UI.updateHealth((this.player.hp / this.player.maxHp) * 100);
    }

    isPositionSafe(x, minDistance = 100) {
        return !this.enemies.some(enemy => 
            Math.abs(enemy.x - x) < minDistance && enemy.y < 100
        ) && !this.spawnQueue.some(enemyData => 
            Math.abs(enemyData.x - x) < minDistance
        );
    }

    getSafeSpawnPosition(enemyWidth) {
        const minDistance = 100;
        const margin = 50;
        let attempts = 0;
        let x;
        
        do {
            x = margin + Math.random() * (this.canvas.width - enemyWidth - margin * 2);
            attempts++;
            if (attempts > 10) break;
        } while (!this.isPositionSafe(x, minDistance));
        
        return x;
    }

    prepareWave() {
        UI.updateWave(this.wave);
        
        const numEnemies = Math.min(8, this.wave + 2);
        
        for (let i = 0; i < numEnemies; i++) {
            if (this.wave <= 3) {
                this.spawnQueue.push({ type: 'level1' });
            } else if (this.wave <= 8) {
                const type = Math.random() < 0.5 ? 'level1' : 'level2';
                this.spawnQueue.push({ type: type });
            } else {
                const type = Math.random() < 0.75 ? 'level1' : 'level3';
                this.spawnQueue.push({ type: type });
            }
        }

        this.wave++;
    }  
    

    spawnNextEnemy() {
        if (this.spawnQueue.length > 0 && this.spawnDelay === 0) {
            const enemyData = this.spawnQueue.shift();
            
            if (enemyData.type === 'level1') {
                const enemy = Enemy.createLevel1(this.canvas.width);
                this.enemies.push(enemy);
            } else if (enemyData.type === 'level2') {
                const enemy = Enemy.createLevel2(this.canvas.width);
                this.enemies.push(enemy);
            } else if (enemyData.type === 'level3') {
                const enemyArray = Enemy.createLevel3(this.canvas.width);
                this.enemies.push(...enemyArray);
            }
            
            this.spawnDelay = this.spawnInterval;
        }
    }

    checkCollision(rect1, rect2) {
        return rect1.x < rect2.x + rect2.width &&
               rect1.x + rect1.width > rect2.x &&
               rect1.y < rect2.y + rect2.height &&
               rect1.y + rect1.height > rect2.y;
    }

    handleCollisions() {
        for (let i = this.enemies.length - 1; i >= 0; i--) {
            const enemy = this.enemies[i];
            
            if (enemy.markedForDeletion) continue;
            
            for (let j = this.player.bullets.length - 1; j >= 0; j--) {
                const bullet = this.player.bullets[j];
                if (!bullet.markedForDeletion && this.checkCollision(bullet, enemy)) {
                    bullet.markedForDeletion = true;
                    enemy.markedForDeletion = true;
                    explosionSound.currentTime = 0;
                    explosionSound.play().catch(() => {});
                    this.score += 10;
                    break;
                }
            }
            
            if (enemy.markedForDeletion) continue;
            
            if (this.checkCollision(this.player, enemy)) {
                enemy.markedForDeletion = true;
                this.player.takeDamage();
            } else if (enemy.y + enemy.height >= this.canvas.height - this.player.earthHeight) {
                enemy.markedForDeletion = true;
                this.player.takeDamage();
            }
        }
    }

    updateGame() {
        this.player.update();

        this.enemies.forEach(enemy => enemy.update());
        this.enemies = this.enemies.filter(enemy => !enemy.markedForDeletion);

        this.handleCollisions();

        this.uiUpdateCounter++;
        if (this.uiUpdateCounter >= this.uiUpdateInterval) {
            UI.updateScore(this.score);
            UI.updateHealth((this.player.hp / this.player.maxHp) * 100);
            this.uiUpdateCounter = 0;
        }

        if (this.wave <= this.maxWaves) {
            if (this.waveTimer === 0 && this.spawnQueue.length === 0) {
                this.prepareWave();
                this.waveTimer = this.waveInterval;
            }
            
            if (this.waveTimer > 0) this.waveTimer--;
        }
        
        if (this.spawnDelay > 0) this.spawnDelay--;
        this.spawnNextEnemy();

        if (this.player.hp <= 0) {
            this.gameOver();
            return;
        }

        if (this.wave >= this.maxWaves) {
            if (this.enemies.length === 0 && this.spawnQueue.length === 0) {
                this.victory();
                return;
            }
        }
    }

    drawGame() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.player.draw(this.ctx);

        this.enemies.forEach(enemy => enemy.draw(this.ctx));
    }

    animate() {
        if (!this.gameRunning) return;

        this.updateGame();
        this.drawGame();

        this.animationId = requestAnimationFrame(() => this.animate());
    }

    gameOver() {
        this.gameRunning = false;
        const gameOverSound = new Audio('Assets/Audio/gameover.mp3');
        gameOverSound.volume = 0.3;
        gameOverSound.play();
        if (this.animationId) cancelAnimationFrame(this.animationId);
        UI.showGameOverScreen(this.score);
    }

    victory() {
        this.gameRunning = false;
        victorySound.currentTime = 0;
        victorySound.play().catch(() => {});
        if (this.animationId) cancelAnimationFrame(this.animationId);
        UI.showVictoryScreen(this.score);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const game = new Game();
    console.log("Cosmic Defenders Initialized!");
});
