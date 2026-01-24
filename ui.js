const UI = {

    scoreVal: null,
    waveVal: null,
    hpBar: null,
    highScoreVal: null,
    finalScore: null,
    victoryScore: null,
    hud: null,

    startScreen: null,
    gameOverScreen: null,
    victoryScreen: null,

    startBtn: null,
    restartBtn: null,
    victoryRestartBtn: null,

    init: function () {
        console.log("UI Initialized");

        this.scoreVal = document.getElementById('scoreVal');
        this.waveVal = document.getElementById('waveVal');
        this.hpBar = document.getElementById('hpBar');
        this.highScoreVal = document.getElementById('highScoreVal');
        this.finalScore = document.getElementById('finalScore');
        this.victoryScore = document.getElementById('victoryScore');
        this.hud = document.querySelector('.hud');

        this.startScreen = document.getElementById('startScreen');
        this.gameOverScreen = document.getElementById('gameOverScreen');
        this.victoryScreen = document.getElementById('victoryScreen');

        this.startBtn = document.getElementById('startBtn');
        this.restartBtn = document.getElementById('restartBtn');
        this.victoryRestartBtn = document.getElementById('victoryRestartBtn');

        this.bindEvents();
        this.updateHighScoreDisplay();
        this.hideHUD(); // Hide HUD initially
    },

    bindEvents: function () {
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

    updateScore: function (score) {
        this.scoreVal.innerText = score;
    },

    updateWave: function (wave) {
        this.waveVal.innerText = wave;
    },

    updateHealth: function (hpPercent) {

        this.hpBar.style.width = hpPercent + "%";
    },

    showHUD: function () {
        this.hud.classList.add('visible');
        this.hud.style.opacity = '1';
        this.hud.style.visibility = 'visible';
        console.log("HUD Forced Visible");
    },

    hideHUD: function () {
        this.hud.classList.remove('visible');
        this.hud.style.opacity = '0';
        this.hud.style.visibility = 'hidden';
    },

    showStartScreen: function () {
        this.hideHUD();
        this.showScreen(this.startScreen);
        this.updateHighScoreDisplay();
    },

    showGameOverScreen: function (finalScore) {
        this.hideHUD();
        this.finalScore.innerText = finalScore;
        this.saveHighScore(finalScore);
        this.showScreen(this.gameOverScreen);
    },

    showVictoryScreen: function (finalScore) {
        this.hideHUD();
        this.victoryScore.innerText = finalScore;
        this.saveHighScore(finalScore);
        this.showScreen(this.victoryScreen);
    },

    showScreen: function (screenElement) {

        this.hideAllScreens();

        screenElement.classList.add('active');
        screenElement.style.visibility = 'visible';
        screenElement.style.opacity = '1';
    },

    hideAllScreens: function () {
        const screens = document.querySelectorAll('.screen');
        screens.forEach(s => {
            s.classList.remove('active');
            s.style.visibility = 'hidden';
            s.style.opacity = '0';
        });
    },


    saveHighScore: function (score) {
        const currentHigh = this.getHighScore();
        if (score > currentHigh) {
            localStorage.setItem('cosmicDefendersHighScore', score);
        }
    },

    getHighScore: function () {
        return parseInt(localStorage.getItem('cosmicDefendersHighScore')) || 0;
    },

    updateHighScoreDisplay: function () {
        this.highScoreVal.innerText = this.getHighScore();
    }
};


if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => UI.init());
} else {
    UI.init();
}
