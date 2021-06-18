const fs = require('fs');
const https = require('https');
const express = require('express');
// let serialserver = require('p5.serialserver');
const SerialPort = require('serialport');
const Readline = require('@serialport/parser-readline');
const port = new SerialPort('/dev/cu.usbmodem14201');
const parser = port.pipe(new Readline({ delimeter: '\r\n' }));

const app = express();
app.use(express.static(process.env.SERVE_DIRECTORY || 'dist'));
app.get('/', function (req, res) {
  return res.end('<p>This server serves up static files.</p>');
});

const options = {
  key: fs.readFileSync('key.pem', 'utf8'),
  cert: fs.readFileSync('cert.pem', 'utf8'),
  passphrase: process.env.HTTPS_PASSPHRASE || ''
};

const server = https.createServer(options, app);
const io = require('socket.io')(server);

let path = require('path');
const { Socket } = require('dgram');

io.on('connection', (socket) => {
  // socket.emit('welcome', socket.id);

  parser.on('data', (data)=>{
      console.log(data)
      socket.emit('arduino data', data);
  })
  socket.on('human', (detection) => {
    console.log(detection)
    port.write(detection + "E")
  })
  socket.on('disconnect', () => {
    console.log('left: ' + socket.id)
  })
})

// serialserver.start(8081);
console.log("serialserver is running");
server.listen(8443, '0.0.0.0');
