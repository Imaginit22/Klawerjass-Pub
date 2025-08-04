async function endGame(gameid, winnerid, loserid) {
    await pool.query(`
    INSERT INTO wins (winnerid, loserid, count) 
        VALUES ($1, $2, 1)
        ON CONFLICT (winnerid, loserid)
        DO UPDATE SET count = wins.count + 1`,
        [winnerid, loserid])
    forceGrab(winnerid)
    forceGrab(loserid)
    /*await pool.query(`
        DELETE FROM games WHERE gameid = $1`, [gameid])
    */
}