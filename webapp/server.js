#!/usr/bin/node

const express = require('express');
const os = require('os');
const path = require('path');
const fs = require('fs');
const bodyParser = require('body-parser');
const app = express();
const iwlistAsync = require('./iwlistAsync');

const asyncMiddleware = fn =>
  (req, res, next) => {
    Promise.resolve(fn(req, res, next))
      .catch(next);
  };

app.use(bodyParser.json());
app.use('/static', express.static(path.join(__dirname, '/build/static')))

app.get('/', asyncMiddleware( async (req, res, next) => {
  res.sendFile(path.join(__dirname + '/build/index.html'));
}));

app.get('/listWifi', asyncMiddleware( async (req, res, next) => {
  const wifis = await iwlistAsync();
  console.log(wifis);
  res.json(wifis);
}));

// app.post('/saveWifi', (req, res) => {
//   let configs = JSON.stringify(req.params);
//   fs.writeFile('./webConfigs.txt', configs, (err) => {
//     if (err)
//       throw err;
//     console.log('config saved')
//   });
//   res.send(req.params);
// });

app.listen(3000, () => console.log('Listening on port 3000!'));
