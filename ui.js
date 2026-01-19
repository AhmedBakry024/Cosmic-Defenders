const UI = {
    
    scoreVal: document.getElementById('scoreVal'),
    waveVal: document.getElementById('waveVal'),
    hpBar: document.getElementById('hpBar'),
    highScoreVal: document.getElementById('highScoreVal'),
    finalScore: document.getElementById('finalScore'),
    victoryScore: document.getElementById('victoryScore'),
    
    
    startScreen: document.getElementById('startScreen'),
    gameOverScreen: document.getElementById('gameOverScreen'),
    victoryScreen: document.getElementById('victoryScreen'),

    
    startBtn: document.getElementById('startBtn'),
    restartBtn: document.getElementById('restartBtn'),
    victoryRestartBtn: document.getElementById('victoryRestartBtn'),

    init: function() {
        console.log("UI Initialized");
        this.bindEvents();
        this.updateHighScoreDisplay();
    },

    bindEvents: function() {
        this.startBtn.addEventListener('click', () => {
            this.hideAllScreens();
            
            window.dispatchEvent(new CustomEvent('game-start')); 
        });

        this.restartBtn.addEventListener('click', () => {
            this.hideAllScreens();
            window.dispatchEvent(new CustomEvent('game-restart'));
        });

        this.victoryRestartBtn.addEventListener('click', () => {
            this.hideAllScreens();
            window.dispatchEvent(new CustomEvent('game-restart'));
        });
    },

    updateScore: function(score) {
        this.scoreVal.innerText = score;
    },

    updateWave: function(wave) {
        this.waveVal.innerText = wave;
    },

    updateHealth: function(hpPercent) {
        
        this.hpBar.style.width = hpPercent + "%";
    },

    showStartScreen: function() {
        this.showScreen(this.startScreen);
        this.updateHighScoreDisplay();
    },

    showGameOverScreen: function(finalScore) {
        this.finalScore.innerText = finalScore;
        this.saveHighScore(finalScore);
        this.showScreen(this.gameOverScreen);
    },

    showVictoryScreen: function(finalScore) {
        this.victoryScore.innerText = finalScore;
        this.saveHighScore(finalScore);
        this.showScreen(this.victoryScreen);
    },

    showScreen: function(screenElement) {
        
        this.hideAllScreens();
        
        screenElement.classList.add('active');
        screenElement.style.visibility = 'visible';
        screenElement.style.opacity = '1';
    },

    hideAllScreens: function() {
        const screens = document.querySelectorAll('.screen');
        screens.forEach(s => {
            s.classList.remove('active');
            s.style.visibility = 'hidden';
            s.style.opacity = '0';
        });
    },

    
    saveHighScore: function(score) {
        const currentHigh = this.getHighScore();
        if (score > currentHigh) {
            localStorage.setItem('cosmicDefendersHighScore', score);
        }
    },

    getHighScore: function() {
        return parseInt(localStorage.getItem('cosmicDefendersHighScore')) || 0;
    },

    updateHighScoreDisplay: function() {
        this.highScoreVal.innerText = this.getHighScore();
    }
};


if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => UI.init());
} else {
    UI.init();
}
