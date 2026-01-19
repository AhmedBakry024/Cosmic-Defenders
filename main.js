

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
