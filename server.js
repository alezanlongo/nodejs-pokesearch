'use strict';
// Constants
const express = require('express');
const { check, validationResult } = require('express-validator');
const PORT = 8080;
const HOST = '0.0.0.0';
const pokeApi = require('./pokeApi');

// App
const app = express();
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
  res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
  next();
});
//app.use(express.static('public'))
app.use(express.json());
app.post('/search', [
  check('kwd').isLength({ min: 3 }).trim().escape()
], (req, res) => {
  validatorError(req, res)
  const kwd = req.body.kwd
  pokeApi.search(kwd, res)

  /** This function must be run just once at fist to create local Pokemon's DB */
  //pokeApi.createRepo();
})

function validatorError(req, res) {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() })
  }
}

app.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`);