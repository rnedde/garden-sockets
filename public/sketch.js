let socket;
let userName;

let color;
let users = {};
let currentFlower;

let colorPicker;
let popupActive = true;

let growthInterval = 500;
let growthSpeed = 10;
let petalGrowthSpeed = 1;

let initialFlowerHeight = 0;
let initialFlowerPetalSize = 40;
let initialFlowerPetalCount = 8;
let defaultFlowerColor = 'red';

let maskCanvas; // Canvas for the occlusion mask

function setup() {
  createCanvas(windowWidth, windowHeight);
  maskCanvas = createGraphics(windowWidth, windowHeight);
  background(255);

  console.log("Setup started");

  // Create and show the popup
  createLoginpopup();

  // Add the CSS styles
  addpopupStyles();

  // Handle window resizing
  window.addEventListener('resize', resizeCanvasAndFlowers);
}

function resizeCanvasAndFlowers() {
  resizeCanvas(windowWidth, windowHeight);
  maskCanvas = createGraphics(windowWidth, windowHeight);

  // Update the positions of all flowers based on the new window dimensions
  for (let id in users) {
    users[id].xPos = windowWidth / 2 + (users[id].xPos - width / 2) * (windowWidth / width);
    users[id].height = initialFlowerHeight;  // Reset the height for regrowth, if needed
  }

  applyMask(); // Redraw the mask for the new size
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
  socket = io();

  socket.on('connect', function () {
    console.log("Connected with socket ID:", socket.id);
    let xPosition = random(windowWidth / 2 - windowWidth / 10, windowWidth / 2 + windowWidth / 10);

    const initialData = {
      name: userName,
      xPos: xPosition,
      height: initialFlowerHeight,
      color: color,
      petalSize: initialFlowerPetalSize,
      petalCount: initialFlowerPetalCount,
    };
    socket.emit('userData', initialData);
  });

  // Listen for messages named 'userData' from the server
  socket.on('userData', function (data) {
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
    if (socket.id == data.id) currentFlower = users[data.id];
  });

  socket.on('userDisconnected', function (userId) {
    delete users[userId];
  });
}

function draw() {
  background(255);
  if (!currentFlower) return;
  currentFlower.height += growthSpeed;

  if (currentFlower.height > 10 && Math.floor(currentFlower.height) % growthInterval === 0) {
    currentFlower.petalSize += petalGrowthSpeed;
  }

  const updateData = {
    name: currentFlower.name,
    xPos: currentFlower.xPos,
    height: currentFlower.height,
    color: currentFlower.color,
    petalSize: currentFlower.petalSize,
    petalCount: currentFlower.petalCount,
  };
  if (socket) socket.emit('userData', updateData);

  for (let id in users) {
    users[id].draw();
  }

  applyMask();
}

function applyMask() {
  maskCanvas.clear();

  maskCanvas.fill(0);
  maskCanvas.noStroke();

  const radius = min(width, height) * 0.4;
  const centerX = width / 2;
  const centerY = height / 2;

  maskCanvas.rect(0, 0, width, height);
  maskCanvas.erase();
  maskCanvas.ellipse(centerX, centerY, radius * 2);
  maskCanvas.noErase();

  blendMode(REMOVE);
  image(maskCanvas, 0, 0);
  blendMode(BLEND);
}