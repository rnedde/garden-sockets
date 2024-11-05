let socket;
let userName;

let color;
let users = {};
let currentFlower;
let baseY;
let topY;
let colorPicker;
let popupActive = true;

let growthInterval = 500;
let growthSpeed = 0.1;
let petalGrowthSpeed = 1;

let initialFlowerHeight = 0;
let initialFlowerPetalSize = 40;
let initialFlowerPetalCount = 8;
let defaultFlowerColor = 'red';

let maskCanvas;
let maskRadius;

let flowerPositions = {};  // Store angle and radius percentage for each flower

function setup() {
  createCanvas(windowWidth, windowHeight);
  maskCanvas = createGraphics(windowWidth, windowHeight);
  background(255);

  // Calculate mask radius and initial height
  updateMaskRadius();
  baseY = height/2 + maskRadius; // Set to bottom of circle
  topY = height/2 - maskRadius; // Set to top of circle
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
  updateMaskRadius();
  baseY = height/2 + maskRadius;
  topY = height/2 - maskRadius;

  // Update the positions of all flowers using stored angles and percentages
  for (let id in users) {
    if (flowerPositions[id]) {
      users[id].xPos = width/2 + cos(flowerPositions[id].angle) * (maskRadius * flowerPositions[id].radiusPercentage);
      users[id].height = initialFlowerHeight;
      users[id].baseY = baseY;
      users[id].topY = topY;
    }
  }

  applyMask();
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
    
    // Generate random angle and radius percentage
    const angle = random(PI/4, 3*PI/4);
    const radiusPercentage = random(0, 0.9); // 0 to 90% of mask radius
    
    // Calculate actual x position
    const xPosition = width/2 + cos(angle) * (maskRadius * radiusPercentage);

    // Store the position data
    flowerPositions[socket.id] = {
      angle: angle,
      radiusPercentage: radiusPercentage
    };

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
        data.xPos,
        baseY,
        topY
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

  const centerX = width / 2;
  const centerY = height / 2;

  maskCanvas.rect(0, 0, width, height);
  maskCanvas.erase();
  maskCanvas.ellipse(centerX, centerY, maskRadius * 2);
  maskCanvas.noErase();

  blendMode(REMOVE);
  image(maskCanvas, 0, 0);
  blendMode(BLEND);
}

function updateMaskRadius() {
  maskRadius = min(width, height) * 0.4;
}