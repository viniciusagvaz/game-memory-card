export class EventManager {
  constructor(gameService) {
    this.gameService = gameService;
    this.setupEventListeners();
  }

  setupEventListeners() {
    document
      .querySelector("#grid")
      .addEventListener("click", this.handleCardClick.bind(this));
    document
      .querySelector("#play-again")
      .addEventListener("click", this.handlePlayAgain.bind(this));
  }

  handleCardClick(event) {
    const card = event.target.closest(".card");
    if (card) {
      this.gameService.handleCardSelection(card);
    }
  }

  handlePlayAgain() {
    this.gameService.resetGame();
  }
}
