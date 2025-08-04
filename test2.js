const findCard = require('./sapi/useful/gameLogic/findCard')
const suits = require('./sapi/useful/sharedStuff')
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
console.log(findCard("A", cardValuesOrdering))
console.log("suits", suits)