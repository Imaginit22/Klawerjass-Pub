const cardsIncrementing = new Map([
    ["A", 7],
    ["K", 6],
    ["Q", 5],
    ["J", 4],
    ["T", 3],
    ["9", 2],
    ["8", 1],
    ["7", 0]
]);
const incrementingCards = new Map([]);
for (const [key, value] of cardsIncrementing.entries()) {
    incrementingCards.set(value, key);
}
const cardValuesOrdering = new Map([
    ["A", 14],
    ["K", 13],
    ["Q", 12],
    ["J", 11],
    ["T", 10],
    ["9", 0],
    ["8", 0],
    ["7", 0]
]);
const cardValues = new Map([
    ["A", 11],
    ["K", 4],
    ["Q", 3],
    ["J", 2],
    ["T", 10],
    ["9", 0],
    ["8", 0],
    ["7", 0]
]);
module.exports = {cardsIncrementing, incrementingCards, cardValuesOrdering, cardValues}