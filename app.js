import {
  checkForMatch,
  createCardElement,
  flipCard,
  shuffleCards,
} from "./gameLogic.js";
import { ScoreManager } from "./scoreManager.js";

let cardArray = [];
let cardsChosen = [];
let cardsChosenIds = [];
const scoreManager = new ScoreManager();
const playAgainBtn = document.querySelector("#play-again");

async function loadCards() {
  try {
    const response = await fetch("./cards.json");
    const data = await response.json();
    createReferenceGrid(data.cards);
    cardArray = [...data.cards, ...data.cards];
    cardArray = shuffleCards(cardArray);
    playAgainBtn.disabled = true;
    initializeGame();
  } catch (error) {
    console.error("Error loading cards:", error);
  }
}

function createReferenceGrid(cards) {
  const referenceGrid = document.querySelector("#reference-grid");
  cards.forEach((card) => {
    const referenceCard = document.createElement("div");
    referenceCard.classList.add("reference-card");
    referenceCard.setAttribute("data-reference", card.name);

    const cardImage = document.createElement("img");
    cardImage.setAttribute("src", card.img);
    cardImage.setAttribute("alt", card.name);

    referenceCard.appendChild(cardImage);
    referenceGrid.appendChild(referenceCard);
  });
}

function markReferenceAsMatched(cardName) {
  const referenceCard = document.querySelector(
    `[data-reference="${cardName}"]`
  );
  if (referenceCard) {
    referenceCard.classList.add("matched");
  }
}

function initializeGame() {
  const gridDisplay = document.querySelector("#grid");
  gridDisplay.innerHTML = "";
  scoreManager.resetScore();

  cardArray.forEach((card, index) => {
    const cardElement = createCardElement({ ...card, id: index });
    cardElement.addEventListener("click", handleCardClick);
    cardElement.addEventListener("touchstart", handleCardClick, { passive: false });
    gridDisplay.appendChild(cardElement);
  });
}

function handleCardClick(event) {
  event.preventDefault();
  
  const card = event.target.closest('.card');
  if (!card || cardsChosenIds.includes(card.getAttribute("data-id")) || cardsChosen.length >= 2) return;

  const cardId = card.getAttribute("data-id");
  flipCard(card);
  cardsChosen.push(card);
  cardsChosenIds.push(cardId);

  if (cardsChosen.length === 2) {
    setTimeout(evaluateMatch, 500);
  }
}

function resetGame() {
  const referenceGrid = document.querySelector("#reference-grid");
  referenceGrid.innerHTML = "";

  const gridDisplay = document.querySelector("#grid");
  gridDisplay.innerHTML = "";

  scoreManager.resetScore();

  cardsChosen = [];
  cardsChosenIds = [];

  playAgainBtn.disabled = true;

  const victoryMessage = document.querySelector("#victory-message");
  victoryMessage.classList.add("hidden");
  victoryMessage.classList.remove("show");

  loadCards();
}

function evaluateMatch() {
  if (checkForMatch(cardsChosen[0], cardsChosen[1])) {
    const cardName = cardsChosen[0].getAttribute("name");
    cardsChosen.forEach((card) => {
      card.removeEventListener("click", handleCardClick);
      card.removeEventListener("touchstart", handleCardClick);
      card.setAttribute("matched", "true");
    });
    markReferenceAsMatched(cardName);
    scoreManager.incrementScore();
  } else {
    cardsChosen.forEach((card) => {
      setTimeout(() => flipCard(card), 500);
    });
  }

  cardsChosen = [];
  cardsChosenIds = [];

  if (
    document.querySelectorAll('[matched="true"]').length === cardArray.length
  ) {
    setTimeout(() => {
      playAgainBtn.disabled = false;
      const victoryMessage = document.querySelector("#victory-message");
      victoryMessage.classList.remove("hidden");
      setTimeout(() => {
        victoryMessage.classList.add("show");
      }, 10);
    }, 500);
  }
}

playAgainBtn.addEventListener("click", resetGame);

document.addEventListener("DOMContentLoaded", loadCards);
