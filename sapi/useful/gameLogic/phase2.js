function phase2() {
    console.log("HHHHHHHHHYH", body)
    if (data.played && data.trick < 9) {
        console.log(data.trick, "DATATRICK")
        if (isPlayer1 == (data.hand1.length > data.hand2.length)) {
            console.log('-----------------------------------------------------------------------------------------')
            let cont;
            if (data?.confruns != undefined) {
                let ptsToAdd
                if (data.confruns[1] == 4) {
                    ptsToAdd = 50
                } else if (data.confruns[1] == 3) {
                    ptsToAdd = 20
                }
                if (data.confruns[2] == true) {
                    data.p1tricks += ptsToAdd
                } else {
                    data.p2tricks += ptsToAdd
                }
            }
            if (isPlayer1 && data.hand1.includes(body.card) || !isPlayer1 && data.hand2.includes(body.card)) {
                data.trick++;
                let oppCard = findCardComp(data.played, data.trump, cardValues);
                let povCard = findCardComp(body.card, data.trump, cardValues);
                console.log('INSTOPPPOV:', oppCard, povCard)
                switch (data.canFollow) {
                case 0:
                    console.log('hinterlands')
                    if (body.card[1] == data.played[1]) {
                    cont = true
                    } else {
                    console.log("BAD IN 0")
                    }
                    break;
                case 1:
                    console.log('royal court')
                    if (body.card[1] == data.trump) {
                    cont = true 
                    povCard+=30
                    } else {
                    console.log("BAD IN 1")
                    }
                case 2: 
                    console.log('hell')
                    cont = true
                    povCard*=-1
                    povCard -= 30;
                }
                if (cont) {
                    console.log(data.p1Turn, "DP1T")
                    if (oppCard > povCard) {
                        povCard = Math.abs(povCard)
                        povCard %= 30
                        if (data.trick == 8) {
                            oppCard += 10
                        }
                        if (isPlayer1) {
                            //p1Lose(oppCard, povCard)
                            data.p1Turn = false;
                            data.p2tricks += lose(oppCard, povCard, body, data)
                        } else {
                            data.p1Turn = true;
                            data.p1tricks += lose(oppCard, povCard, body, data)
                        }  
                    } else {
                        console.log(data.p1Turn, "DP1T")
                        povCard = Math.abs(povCard)
                        povCard %= 30
                        if (data.trick == 8) {
                            povCard += 10
                        }
                        if (isPlayer1) {
                            //p2Lose(oppCard, povCard)
                            data.p1Turn = true;
                            data.p1tricks += lose(oppCard, povCard, body, data)
                        } else {
                            data.p1Turn = false;
                            data.p2tricks += lose(oppCard, povCard, body, data)
                        }
                        console.log('DP2T', data.p1Turn)
                    }
                }
                delete data.played
                if (data.trick == 9) {
                    specialUpdate = true
                }
            }
        }
    } else {
        function toggleTurns() {
            if (data.p1Turn) {
                data.p1Turn = false
            } else {
                data.p1Turn = true
            }
        }
        console.log(body.card)
        if (isPlayer1 && data.hand1.includes(body.card)) {
            data.canFollow = 0
            data.played = body.card
            const suitToFollow = data.played[1]
            console.log("STF", suitToFollow)
            let isSuit = (element) =>  element[1] == suitToFollow;
            const canFollow = data.hand2.some(isSuit)
            let canTrump
            if (!canFollow) {
                isSuit = (element) =>  element[1] == data.trump;
                canTrump = data.hand2.some(isSuit)
                data.canFollow++
                if (!canTrump) {
                data.canFollow++
                }
            }
            toggleTurns()
            data.hand1.splice(data.hand1.indexOf(body.card), 1)
        } else if (!isPlayer1 && data.hand2.includes(body.card)) {
            data.canFollow = 0
            data.played = body.card
            const suitToFollow = data.played[1]
            console.log("STF", suitToFollow)
            let isSuit = (element) =>  element[1] == suitToFollow;
            const canFollow = data.hand1.some(isSuit)
            let canTrump
            if (!canFollow) {
                isSuit = (element) =>  element[1] == data.trump;
                canTrump = data.hand1.some(isSuit)
                data.canFollow++
                if (!canTrump) {
                data.canFollow++
                }
            }
            toggleTurns()
            data.hand2.splice(data.hand2.indexOf(body.card), 1)
        }
    }
    //!isp1 will break when password checking
    if (isPlayer1 && data.p1Turn) {
        console.log("It is player 1", players[0])
    } else if (!isPlayer1 && !data.p1Turn) {
        console.log("it is not player 1", players[1])
    }
    console.log("DATA< JUST TO CHECLK", data)
    if (specialUpdate) {
        newGame(game.rows[0].gameid, data.p1tricks, data.p2tricks, game.rows[0].senderid, game.rows[0].recipientid, data.dealPhase)
    } else {
        pool.query("UPDATE games SET gamedata = $1 WHERE gameid = $2", [data, game.rows[0].gameid])
    }
}