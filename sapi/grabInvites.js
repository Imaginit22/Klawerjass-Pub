const {pool} = require('./useful/sharedStuff')
function arrayIfy (rows, depth = 0) {
    let missingArrays = 0;
    let delveRows = rows
    for (let i = 0; i < depth + 1; i++) {
        if (missingArrays == 0) {
            if (!Array.isArray(delveRows)) {
                missingArrays++
            }
            delveRows = delveRows[0]
        } else {
            missingArrays++
        }
    }
    for (let i = 0; i < missingArrays; i++) {
        rows = [rows]
    }
    return rows
}
function stripRows(rows, param) {
    const arreturn = []
    //for multiple things wanted from one row
    if (rows != undefined) {
        if (!Array.isArray(param)) {
            for (let i = 0; i < rows.length; i++) {
                arreturn.push(rows[i][param])
            }
        } else {
            for (let i = 0; i < rows.length; i++) {
                for (let j = 0; j < param.length; j++) {
                    arreturn.push(rows[i][param[j]])
                }
            }
        }
        return arreturn
    }
}
function makeQuery(elements) {
    let sql
    if(elements.length > 0) {
        sql = 'SELECT email FROM users WHERE userid IN ('
        for (i = 0; i < elements.length; i++) {
            sql += `$${i + 1},`
        }
        if (elements.length != 0) {
            sql = sql.slice(0, -1)
        }
        sql += ')'
    }
    return sql
}
function makeSQL(pairs) {
    pairs = arrayIfy(pairs, 1)
    let returnIds = []
    let returnSQL
    for (let i = 0; i < pairs.length; i++) {
        if (pairs[i][0].rowCount != 0) {
            let rows = pairs[i][0].rows
            let param = pairs[i][1]
            let ids = stripRows(rows, param)
            console.log("IDSIDISDIS", ids)
            returnIds = returnIds.concat(ids)
        }
    }
    returnSQL = makeQuery(returnIds)
    return [returnIds, returnSQL]
}
async function queryIfExist(pairs) {
    let SQL = makeSQL(pairs)
    if (SQL[1] != undefined) {
        SQL = await pool.query(SQL[1], SQL[0])
        return SQL
    }
    return null
}
const grabInvites = async (req, res) => {
try {
    console.log("REQ", req)
    console.log("Grabbing invites and games");
    const email = req.body.email;
    console.log("Database is open to grab invites and this is the email " + email);
    let rowReqId = await pool.query(`SELECT userid FROM users WHERE email = $1`, [email])
    const playerId = rowReqId.rows[0].userid
    let [rowsSenderId, rowsRecipientId, rowsSendergameId, rowsRecipientgameId] = await Promise.all([
        pool.query('SELECT senderid FROM invites WHERE recipientid = $1', [playerId]),
        pool.query('SELECT recipientid FROM invites WHERE senderid = $1', [playerId]),
        pool.query('SELECT senderid FROM games WHERE recipientid = $1', [playerId]),
        pool.query('SELECT recipientid FROM games WHERE senderid = $1', [playerId])
    ])
    //TODO
    console.log("DSFIj")
    const playersRec = await queryIfExist([rowsSenderId, 'senderid'])
    const playersSent = await queryIfExist([rowsRecipientId, 'recipientid'])
    const playersGame = await queryIfExist([[rowsSendergameId, 'senderid'], [rowsRecipientgameId, 'recipientid']])
    console.log(playersRec)
    console.log(playersSent)
    console.log(playersGame)
    const Sendata = {
        invites: playersRec ? playersRec.rows : "NOINVITES",
        outvites: playersSent? playersSent.rows : "NOSENT",
        games: playersGame? playersGame.rows : "NOGAMES"
    }
    console.log("SYART", Sendata, "ENDD")
    res.json(Sendata);
    } catch(error) {
        console.log(error)
    }
}
module.exports = grabInvites