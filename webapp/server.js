#!/usr/bin/node
const express = require('express');
const os = require('os');
const path = require('path');
const fs = require('fs');
const bodyParser = require('body-parser')
const app = express();

app.use(bodyParser.json());
app.use('/static',express.static(path.join(__dirname,'/build/static')))

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname + '/build/index.html'));
});

app.post('/saveWifi', (req, res) => {
  let configs = JSON.stringify(req.params);
  fs.writeFile('/boot/webConfigs.txt', configs, (err) => {
    if (err) throw err;
    console.log('config saved')
  });
  res.send(req.params);
});
app.get('/api/getUsername', (req, res) => {
  res.send({ username: os.userInfo().username })
});
app.listen(80, () => console.log('Listening on port 80!'));
