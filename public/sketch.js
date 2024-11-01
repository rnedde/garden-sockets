let socket;
let userName;


let currentHeight = 0;
let xPosition;


let users = {};

function setup() {
  createCanvas(windowWidth, windowHeight);
  background(255);

  // Ask for user's name
  userName = prompt("Please enter your name:", "Anonymous");
  if (!userName) userName = "Anonymous";

  // Open and connect socket
  socket = io();

  // Listen for confirmation of connection
  socket.on('connect', function () {
    console.log("Connected");

    // Assign a random x position
    xPosition = random(0, windowWidth);

    // Send initial user data

    socket.emit('userData', { name: userName, x: xPosition, height: currentHeight });
  });

  // Listen for messages named 'userData' from the server
  socket.on('userData', function (data) {
    users[data.id] = data;
  });

  // Listen for user disconnection
  socket.on('userDisconnected', function (userId) {
    delete users[userId]; ``
  });
}


function draw() {
  background(255);
  currentHeight += 0.1;

  socket.emit('userData', { name: userName, x: xPosition, height: currentHeight });

  // Draw all users
  for (let id in users) {
    let user = users[id];
    fill(0);
    line(user.x, height, user.x, height - user.height);
    textAlign(CENTER, BOTTOM);
    text(user.name, user.x, height - user.height - 10);
  }
}