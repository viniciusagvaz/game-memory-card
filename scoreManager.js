export class ScoreManager {
  constructor() {
    this.score = 0;
    this.scoreDisplay = document.querySelector('#result');
  }

  incrementScore() {
    this.score += 1;
    this.updateDisplay();
  }

  updateDisplay() {
    this.scoreDisplay.textContent = this.score;
  }

  getScore() {
    return this.score;
  }

  resetScore() {
    this.score = 0;
    this.updateDisplay();
  }
} 