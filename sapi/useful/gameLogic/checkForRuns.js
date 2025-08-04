const findCard = require('./findCard')
const cards = require('./mapsVars/cardMaps')
const cardsIncrementing = cards.cardsIncrementing
const incrementingCards = cards.incrementingCards
const suits = require('./mapsVars/suits')

function checkForRuns (arrayToCheck) {
    console.log("A2C", arrayToCheck)
    let long3 = '1B'
    let long4 = '1B'
    for (let i = 0; i < 4; i++) {
        if (arrayToCheck[i].length > 2) {
        const arrCool = Array(8).fill(false)
        for (let j = 0; j < arrayToCheck[i].length; j++) {
            arrCool[findCard(arrayToCheck[i][j], cardsIncrementing)] = true
        }
        //This is recursive. 
        function isOneAhead(array, position) {
            //Base case
            if (position == array.length - 1) {
                return 1
            } else {
            //keep going while cool
                if (array[position] != false && array[position+1] != false) {
                    return isOneAhead(array, position + 1) + 1;
                } else {
            //!TODOD
                    return 1
                }
            }
        }
        console.log('arrCool', arrCool)
        //highest run of 3 and 4 by player 1. Negative if trumps
        for (let j = 0; j < arrCool.length; j++) {
            let currun = isOneAhead(arrCool, j);
            console.log(currun, "IOH")
            if (currun == 3 && findCard(long3[0], cardsIncrementing) <= findCard(j, cardsIncrementing)) {
            long3 = incrementingCards.get(j) + suits[i]
            } else if (currun > 3 && findCard(long4[0],cardsIncrementing) <= findCard(j, cardsIncrementing)) {
            long4 = incrementingCards.get(j) + suits[i]
            }
        }
        console.log('l3l4', long3, long4)
        }
    }
    if (long3 == '1B') {
        long3 = undefined
    }
    if (long4 == '1B') {
        long4 = undefined
    }
    return [long3, long4]
}
module.exports = checkForRuns