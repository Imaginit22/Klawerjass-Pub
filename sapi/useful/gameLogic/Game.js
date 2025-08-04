const { deepStrictEqual } = require('assert');
const fs = require('fs');
const { setDefaultAutoSelectFamily } = require('net');
const { send } = require('process');
const cardValues = new Map([
    ["A", 14],
    ["K", 13],
    ["Q", 12],
    ["J", 11],
    ["T", 10]
]);
function sortHands(playerHand, imap = cardValues, giveCount = false) {
    const suitCards = [,,,,]
    
    function findCard(key, map = imap) {
        let temp = map.get(key);
        if (temp == undefined) {
            return key;
        } else {
            return temp;
        }
    }
    let handLength = playerHand.length;
    let whereToSend = [];
    let wilburt = [];
    let suitOrder = ["S", "H", "C", "D"];
    //repeat 4 times, 1 for each suit
    for (let i = 0; i < 4; i++) {
        //repeats 9 times, to go over the whole array. Pushes array to wilburt.
        for (let j = 0; j < handLength; j++) {
            if (playerHand[j][1] == suitOrder[i]) {
                wilburt.push(playerHand[j]);
            }
        }
        suitCards[i] = wilburt
        //recursion!!! sorts.
        for (let j = 0; j < wilburt.length - 1; j++) {
            function SwitchThings(iterator) {
                if (findCard(wilburt[iterator+1][0]) > findCard(wilburt[iterator][0]) ) {
                    let temp = wilburt[iterator];
                    wilburt[iterator] = wilburt[iterator+1];
                    wilburt[iterator+1] = temp;
                    if (iterator > 0) {
                        iterator--;
                    }
                    SwitchThings(iterator);
                }
            }
            SwitchThings(j);
        }
        //pushes final result to wheretosend
        for (let j = 0; j < wilburt.length; j++) {
            whereToSend.push(wilburt[j])
        }
        wilburt = [];
    }
    //fills hand out with backs of cards.
    for (let i = 0; i < handLength - playerHand.length; i++) {
        whereToSend.push("B");
    }
    if (giveCount) {
        return [whereToSend, suitCards]
    } else {
        return whereToSend;
    }
}
/*
Game class
Represents a two player game of klawerjass

Parameters:
user1: one of two users. DEFAULT VALUE SHOULD BE REMOVED EVENTUALLY
user2: second of two users, ^^

Constructor:
builds everything that the game might need.
*/


class Game {
    constructor() {
        let fullDeck = ["B", "7C", "7D", "7H", "7S", "8C", "8D", "8H", "8S", "9C", "9D", "9H", "9S", "JC", "JD", "JH", "JS", "QC", "QD", "QH", "QS", "KC", "KD", "KH", "KS", "TC", "TD", "TH", "TS", "AC", "AD", "AH", "AS"];
        let deckLength = fullDeck.length;
        function rand(lowest = 1, highest = deckLength - 1) {
            deckLength--;
            return Math.floor(Math.random() * highest) + lowest;
        }
        console.log("BeginningGame");
        this.data1 = {
            hand: [],
            reserve: [],
            
        }
        //hand of p1
        this.hand1 = [];
        //3 extra cards of p1
        this.reserve1 = [];
        //hand of p2
        this.hand2 = [];
        //3 extra cards of p2
        this.reserve2 = [];
        //card flipped up to help determine trumps
        this.trumpDecider;
        //trumpsuit
        this.trumps;
        //pile of cards
        this.winnings1;
        this.winnings2;
        //what is played by each player
        this.currentPlayed1;
        this.currentPlayed2;
        /*where in dealing we are.
        0: non-dealer can decide to take trumpdecider
        1: dealer can decide to take trumpdecider
        2: non-dealer can decide to take any suit
        3: dealer must decide to take a suit
        */
        this.dealPhase = 0;
        //sender is dealer?
        this.senDealer;
        this.points;
        for (let i = 0; i < 6; i++) {
            let randNum = rand();
            this.hand1.push(fullDeck[randNum]);
            fullDeck.splice(randNum, 1);
            console.log("DECKLENGTH:" + deckLength)
            randNum = rand();
            this.hand2.push(fullDeck[randNum]);
            fullDeck.splice(randNum, 1);
        }
        for (let i = 0; i < 3; i++) {
            let randNum = rand();
            this.reserve1.push(fullDeck[randNum]);
            fullDeck.splice(randNum, 1);
            console.log("DECKLENGTH:" + deckLength)
            randNum = rand();
            this.reserve2.push(fullDeck[randNum]);
            fullDeck.splice(randNum, 1);
        }
        let randNum = rand();
        this.trumpDecider = (fullDeck[randNum]);
        fullDeck.splice(randNum);
        console.log(this.hand1, this.hand2);

        //BEGIN SORT SECTION
        
        /*
        makeEverythingEver

        sorts the hands
        */
        this.hand1 = sortHands(this.hand1);
        this.hand2 = sortHands(this.hand2);
        console.log("yay ", this.hand1);
        console.log("whee", this.hand2);   
        
    }
}
module.exports = {Game, sortHands};