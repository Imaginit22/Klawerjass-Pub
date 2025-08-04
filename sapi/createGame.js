const {pool, Game} = require('./useful/sharedStuff')

const createGame = async (req, res) => {
    try {
        const body = req.body
        console.log("Creating game with req: ", body)
        const password = await pool.query('SELECT password FROM users WHERE email = $1', [body.recipient.toLowerCase()])
        if (password?.rows[0]?.password == body.password && password.rowCount > 0) {
            console.log("createGame password is correct");
            const [recipientResult, senderResult] = await Promise.all([
                    await pool.query('SELECT userid FROM users WHERE email = $1', [body.recipient.toLowerCase()]),
                    await pool.query('SELECT userid FROM users WHERE email = $1', [body.sender.toLowerCase()])
            ])
            const senderid = senderResult.rows[0].userid
            const recipientid = recipientResult.rows[0].userid
            console.log("sid", senderid, "rid", recipientid)
            let game = new Game();
            Promise.all([
                await pool.query('INSERT INTO games (senderid, recipientid, gamedata, gamePhase, p1pts, p2pts) VALUES ($1, $2, $3, $4, $5, $6)', [senderid, recipientid, game, 1, 0, 0]),
                await pool.query('DELETE FROM invites WHERE senderid = $1 AND recipientid = $2', [senderid, recipientid])
            ])
            console.log("GAME CREATED FOR ", body.sender, "AND ", body.recipient)
            res.json("Game created succesfully")
        } else {
            console.log("password in createGame is wrong\n", password.rowCount, password?.rows[0]?.password, body.password)
            res.json("There was an error. Please reload the page and try again.")
        }
    } catch (error) {
        //Send these on initial load and send codes later to reduce package size. 
        res.json("There was an error. Please reload the page and try again.")
        console.log(error)
    }
}
module.exports = createGame