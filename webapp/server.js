#!/usr/bin/node
const express = require('express');
const os = require('os');
const path = require('path');

const app = express();

app.use(express.static('build'));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname + '/build/index.html'));
});

app.get('/api/getUsername', (req, res) => {
  res.send({ username: os.userInfo().username })
});
app.listen(80, () => console.log('Listening on port 80!'));
