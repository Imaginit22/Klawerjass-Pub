const { Pool } = require('pg');

const suits = require('./mapsVars/suits')
const {sortHands} = require('./Game')
const cardValuesOrdering = require('./mapsVars/cardMaps').cardValuesOrdering
const checkForRuns = require('./checkForRuns')
const findCard = require('./findCard')
console.log("SUITS", suits)
const pool = require('../sharedStuff').pool



async function phase1(req, game, isPlayer1) {
    body = req.body
    //unpack game
    console.log("GAME", game)
    console.log("ROWS", game)
    let data = JSON.parse(game.rows[0].gamedata)
    console.log("DATA", data)
    //boolean value to determine if the player is the sender
    //if all equal then it is this person's turn. Otherwise, they did evil API things.
    let modPhase = data.dealPhase % 2
    if (modPhase == isPlayer1 && game.rows[0].gamephase == 1) {
        console.log("The player is correct")
        //if there is not yet a trump decided. No alternative, just to prevent API abuse
        if ((!data.trump)) {
            //if we are at or below deal phase 3 (when there are options) we can pass
            if (data.dealPhase <= 3) {
                console.log("UUUfUUUUUU")
                console.log(body.trump)
                console.log(body.trump)
                console.log(suits.includes(body.trump))
                //did they pick the trump suit?
                if (suits.includes(body.trump)) {
                    //if so, prepare game for gamePhase 2. Should be a function
                    data.trump = body.trump
                    console.log(data.trump, "UIS COOl")
                    game.rows[0].gamephase++
                    //!NEWDATA
                    data.trick = 0;
                    data.p1Turn = false;
                    data.p1tricks = 0;
                    data.p2tricks = 0;

                    //!RUNS THINGS
                    let h1nfo = sortHands(data.hand1.concat(data.reserve1), cardValuesOrdering, true)
                    data.hand1 = h1nfo[0]
                    let p1runs = h1nfo[1]
                    console.log("P1RUNSY1Y1Y1Y1Y", p1runs)
                    console.log("fdoijafdsoij", h1nfo)
                    let h1Runs = checkForRuns(p1runs)
                    h1Runs = [data.hand1.indexOf(h1Runs[0]), data.hand1.indexOf(h1Runs[1])]
                    data.hand2 = data.hand2.concat(data.reserve2)
                    let h2nfo = sortHands(data.hand2, cardValuesOrdering, true)
                    data.hand2 = h2nfo[0]
                    let p2runs = h2nfo[1]
                    console.log("P2RUNSY2Y2Y2Y2Y", p2runs)
                    console.log("jiosdfajiodf", h2nfo)
                    let h2Runs = checkForRuns(p2runs)
                    h2Runs = [data.hand2.indexOf(h2Runs[0]), data.hand2.indexOf(h2Runs[1])]
                    let rns = [h1Runs, h2Runs]
                    for (let i = 0; i < 2; i++) {
                        for (let j = 0; j < 2; j++) {
                            if (rns[i][j] == -1) {
                                delete rns[i][j]
                            }
                        }
                    }
                    
                    //!BELLE THINGS
                    let belle = ['Q' + data.trump, 'K' + data.trump]
                    if (data.hand1.includes(belle[0]) && data.hand1.includes(belle[1])) {
                        data.belle = true
                    } else if (data.hand2.includes(belle[0]) && data.hand2.includes(belle[1])) {
                        data.belle = false
                    }

                    console.log(h1Runs, h2Runs)
                    //?Just check the first element since second relies, want to see if i can write a some
                    
                    if (h1Runs.some((element) => element != undefined)) {
                        data.h1Runs = h1Runs
                    }
                    if (h2Runs.some((element) => element != undefined)) {
                        data.h2Runs = h2Runs
                    }
                    console.log(data.h1Runs, data.h2Runs)
                    //!NEWDATA
                    delete data.reserve1
                    delete data.reserve2
                    console.log("Eugh",data,typeof data.hand1,typeof data.hand2)
                    console.log(data)
                    data = JSON.stringify(data)
                    await pool.query(
                        'UPDATE games SET gamedata = $1, ' +
                        'gamephase = $2 ' +
                        'WHERE gameid = $3',
                        [data, game.rows[0].gamephase, game.rows[0].gameid])
                    //!ACTUALLYDOTHISSHITPLEASE
                    /*if (isPlayer1) {
                        forceGrab(players[1])
                    } else {
                        forceGrab(players[0])
                    }*/
                    return 'updated succesfully'
                } else if (body.trump == 'B' && data.dealPhase < 3) {
                    //If the player didn't choose one, then continue with dealing
                    data.dealPhase++;
                    data = JSON.stringify(data)
                    await pool.query(
                        'UPDATE games SET gamedata = $1 ' +
                        'WHERE gameid = $2', 
                        [data, game.rows[0].gameid])
                    //forceGrab(isPlayer1)
                    return 'updated succesfully'
                } else {
                    console.log("TTTTTTTTÞT")
                    //Replace RES with return statements
                    return 'there was an error. Please reload and try again.'
                }
            }
        }
    } else {
        console.log("BOO")
        return ("You are poo")
    }
}

module.exports = phase1
