async function newGame(gameid, p1pts, p2pts, senderid, recipientid, dealPhase) {
    const ptsRow = await pool.query(`
        SELECT p1pts, p2pts FROM games 
        WHERE gameid = $1`, [gameid])
    const pts = ptsRow.rows[0]
    console.log(p1pts, p2pts, pts, "POINTSGALORe")
    if (dealPhase%2 == 0) {
        if (p1pts > p2pts) {
            p1pts += p2pts
            p2pts = 0;
            console.log(p1pts, p2pts)
        }
    } else {
        if (p2pts > p1pts) {
            p2pts += p1pts
            p1pts = 0;
            console.log(p1pts, p2pts)
        }
    }
    const p1p = pts.p1pts + p1pts
    const p2p = pts.p2pts + p2pts
    console.log('pts!!!', pts, p1p, p2p)
    if (p1p > 500) {
        endGame(gameid, senderid, recipientid)
    } else if (p2p > 500) {
        endGame(gameid, recipientid, senderid)
    } else {
        const game = new Game();
        await pool.query(`
        UPDATE games SET 
            gamephase = $1, 
            gamedata = $2, 
            p1pts = $3, 
            p2pts = $4
            WHERE gameid = $5`, 
        [1, game, p1p, p2p, gameid])
        forceGrab(senderid)
        forceGrab(recipientid)
    }
}