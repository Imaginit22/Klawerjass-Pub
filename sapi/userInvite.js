const {pool} = require('./useful/sharedStuff')
const userInvite = async (req, res) => {
console.log("INVITE", req.body);
try {
    let workingString = '';
    for (let i = 12; i < req.url.length; i++) {
    workingString += req.url[i];
    }
    console.log(workingString)
    //opener
    let emailSe = "";
    //other
    let emailRe = "";
    for (let j = 0; j < workingString.length; j++) {
    console.log("J: " + j)
    if (workingString[j] == '+') {
        for (let k = j + 1; k < workingString.length; k++) {
        emailRe += workingString[k]
        }
        break;
    }
    emailSe += workingString[j];
    }
    console.log("EMOPSE ", emailRe, "  ", emailSe)
    if (!(req.body.sender == req.body.recipient)) {
    //TODO recipientid references userid, ON CASCADE DELETE

    let rowSenderInvites = await pool.query(`SELECT invite_count, userid FROM users WHERE email = $1`, [req.body.sender.toLowerCase()]);
    if (rowSenderInvites.rows[0].invite_count < 5) {
        let rowRecipient = await pool.query(`SELECT userid FROM users WHERE email = $1`, [req.body.recipient])
        if (!rowRecipient.rows[0]) {
        console.log("No users found for that invite")
        res.json("That user does not exist.")
        } else {
            console.log("CATALAN", rowSenderInvites, "SPANIARD", rowRecipient)
            let rowsGame = await pool.query(`SELECT gameid FROM games WHERE senderid = $1 AND recipientid = $2`, [rowSenderInvites.rows[0].userid, rowRecipient.rows[0].userid])
            let rowsGam2 = await pool.query(`SELECT gameid FROM games WHERE senderid = $1 AND recipientid = $2`, [rowRecipient.rows[0].userid, rowSenderInvites.rows[0].userid])
            console.log("MTG", rowsGame, "PIKMIN", rowsGam2, "END")
            if ((!rowsGame.rows[0]) && (!rowsGam2.rows[0])){
                await pool.query(`INSERT INTO invites (senderid, recipientid) VALUES ($1, $2)`, [rowSenderInvites.rows[0].userid, rowRecipient.rows[0].userid])
                console.log("Proceeding with increasing")
                //await pool.query(`UPDATE users SET invite_count = $1 WHERE userid = $2`, [rowSenderInvites.invite_count + 1, rowSenderInvites.userid])
                res.json("Invite sent!")
            } else {
                console.log("You already have that game numbnuts")
                res.json("You already have a game with that player.")
            }
        }
    } else {
        console.log("WAY THE HELL TOO MANY INVITES SLOW DOWN")
        res.json('You have too many sent invites.\nDelete a few, or wait for them to be accepted.')
    }
    }
} catch (error) {
    console.log(error);
    res.json('There was an error. Reload the page and try again.')
}

}
module.exports = userInvite