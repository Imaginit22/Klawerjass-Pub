const {pool} = require('./useful/sharedStuff')
function evaluateRuns(confruns, playerRuns) {
    let p1tricks = 0
    let p2tricks = 0
    if (confruns[1] == 4) {
        if (playerRuns[1] != undefined) {
            if (confruns[0] > playerRuns[1]) {
                p1tricks += 50;
            } else if (confruns[0] == playerRuns[1]) {
                /*//!WHAT HAPPENS HERE
                if () {

                } else if () {

                }*/
                console.log("It's panickin' time")
            } else {
                p2tricks += 50;
            }
        } else {
            p1tricks += 50;
        }
    } else if (confruns[1] == 3) {
        if (playerRuns[1] != undefined) {
            p2tricks += 50
        } else {
            if (confruns[0] > playerRuns[0]) {
                p1tricks += 20;
            } else if (confruns == playerRuns[0]) {
                console.log('It\'s pan3cking t3me')
            } else {
                p2tricks += 20
            }
        }
    }
    return [p1tricks, p2tricks]
}

const interactions = async (req, res) => {
    console.log(req.url, req.body, "INTERACTIONSJS")
    const body = req.body;
    if (body?.s == true) {
      const [playerRow, oppRow] = await Promise.all ([
        pool.query("SELECT * FROM users WHERE email = $1", [body.email]),
        pool.query("SELECT * FROM users WHERE email = $1", [body.oppemail])
      ]) 
      const player = playerRow.rows[0]
      const opponent = oppRow.rows[0]
      let gameRow = await pool.query("SELECT * FROM games WHERE senderid = $1 AND recipientid = $2", [player.userid, opponent.userid])
      let isSender = true
      if (gameRow?.rows[0]?.gameid == undefined) {
        isSender = false
        gameRow = await pool.query("SELECT * FROM games WHERE senderid = $2 AND recipientid = $1", [player.userid, opponent.userid])
      }
      const game = gameRow.rows[0]
      const data = JSON.parse(game.gamedata)
      if (data.trick == 0) {
        console.log("PICARD", data)
      function swap(hand) {
        const target7 = '7'+data.trump
        console.log(target7)
        if (hand.includes(target7)) {
          console.log("WHEEE 7 swap")
          hand[hand.indexOf(target7)] = data.trumpDecider
        }
      }
      if (isSender) {
        swap(data.hand1)
      } else {
        swap(data.hand2)
      }  
      await pool.query(
      'UPDATE games SET gamedata = $1 ' +
      'WHERE gameid = $2', 
      [data, game.gameid])
      }
    } else if (body?.r == true) {
        const [playerRow, oppRow] = await Promise.all ([
            pool.query("SELECT * FROM users WHERE email = $1", [body.email]),
            pool.query("SELECT * FROM users WHERE email = $1", [body.oppemail])
        ]) 
        const player = playerRow.rows[0]
        const opponent = oppRow.rows[0]
        let gameRow = await pool.query("SELECT * FROM games WHERE senderid = $1 AND recipientid = $2", [player.userid, opponent.userid])
        let isSender = true
        if (gameRow?.rows[0]?.gameid == undefined) {
            isSender = false
            gameRow = await pool.query("SELECT * FROM games WHERE senderid = $2 AND recipientid = $1", [player.userid, opponent.userid])
        }
        const game = gameRow.rows[0]
        const data = JSON.parse(game.gamedata)
        if (data?.confruns != undefined) {
            //!true for sender
            if (data.confruns[2] == true && !isSender) {
                /*if (data.confruns[1] == 4) {
                    if (data.h2Runs[1] != undefined) {
                        if (data.confruns[0] > data.h2Runs[1]) {
                            data.p1tricks += 50;
                        } else if (data.confruns[0] == data.h2Runs[1]) {
                            //!WHAT HAPPENS HERE
                            if () {

                            } else if () {

                            }
                            console.log("It's panickin' time")
                        } else {
                            data.p2tricks += 50;
                        }
                    } else {
                        data.p1tricks += 50;
                    }
                } else if (data.confruns[1] == 3) {
                    if (data.h2Runs[1] != undefined) {
                        data.p2tricks += 50
                    } else {
                        if (data.confruns[0] > data.h2Runs[0]) {
                            data.p1tricks += 20;
                        } else if (data.confruns == data.h2Runs[0]) {
                            console.log('It\'s pan3cking t3me')
                        } else {
                            data.p2tricks += 20
                        }
                    }
                }*/
                const runpts = evaluateRuns(data.confruns, data.h2Runs)
                delete data.confruns
                delete data.h1Runs
                delete data.h2Runs
                console.log("RUMPTKO",runpts)
            } else if (data.confruns[2] == false && isSender){
                const runpts = evaluateRuns(data.confruns, data.h2Runs)
                delete data.confruns
                delete data.h1Runs
                delete data.h2Runs

                console.log("AJAJAJAAJAJXNOPYT",runpts)
            }
        } else {
            let confruns = []
            if (isSender && data?.h1Runs != undefined) {
                if (data.h1Runs[1] != undefined) {
                    confruns = [data.h1Runs[1], 4, true]
                } else {
                    confruns = [data.h1Runs[0], 3, true]
                }
            } else if (!isSender && data?.h2Runs != undefined) {
                if (data.h2Runs[1] != undefined) {
                    confruns = [data.h2Runs[1], 4, false]
                } else {
                    confruns = [data.h2Runs[0], 3, false]
                }
            }
            data.confruns = confruns
            console.log(data.confruns, "DCU")
            console.log(data)
            await pool.query(
            'UPDATE games SET gamedata = $1 ' +
            'WHERE gameid = $2', 
            [data, game.gameid])
            
            //console.log(data.arc, yyyy)
        }
    } else if (body.b == true) {
        const [playerRow, oppRow] = await Promise.all ([
            pool.query("SELECT * FROM users WHERE email = $1", [body.email]),
            pool.query("SELECT * FROM users WHERE email = $1", [body.oppemail])
        ]) 
        const player = playerRow.rows[0]
        const opponent = oppRow.rows[0]
        let gameRow = await pool.query("SELECT * FROM games WHERE senderid = $1 AND recipientid = $2", [player.userid, opponent.userid])
        let isSender = true
        if (gameRow?.rows[0]?.gameid == undefined) {
            isSender = false
            gameRow = await pool.query("SELECT * FROM games WHERE senderid = $2 AND recipientid = $1", [player.userid, opponent.userid])
        }
        const game = gameRow.rows[0]
        const data = JSON.parse(game.gamedata)
        if (data.belle != undefined) {
            if (data.belle == true) {
                delete data.belle
                data.p1tricks += 20
            } else if (data.belle == false) {
                delete data.belle
                data.p2tricks += 20
            }
        }
    }
}
module.exports = interactions