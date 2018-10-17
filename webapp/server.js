#!/usr/bin/node

const express = require('express');
const os = require('os');
const path = require('path');
const fs = require('fs');
const bodyParser = require('body-parser')
const iwlist = require("./iwlist")
const app = express();

function log_error_send_success_with(success_obj, error, response) {
  if (error) {
    console.log("ERROR: " + error);
    response.send({status: "ERROR", error: error});
  } else {
    success_obj = success_obj || {};
    success_obj["status"] = "SUCCESS";
    response.send(success_obj);
  }
  response.end();
}

app.use(bodyParser.json());
app.use('/static', express.static(path.join(__dirname, '/build/static')))

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname + '/build/index.html'));
});

app.post('/saveWifi', (req, res) => {
  let configs = JSON.stringify(req.params);
  fs.writeFile('./webConfigs.txt', configs, (err) => {
    if (err)
      throw err;
    console.log('config saved')
  });
  res.send(req.params);
});
app.get('/api/listWifi', (req, res) => {
  iwlist((error, result) => {
    console.log(result)
    // log_error_send_success_with(result[0], error, response);
  });
  // res.send({username: os.userInfo().username})
});
app.listen(3000, () => console.log('Listening on port 3000!'));
