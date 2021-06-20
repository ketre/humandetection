// Classifier Variable

let classifier;
// Model URL
let imageModelURL = 'human-model/';
// Video
let video;
let flippedVideo;
// To store the classification
let label = "";
let serial;// variable to hold an instance of the serialport library
// let portName = '/dev/cu.usbmodem14201';// fill in your serial port name here
let outByte = 10;// default for outgoing data

// Load the model first
function preload() {
  classifier = ml5.imageClassifier(imageModelURL + 'model.json');
}

var capture;
var w = 320;
var h = 480;



function setup() {
  // canvas = createCanvas(w, h);



  // serial = new p5.SerialPort('192.168.0.207');    // make a new instance of the serialport library
  // serial.on('error', console.error); // callback for errors
  // serial.open(portName);
  cnv_width = (document.getElementById('cnv-width').offsetWidth) - 32;
  cnv_height = ((260 / 300) * cnv_width) - 32;
  vid_height = ((240 / 260) * cnv_height) - 32;
  var canvas = createCanvas(cnv_width, cnv_height);
  canvas.style('display', 'none');
  canvas.parent('video-holder');
  // Create the video
  var constraints = { video: { facingMode: "environment" } };
  video = createCapture(constraints);
  video.size(cnv_width, vid_height);
  // video.hide();

  video.elt.setAttribute('playsinline', '');
  // video.size(w, h); 


  flippedVideo = ml5.flipImage(video)
  // Start classifying
  classifyVideo();
}

function draw() {
  background(0);
  // Draw the video
  image(flippedVideo, 0, 0);

  // Draw the label
  fill(255);
  textSize(16);
  textAlign(CENTER);
  text(label, width / 2, height - 4);
}

// Get a prediction for the current video frame
function classifyVideo() {
  flippedVideo = ml5.flipImage(video)
  classifier.classify(flippedVideo, gotResult);
}

let socket = io.connect('https://localhost:8443')
// const socket = io("wss://localhost:3000");


function gotResult(error, results) {
  // If there is an error
  if (error) {
    console.error(error);
    return;
  }
  // The results are in an array ordered by confidence.
  // console.log(results[0]);
  label = results[0].label;

  if (label == "person") {
    socket.emit('human', 2)

    // outByte = 2;
    // console.log('outByte: ', outByte)
    // serial.write(outByte);

    document.getElementById("status").innerHTML = `<h3 style="color: red;"><i class="fa fa-exclamation-triangle"></i></h3>
      <h3 style="color: red;">Warning</h3>
      <h3 style="color: red;">Human detected</h3>`;

  } else {
    // socket.emit('human', "off")
    // outByte = 4;
    // send it out the serial port:
    // console.log('outByte: ', outByte)
    // serial.write(outByte);
    document.getElementById("status").innerHTML = `<h3 style="color: #085129;"><i class="fa fa-check-square"></i></h3>
    	<h3 style="color: #085129;">Everything is OK</h3>`;
  }

  // Classifiy again!
  classifyVideo();
}
