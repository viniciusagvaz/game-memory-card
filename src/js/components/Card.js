export class Card {
  constructor(cardData) {
    this.name = cardData.name;
    this.image = cardData.img;
    this.id = cardData.id;
    this.element = this.createElement();
  }

  createElement() {
    const card = document.createElement("div");
    card.classList.add("card");
    card.setAttribute("data-id", this.id);
    card.setAttribute("name", this.name);

    card.innerHTML = `
      <div class="card-front"></div>
      <div class="card-back">
        <img src="${this.image}" alt="${this.name}">
      </div>
    `;

    return card;
  }

  flip() {
    this.element.classList.toggle("flipped");
  }

  markAsMatched() {
    this.element.setAttribute("matched", "true");
  }
}
