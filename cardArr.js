const cardArray = fetch('./cards.json')
  .then(response => response.json())
  .then(data => data.cards)
  .catch(error => console.error('Error loading cards:', error));
