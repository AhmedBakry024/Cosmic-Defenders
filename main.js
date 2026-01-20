

document.addEventListener('DOMContentLoaded', () => {
    
    console.log("Cosmic Defenders UI Initialized.");

    
});



window.addEventListener('game-start', () => {
    console.log("UI Event Received: game-start");
    
});

window.addEventListener('game-restart', () => {
    console.log("UI Event Received: game-restart");
    
});



window.GameUI = {
    updateScore: (score) => UI.updateScore(score),
    updateHP: (hp) => UI.updateHealth(hp),
    updateWave: (wave) => UI.updateWave(wave),
    showGameOver: (score) => UI.showGameOverScreen(score),
    showVictory: (score) => UI.showVictoryScreen(score)
};

// to test player and bullet feature
/*
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const player = new Player(canvas);
function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height); 
    player.update();
    player.draw(ctx);
    requestAnimationFrame(animate);
}
animate();
*/