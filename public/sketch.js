let socket;
let userName;
let osc;

let color;
let users = {};
let currentFlower;

let colorPicker;
let popupActive = true;

let growthInterval = 50;
let growthSpeed = 0.1;
let petalGrowthSpeed = 1;


let initialFlowerHeight = 0;
let initialFlowerPetalSize = 40;
let initialFlowerPetalCount = 8;
let defaultFlowerColor = 'red';



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

  // Create and show the popup
  createLoginpopup();
  
  // Add the CSS styles
  addpopupStyles();
}

// Popup when user first connects 
function createLoginpopup() {
  const popup = createDiv('');
  popup.class('popup');
  
  const popupContent = createDiv('');
  popupContent.class('popup-content');
  
  const title = createElement('h2', 'Community Garden');
  title.parent(popupContent);
  
  const nameInput = createInput('');
  nameInput.attribute('placeholder', 'Enter your name');
  nameInput.parent(popupContent);
  
  colorPicker = createColorPicker('#ff0000');
  colorPicker.parent(popupContent);
  
  const submitButton = createButton('Join Garden');
  submitButton.parent(popupContent);
  submitButton.mousePressed(() => {
    userName = nameInput.value() || 'Anonymous';
    popup.remove();
    popupActive = false;
    color = colorPicker.color().toString();
    // Start oscillator and socket connection after user input
    osc.start();
    initializeSocket();
  });
  
  popupContent.parent(popup);
}

function addpopupStyles() {
  const style = createElement('style', `
    .popup {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(0, 0, 0, 0.5);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 1000;
    }
    
    .popup-content {
      background-color: white;
      padding: 20px;
    }
  `);
  style.parent(document.head);
}

// Initialize socket connection
function initializeSocket() {
  // Open and connect socket
  socket = io();
  
  socket.on('connect', function () {
    console.log("Connected with socket ID:", socket.id);
    let xPosition = random(0, windowWidth);
    
    const initialData = {
      name: userName,
      xPos: xPosition,
      height: initialFlowerHeight,
      color: color,  // Use selected color
      petalSize: initialFlowerPetalSize,
      petalCount: initialFlowerPetalCount,
    };
    socket.emit('userData', initialData);
  });
  
  // Listen for messages named 'userData' from the server
  socket.on('userData', function (data) {
    // Update existing flower or create new one
    if (users[data.id]) {
      users[data.id].update(data);
    } else {
      console.log("Creating new flower for user:", data.id);
      users[data.id] = new Flower(
        data.name,
        data.color || defaultFlowerColor,
        data.petalSize || initialFlowerPetalSize,
        data.petalCount || initialFlowerPetalCount,
        data.height || initialFlowerHeight,
        data.xPos
      );
    }
    if(socket.id == data.id) currentFlower = users[data.id];
  });

  // Listen for user disconnection
  socket.on('userDisconnected', function (userId) {
    delete users[userId];
  });
}



function draw() {
  background(255);
  if(!currentFlower) return;
  currentFlower.height += growthSpeed;

  // Check if we've crossed another growthInterval threshold
  if (currentFlower.height>10 &&Math.floor(currentFlower.height) % growthInterval === 0) {
    console.log("Growing flower");
    currentFlower.petalSize += petalGrowthSpeed;
  }

  // Send updated data including all necessary properties
  const updateData = {
    name: currentFlower.name,
    xPos: currentFlower.xPos,
    height: currentFlower.height,
    color: currentFlower.color,
    petalSize: currentFlower.petalSize,
    petalCount: currentFlower.petalCount,
  };
  if(socket) socket.emit('userData', updateData);

  // Draw all flowers
  for (let id in users) {
    console.log("drawing ", users[id].name);
    users[id].draw();
  }
}