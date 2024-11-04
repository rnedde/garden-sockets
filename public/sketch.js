let socket;
let userName;
let osc;

let currentHeight = 0;
let xPosition;
let rightOffset = 6;

let users = {};

function setup() {
  createCanvas(windowWidth, windowHeight);
  background(255);

  console.log("Setup started");
  
  // Create oscillator but don't start it yet
  osc = new p5.Oscillator();
  osc.setType('sine');
  osc.freq(440);
  osc.amp(0.5);
  console.log("Oscillator created");

  // Ask for user's name and start oscillator after prompt
  userName = prompt("Please enter your name:", "Anonymous");
  if (!userName) userName = "Anonymous";
  console.log("User name set:", userName);
  
  // Start oscillator after user interaction
  osc.start();

  // Open and connect socket
  socket = io();

  // Listen for confirmation of connection
  socket.on('connect', function () {
    console.log("Connected with socket ID:", socket.id);

    // Assign a random x position
    xPosition = random(0, windowWidth);
    console.log("Initial position set:", xPosition);

    // Create initial flower data with all necessary properties
    const initialData = {
      name: userName,
      xPos: xPosition,
      height: currentHeight,
      color: "red",
      petalSize: 30,
      petalCount: 8,
      leafPositions: []
    };
    console.log("Emitting initial userData:", initialData);
    socket.emit('userData', initialData);
  });

  // Listen for messages named 'userData' from the server
  socket.on('userData', function (data) {
    console.log("Received userData:", data);
    // Update existing flower or create new one
    if (users[data.id]) {
      console.log("Updating existing flower for user:", data.id);
      users[data.id].update(data);
    } else {
      console.log("Creating new flower for user:", data.id);
      users[data.id] = new Flower(
        data.name,
        data.color || 'red',
        data.petalSize || 30,
        data.petalCount || 8,
        data.height || 0,
        data.leafPositions || [],
        data.xPos
      );
    }
  });

  // Listen for user disconnection
  socket.on('userDisconnected', function (userId) {
    delete users[userId];
  });
}


function draw() {
  background(255);
  
  // Increment height for current user's flower
  currentHeight += 1;

  // Send updated data including all necessary properties
  const updateData = {
    name: userName,
    xPos: xPosition,
    height: currentHeight,
    color: 'red',
    petalSize: 30,
    petalCount: 8,
    leafPositions: users[socket.id] ? users[socket.id].leafPositions : []
  };
  socket.emit('userData', updateData);

  // Draw all flowers
  for (let id in users) {
    users[id].draw();
  }
}