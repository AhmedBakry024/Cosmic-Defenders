class Star {
    constructor(canvasWidth, canvasHeight) {
        this.canvasWidth = canvasWidth;
        this.canvasHeight = canvasHeight;
        this.reset();
    }

    reset() {
        this.x = Math.random() * this.canvasWidth;
        this.y = Math.random() * this.canvasHeight;
        this.size = Math.random() * 2 + 0.5; 
        this.speed = Math.random() * 0.5 + 0.2; 
        
        this.speed = this.size * 0.5;
        this.brightness = Math.random();
    }

    update() {
        this.y += this.speed;

        // If star moves off screen, reset it to the top
        if (this.y > this.canvasHeight) {
            this.y = 0;
            this.x = Math.random() * this.canvasWidth;
        }
    }

    draw(ctx) {
        ctx.fillStyle = `rgba(255, 255, 255, ${this.brightness})`;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
}

class Background {
    constructor(canvas, count = 100) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.stars = [];
        this.count = count;

        this.init();
    }

    init() {
        
        this.stars = [];
        for (let i = 0; i < this.count; i++) {
            this.stars.push(new Star(this.canvas.width, this.canvas.height));
        }
    }

    update() {
        this.stars.forEach(star => star.update());
    }

    draw() {
       
        this.ctx.fillStyle = '#050510'; 
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        this.stars.forEach(star => star.draw(this.ctx));
    }

    animate() {
        this.update();
        this.draw();
        requestAnimationFrame(() => this.animate());
    }
}


window.Background = Background;
