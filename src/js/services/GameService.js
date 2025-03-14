import { Card } from "../components/Card.js";
import { shuffleArray } from "../utils/shuffleArray.js";

export class GameService {
  constructor(scoreService) {
    this.scoreService = scoreService;
    this.cards = [];
    this.selectedCards = [];
    this.matchedPairs = 0;
  }

  async initializeGame() {
    const cards = await this.loadCards();
    this.setupGame(cards);
  }

  async loadCards() {
    try {
      const response = await fetch("./cards.json");
      const data = await response.json();
      return data.cards;
    } catch (error) {
      console.error("Failed to load cards:", error);
      return [];
    }
  }

  setupGame(cards) {
    const duplicatedCards = [...cards, ...cards];
    this.cards = shuffleArray(duplicatedCards).map(
      (card, index) => new Card({ ...card, id: index })
    );
  }

  handleCardSelection(card) {
    if (this.canSelectCard(card)) {
      this.selectCard(card);

      if (this.selectedCards.length === 2) {
        this.evaluateMatch();
      }
    }
  }

  canSelectCard(card) {
    return (
      !card.isMatched &&
      !this.selectedCards.includes(card) &&
      this.selectedCards.length < 2
    );
  }

  evaluateMatch() {
    const [firstCard, secondCard] = this.selectedCards;

    if (firstCard.name === secondCard.name) {
      this.handleMatch();
    } else {
      this.handleMismatch();
    }
  }
}
