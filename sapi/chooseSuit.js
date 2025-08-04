/*
REQUESTS CONSIST OF: 
 * card
 * trump
DATA DEALT WITH:
 * password - r, w
 * email - w
*/
const {
pool,
Game, 
sortHands, 
forceGrab, 
phase1} = require('./useful/sharedStuff')


let specialUpdate = false
/*
GAMEPHASE 2
*/


const chooseSuit = async (req, res) => {
    console.log("chooseSuitCalled")
    //read request body
    const body = req.body;
    console.log(body, req.url)
    let players
    players = req.url.split('?')[1].split('+')
    console.log(players)
    //look for players by userid
    const [id1Row, id2Row] = await Promise.all([
        await pool.query('SELECT userid FROM users WHERE email = $1', [players[0]]),
        await pool.query('SELECT userid FROM users WHERE email = $1', [players[1]])
    ])
    let isPlayer1 = true
    //find active game
    let game = await pool.query(
    'SELECT * FROM games WHERE senderid = $1 AND recipientid = $2',
    [id1Row.rows[0].userid, id2Row.rows[0].userid])
    if (game.rowCount == 0) {
        isPlayer1 = false;
        game = await pool.query(
            'SELECT * FROM games WHERE (senderid = $2 AND recipientid = $1)',
            [id1Row.rows[0].userid, id2Row.rows[0].userid]
        )
    }
    //look at gamedata
    let data = JSON.parse(game.rows[0].gamedata)
    //if we are in gamephase 1, do logic for dealing.
    if (game.rows[0].gamephase == 1 ) {
        phase1(req, game, isPlayer1)
    } else {
        phase2()
    }
}
module.exports = chooseSuit