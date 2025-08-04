const {pool, signin} = require('./useful/sharedStuff')
const deleteInvite = async (req, res) => {
    const body = req.body
    console.log("DELETEINVBODY", body)
    signin(body.sender, body.password, res)
    .then(async (data) => {
        console.log("DATA DELETEINVITE", data)
        if(data)  {
            const [senderIdRow, recipientIdRow] = await Promise.all([
                await pool.query('SELECT userid FROM users WHERE email = $1', [body.sender]),
                await pool.query('SELECT userid FROM users WHERE email = $1', [body.recipient])
            ])
            console.log(body, "@ IN DLEETINV", senderIdRow, recipientIdRow)
            await pool.query('DELETE FROM invites WHERE senderid = $1 AND recipientid = $2', [senderIdRow.rows[0].userid, recipientIdRow.rows[0].userid])
            res.json('Invite succesfully deleted')
        }
    })
}
module.exports = deleteInvite