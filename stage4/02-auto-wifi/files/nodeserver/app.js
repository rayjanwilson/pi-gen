#!/usr/bin/node
const http = require('http');
const fs = require('fs');

const basehostname = fs.readFileSync('/etc/hostname', 'utf8').trim();
const hostname = basehostname.concat('', '.local');
const port = 80;

const server = http.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/html');
  res.end('<!doctype html><html>Hello World</html>');
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
