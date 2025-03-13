export function checkForMatch(cardOne, cardTwo) {
  return cardOne.getAttribute('name') === cardTwo.getAttribute('name');
}

export function createCardElement(card) {
  const cardElement = document.createElement('div');
  cardElement.classList.add('card');
  cardElement.setAttribute('data-id', card.id);
  cardElement.setAttribute('name', card.name);

  // Create front face
  const frontFace = document.createElement('div');
  frontFace.classList.add('card-front');

  // Create back face
  const backFace = document.createElement('div');
  backFace.classList.add('card-back');
  
  // Create image for back face
  const cardImage = document.createElement('img');
  cardImage.setAttribute('src', card.img);
  cardImage.setAttribute('alt', card.name);
  backFace.appendChild(cardImage);

  // Add faces to card
  cardElement.appendChild(frontFace);
  cardElement.appendChild(backFace);

  return cardElement;
}

export function flipCard(card) {
  card.classList.toggle('flipped');
}

export function shuffleCards(cards) {
  return [...cards].sort(() => 0.5 - Math.random());
} 