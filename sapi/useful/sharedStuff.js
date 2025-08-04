const {Game, sortHands} = require('./gameLogic/Game')
const express = require('express');
const bodyParser = require('body-parser');
const next = require('next');
const path = require('path');
const fs = require('fs/promises');

const { Pool } = require('pg');
const exp = require('constants');
//!USE ENVIRONMENT VARIABLES


const pool = new Pool({
    user: '',
    host: '',
    database: '',
    password: '',
    port: 5432,
})
//? If you separate db from server, you can use this to connect to db
/*class Pool {
    //TODO
    async query(sql, params) {
        const res = await fetch('https://afraid-hairs-check.loca.lt', {
        //^THIS MUST BE CHANGED REGULARLY
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ sql: sql, params: params })
        })
        //console.log("RES", res)
        //console.log(contentType, res.headers)
        let data;
        data = await res.json();
        //console.log("STU", data, data.password)
        return data
    }
}
const pool = new Pool()*/
async function signin(username, password, res)  {
    const userRows = await pool.query('SELECT userid, password FROM users WHERE email = $1', [username])
    const rightPassword = userRows.rows[0].password
    if (password == rightPassword) {
        return true
    } else {
        res.send('There was an error. Please reload the page and try again.')
        return false
    }
}
async function checkPword(userid, password, correctPassword = false) {
    if (correctPassword == false) {
        correctPassword = await pool.query('SELECT password FROM users WHERE userid = $1', [userid])
    }
    if (correctPassword == password) {
        return true
    } else {
        return false
    }
}
function updateIP(email, ip) {
    pool.query(`
    UPDATE sessions
    SET ip = $1
    FROM users
    WHERE users.userid = sessions.userid
    AND users.email = $2`, [ip, email])
}
function createIP(email, ip) {
    pool.query(`
    INSERT INTO sessions (userid, ip)
    SELECT userid, $1
    FROM users
    WHERE users.email = $2`, [ip, email])
}
//TODO actually make sessions or websockets.
async function forceGrab(id, idBool = false) {
    if (idBool) {
        poke(id, {p: 'y'})
    } else {
        const rowsIp = await pool.query(`
        SELECT sessions.ip 
        FROM sessions
        JOIN users
        ON users.userid = sessions.sessionuserid
        WHERE users.email = $1
        `, [id])
        ip = rowsIp.rows[0].ip
        poke(ip, {p: 'y'})
    }
}
function poke(ip, message) {
    fetch(ip, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(message)
    })
}
module.exports = {
    Game,
    sortHands,
    express,
    bodyParser,
    next,
    path,
    fs,
    pool,
    exp,
    checkPword,
    signin,
    updateIP,
    createIP,
    poke,
    forceGrab,
    phase1: require('./gameLogic/phase1')
}
