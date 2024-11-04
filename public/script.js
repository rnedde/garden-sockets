const backgroundCanvas = document.getElementById('backgroundCanvas');
const bgCtx = backgroundCanvas.getContext('2d');

const sceneCanvas = document.getElementById('sceneCanvas');
const ctx = sceneCanvas.getContext('2d');


// Set canvas dimensions and make it responsive
function resizeCanvas() {
    backgroundCanvas.width = window.innerWidth;
    backgroundCanvas.height = window.innerHeight;
    sceneCanvas.width = window.innerWidth;
    sceneCanvas.height = window.innerHeight;

    drawBackground(); // Draw background color
    drawScene();      // Draw scene with occlusion frame
}

window.addEventListener('resize', resizeCanvas);
resizeCanvas();

function drawBackground() {
    // Set the background color outside the frame
    bgCtx.fillStyle = 'rgba(166, 184, 177, .2)'; // Color for the area outside the frame
    bgCtx.fillRect(0, 0, backgroundCanvas.width, backgroundCanvas.height);
}

function drawSky() {
    const gradient = ctx.createLinearGradient(0, sceneCanvas.height, 0, 0);
    gradient.addColorStop(0, '#654ea3');   // Dark purple at the top
    gradient.addColorStop(1, '#fcf3d8');   // Light pink at the horizon

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, sceneCanvas.width, sceneCanvas.height);
}

function drawMoon() {
    const moonX = sceneCanvas.width * 0.6;
    const moonY = sceneCanvas.height * 0.25;
    const moonRadius = sceneCanvas.width * 0.05;

    ctx.fillStyle = '#FFEFBA';
    ctx.beginPath();
    ctx.arc(moonX, moonY, moonRadius, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = 'rgba(255, 229, 145, 0.5)';
    ctx.beginPath();
    ctx.arc(moonX - moonRadius * 0.3, moonY - moonRadius * 0.2, moonRadius * 0.2, 0, Math.PI * 2);
    ctx.fill();

    ctx.beginPath();
    ctx.arc(moonX + moonRadius * 0.4, moonY + moonRadius * 0.2, moonRadius * 0.3, 0, Math.PI * 2);
    ctx.fill();

    ctx.beginPath();
    ctx.arc(moonX - moonRadius * 0.5, moonY + moonRadius * 0.4, moonRadius * 0.15, 0, Math.PI * 2);
    ctx.fill();
}

function drawHills() {
    const hillWidth1 = sceneCanvas.width * 0.4;
    const hillHeight1 = sceneCanvas.height * 0.2;
    const hillWidth2 = sceneCanvas.width * 0.35;
    const hillHeight2 = sceneCanvas.height * 0.18;

    const backHillGradient = ctx.createRadialGradient(
        sceneCanvas.width * 0.3, sceneCanvas.height * 0.75, hillWidth1 * 0.25,
        sceneCanvas.width * 0.3, sceneCanvas.height * 0.75, hillWidth1
    );
    backHillGradient.addColorStop(0, '#475500');
    backHillGradient.addColorStop(1, '#495A47');

    ctx.fillStyle = backHillGradient;
    ctx.beginPath();
    ctx.ellipse(sceneCanvas.width * 0.3, sceneCanvas.height * 0.75, hillWidth1, hillHeight1, 0, 0, Math.PI * 2);
    ctx.fill();

    const frontHillGradient = ctx.createRadialGradient(
        sceneCanvas.width * 0.7, sceneCanvas.height * 0.8, hillWidth2 * 0.25,
        sceneCanvas.width * 0.7, sceneCanvas.height * 0.8, hillWidth2
    );
    frontHillGradient.addColorStop(0, '#7dbb89');
    frontHillGradient.addColorStop(1, '#5fa973');

    ctx.fillStyle = frontHillGradient;
    ctx.beginPath();
    ctx.ellipse(sceneCanvas.width * 0.7, sceneCanvas.height * 0.8, hillWidth2, hillHeight2, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = 'rgba(60, 120, 80, 0.3)';
    ctx.beginPath();
    ctx.ellipse(sceneCanvas.width * 0.59, sceneCanvas.height * 0.85, hillWidth2 * 0.6, hillHeight2 * .7, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.beginPath();
    ctx.ellipse(sceneCanvas.width * 0.4, sceneCanvas.height * 0.8, hillWidth1 * 0.5, hillHeight1 * 1, 0, 0, Math.PI * 2);
    ctx.fill();
}

function drawOcclusionFrame() {
    ctx.save();
    ctx.globalCompositeOperation = 'destination-in';

    const frameRadius = Math.min(sceneCanvas.width, sceneCanvas.height) * 0.4;
    ctx.beginPath();
    ctx.arc(sceneCanvas.width / 2, sceneCanvas.height / 2, frameRadius, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
}

function drawScene() {
    drawSky();
    drawMoon();
    drawHills();
    drawOcclusionFrame();
}

drawBackground(); // Initial background draw
drawScene();      // Initial scene draw