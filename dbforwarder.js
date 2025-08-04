const express = require('express');
const bodyParser = require('body-parser');
const next = require('next');
const path = require('path');
const fs = require('fs/promises');
const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev });
const server = express();
const port = 8081;
const handle = app.getRequestHandler()

const { Pool } = require('pg');
const exp = require('constants');
server.use(express.static(path.join(__dirname, 'public')));
server.use(bodyParser.json())
server.use(bodyParser.urlencoded({extended: true}))

const pool = new Pool({
    host: '',
    user: '',
    database: '',
    password: '',
    port: 5432,
    max: 20,
    idleTimeoutMillis: 10000,
    connectionTimeoutMillis: 60000,
})

app.prepare().then( async() => {
    //in general, password validation for all things. 
    server.all('*', async (req,res) => {
        console.log("REQURL", req.url)
        console.log("REQBODY", req.body)
        const rows = await pool.query(req.body.sql, req.body.params)
        console.log("rows", rows)
        res.json(rows)
    })
    server.get('/', (req, res) => {
        console.log(req)
    })
    // Start the server
    server.listen(port, 'localhost', () => {
      console.log(`Server is yomama at http://localhost:${port}`, "\n");
    });
  
})
  
  