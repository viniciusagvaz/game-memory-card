import {
  checkForMatch,
  createCardElement,
  flipCard,
  shuffleCards,
} from "./gameLogic.js";
let cardArray = [];
let cardsChosen = [];
let cardsChosenIds = [];

async function loadCards() {
  try {
    const response = await fetch("./cards.json");
    const data = await response.json();

    createReferenceGrid(data.cards);
    cardArray = [...data.cards, ...data.cards];
    cardArray = shuffleCards(cardArray);
    initializeGame();
  } catch (error) {
    console.error("Error loading cards:", error);
  }
}

function createReferenceGrid(cards) {
  const referenceGrid = document.querySelector("#reference-grid");
  
  cards.forEach((card) => {
    const referenceCard = createReferenceCard(card);
    referenceGrid.appendChild(referenceCard);
  });
}

function createReferenceCard(card) {
  const referenceCard = document.createElement("div");
  referenceCard.classList.add("reference-card");
  referenceCard.setAttribute("data-reference", card.name);

  const cardImage = document.createElement("img");
  cardImage.setAttribute("src", card.img);
  cardImage.setAttribute("alt", card.name);

  referenceCard.appendChild(cardImage);
  return referenceCard;
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

  cardArray.forEach((card, index) => {
    const cardElement = createCardElement({ ...card, id: index });
    cardElement.addEventListener("click", handleCardClick);
    cardElement.addEventListener("touchstart", handleCardClick, {
      passive: false,
    });
    gridDisplay.appendChild(cardElement);
  });
}

function handleCardClick(event) {
  event.preventDefault();
  const card = event.target.closest(".card");

  if (
    !card ||
    cardsChosenIds.includes(card.getAttribute("data-id")) ||
    cardsChosen.length >= 2
  )
    return;

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
  const gridDisplay = document.querySelector("#grid");
  const subtitle = document.querySelector(".header__subtitle");
  const playAgain = document.querySelector(".play-again");
  const playAgainBtn = document.querySelector("#play-again-btn");

  if (referenceGrid) referenceGrid.innerHTML = "";
  if (gridDisplay) gridDisplay.innerHTML = "";
  
  cardsChosen = [];
  cardsChosenIds = [];

  if (subtitle) subtitle.textContent = "Find All Zodiac Sign Matches!";
  if (playAgain) playAgain.classList.remove("show");
  if (playAgainBtn) playAgainBtn.disabled = true;

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
      const victoryMessage = document.querySelector(".header__subtitle");
      const playAgain = document.querySelector(".play-again");
      const playAgainBtn = document.querySelector("#play-again-btn");

      console.log('caiu aqui');
      playAgain.classList.add("show");
      playAgainBtn.disabled = false;

      setTimeout(() => {
        victoryMessage.textContent = "You won! 🎉🎉🎉";
      }, 10);
    }, 500);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const playAgainBtn = document.querySelector("#play-again-btn");
  playAgainBtn.addEventListener("click", resetGame);
  loadCards();
});
