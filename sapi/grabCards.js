const {pool, checkPword} = require('./useful/sharedStuff')

const grabCards = async (req, res) => {
    //console.log("Grab Cards Request URL", req.url)
    //console.log("Grab Cards Request Body", req.body)
    let workingString = '';
    for (let i = 11; i < req.url.length; i++) {
      workingString += req.url[i];
    }
    //opener
    let emailOp = "";
    //other
    let emailSe = "";
    for (let j = 0; j < workingString.length; j++) {
      if (workingString[j] == '+') {
        for (let k = j + 1; k < workingString.length; k++) {
          emailSe += workingString[k]
        }
        break;
      }
      emailOp += workingString[j];
    }
    //!Make the stored object have sections for accesibility by different players
    const sendObject = {};
    //!CHECK PASSWORD OF emailOp against submitted
    const opIDrow = await pool.query("SELECT userid, password FROM users WHERE email = $1", [emailOp])
    const opId = opIDrow.rows[0].userid
    const opPword = opIDrow.rows[0].password
    if (await checkPword(opId, req.body.password, opPword)) {
        let seIDrow = await pool.query("SELECT userid FROM users WHERE email = $1", [emailSe])
        let seId = seIDrow.rows[0].userid
        let gameData = await pool.query("SELECT * FROM games WHERE senderid = $1 AND recipientid = $2", [opId, seId])
        let isPlayer1 = true;
        if (gameData.rowCount == 0) {
            isPlayer1 = false;
            gameData = await pool.query("SELECT * FROM games WHERE senderid = $1 AND recipientid = $2", [seId, opId]) 
        }
        if (gameData?.rows[0] != undefined) {
            const gData = gameData.rows[0];
            const parsedData = JSON.parse(gData.gamedata);
            const gamePhase = JSON.parse(gData.gamephase);

            parsedData.cardsHand = isPlayer1 ? parsedData.hand1 : parsedData.hand2;
            delete parsedData.hand1;
            delete parsedData.hand2;
            delete parsedData?.h1Runs;
            delete parsedData?.h2Runs;
            parsedData.gamePhase = gamePhase;
            parsedData.runs = isPlayer1 ? parsedData.h1Runs : parsedData.h2Runs;
            parsedData.belle = isPlayer1 == parsedData.belle;
            console.log(isPlayer1, "ISPLAYER1", parsedData.dealPhase, "GAMEDATA")
            console.log((parsedData.dealPhase % 2) == isPlayer1)
            parsedData.isTurn = (parsedData.dealPhase % 2) == isPlayer1
            console.log(parsedData.isTurn, "ISTURN")
            parsedData.p1tricks = gData.p1pts + parsedData.p1tricks;
            parsedData.p2tricks = gData.p2pts + parsedData.p2tricks;

            res.json(parsedData)
        } else {
            res.json({message: 'That game does not exist.',  code: 'nogame'})
        }
    } else {
        res.send('Failed to access game, please verify your password.')
    }
}
module.exports = grabCards