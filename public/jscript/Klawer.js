let c = document.getElementById("playKlawerjass");
let image = c.getContext("2d");
const BG = document.getElementById("BG");
const svgnames = ["B", "7C", "7D", "7H", "7S", "8C", "8D", "8H", "8S", "9C", "9D", "9H", "9S", "JC", "JD", "JH", "JS", "QC", "QD", "QH", "QS", "KC", "KD", "KH", "KS", "TC", "TD", "TH", "TS", "AC", "AD", "AH", "AS"];
const svgsnotimgs = [...svgnames];
//Define cards
for (i = 0; i < svgnames.length; i++) {
    //svgsnotimgs.push(document.getElementById(svgnames[i]));
    svgnames[i] = (document.getElementById(svgnames[i]));
}
c.width = window.innerWidth * 1;
c.height = window.innerHeight * 1;
handSpacing = c.width/9;
sizeSizer = handSpacing/svgnames[0].width;
handHeight = c.height - (svgnames[0].height * sizeSizer);
const actionCards = []; 
const handCards = [];
let submitCard; 
let whichPlayed;
let possibleClicks = [];
let finalDeck = [];
// Class for a Card


class Card {
    constructor(img, x, y, cardSize, play = false) {
        this.img = img;
        this.x = x;
        this.y = y;
        this.cardSize = cardSize;
        this.play = play;
    }
    //Make a card with top left corner at x, y. Size is accepted as a decimal between 0 and 1 for smaller, above for larger
    //if whichplayed is this, then put in middle
    makeCard() {
        if (whichPlayed !== this) {
            image.drawImage(this.img, this.x, this.y*.95, this.cardSize*this.img.width, this.cardSize*this.img.height);
        } else {
            image.drawImage(this.img, (c.width/2 - ((this.img.width * this.cardSize)/2)), (this.y = c.height/2 - (this.img.height * this.cardSize)/2), this.cardSize*this.img.width, this.cardSize*this.img.height);
        }
    }
    playCard() {
        whichPlayed = this;
    }
}

//this should be a thing already
function rand(lowest = 1, highest = svgnames.length-1) {
    return Math.floor(Math.random() * highest) + lowest;
}

//Clears the Canvas, probably call every time anything happens, so no parameters
function clearCanvas() {
    image.clearRect(0,0,window.innerWidth,window.innerHeight);
}

//Reprints everything
function refresh() {
    clearCanvas();
    image.drawImage(BG, 0, 0, c.width, c.height);
    for(let i = 0; i < handCards.length; i++) {
        handCards[i].makeCard();
    }
}

//Rewrite everything on window resize
function resizeThings() {
    c.width = window.innerWidth*.9;
    c.height = window.innerHeight*.8;
    handSpacing = c.width/9;
    sizeSizer = handSpacing/svgnames[0].width;
    handHeight = c.height - (svgnames[0].height * sizeSizer)
    for (let i = 0; i < handCards.length; i++) {
        handCards[i].x = handSpacing * i;
        handCards[i].y = handHeight;
        handCards[i].cardSize = sizeSizer;
    }
    refresh();
}



//grab Gamestate **INDEV**
async function scope() {
    let hand; 
    let urlPlay = new URL(window.location.href)
    urlToSend = urlPlay.pathname.substring(1) + urlPlay.search;
    console.log("WHREF: ", urlToSend)
    fetch('/grabCards' + urlPlay.search, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(
            {
                password: window.localStorage.getItem('password'), 
            })
    })
    .then(response => response.json())
    .then(data => {
        console.log('Server responsegrab:', data);
        hand = data;
        console.log(hand)
        const playerHand = JSON.parse(hand);
        console.log("PH0", playerHand[0])
        //cardNames = ['card1', 'card2', 'card3', 'card4', 'card5', 'card6', 'card7', 'card8', 'card9'];
        function indexOfCard(num, referenceimgArray = svgnames, referencestringArray = svgsnotimgs, jsonArray = playerHand) {
            //find a way to make.card changeable, too lazy for now
            return referenceimgArray[referencestringArray.indexOf(jsonArray[num])]
        }
        for (let i = 0; i < playerHand.length; i++) {
            const card = new Card(indexOfCard(i), handSpacing * i, handHeight, sizeSizer);
            handCards.push(card);
        }
        for (let i = playerHand.length; i < 9; i++) {
            const card = new Card (svgnames[0], handSpacing * i, handHeight, sizeSizer)
            handCards.push(card)
        }
        resizeThings();
    })
    .catch(error => {
    console.error('Error uploading JSON:', error);
    });
}
scope();

//this is how we send things.
function sendThings() {
    const sendHand = [window.localStorage.getItem('email')]
    /*for (i = 0; i < 9; i++) {
        sendHand.push(handCards[i].img.id);
    }*/
    sendHand.push(whichPlayed.img.id);
    // Make a POST request to the server to upload JSON data
    fetch('/processGame', {
        method: 'POST',
        headers: {
        'Content-Type': 'application/json',
        },
        body: JSON.stringify(sendHand),
    })
    .then(response => response.json())
    .then(data => {
      console.log('Server responseyayjdimo:', data);
    })
    .catch(error => {
      console.error('Error uploading JSON:', error);
    });
};

//Find what is clicked and "play" it
function play(event) {
    console.log(handCards)
    let position = c.getBoundingClientRect();
    let X = event.clientX - position.left;
    let Y = event.clientY - position.top;
    for (let i = 0; i < handCards.length; i++) {
        if (X >= handCards[i].x && (X <= (handCards[i].x + handCards[i].cardSize * handCards[i].img.width))) {
            if (handCards[i].img != document.getElementById("B"))
            possibleClicks.push(handCards[i]);
        }
    }
    for (let i = 0; i < possibleClicks.length; i++) {
        if (Y >= possibleClicks[i].y && (Y <= (possibleClicks[i].y + possibleClicks[i].cardSize * possibleClicks[i].img.height))) {
                possibleClicks[i].playCard();
                break;
        }
    }
    possibleClicks = [];
    resizeThings();
    refresh();
}