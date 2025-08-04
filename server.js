const express = require('express');
const bodyParser = require('body-parser');
const next = require('next');
const path = require('path');
const fs = require('fs/promises');
const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev });
const server = express();
const port = 3000;
const handle = app.getRequestHandler()

const { Pool } = require('pg');
const exp = require('constants');
server.use(express.static(path.join(__dirname, 'public')));
server.use(bodyParser.json())
server.use(bodyParser.urlencoded({extended: true}))
require('dotenv').config();
//!USE ENVIRONMENT VARIABLES



/*app.use(express.urlencoded({ extended: true }));
app.use(express.json())*/



//! COMBINE INVITE AND GAMES TABLES
app.prepare().then( async() => {
  const ignore = ['sharedStuff.js', 'useful']
  let endpoints = []
  const readdir = async () => {
    const files = await fs.readdir('sapi') 
    console.log("Files from server init:\n", files)
    for (let i = 0; i < files.length; i++) {
      if (!ignore.includes(files[i])) {
        console.log(files[i])
        endpoints.push(files[i].split('.')[0])
      }
    }
  }
  await readdir()
  for (let i = 0; i < endpoints.length; i++) {
    const callFunc = require(`./sapi/${endpoints[i]}`)
    server.post(`/${endpoints[i]}`, express.json(), callFunc) 
  }
  //in general, password validation for all things. 
  server.all('*', (req,res) => {
    console.log("REQURL", req.url, req.body)
    return handle(req, res)
  })
  // Start the server
  server.listen(port, '0.0.0.0', () => {
    console.log(`Server is efcIAMNOA at http://localhost:${port}`, "\n");
    fetch('https://e16b-174-95-91-251.ngrok-free.app', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ username: "porcupine" })
    })
  });
})

