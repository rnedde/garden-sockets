class Flower {
    constructor(name, color, petalSize, petalCount, height, xPos) {
        this.name = name;
        this.color = color;
        this.petalSize = petalSize;
        this.petalCount = petalCount;
        this.height = height;
        this.xPos = xPos;
        this.rightOffset = 6;
    }


    draw() {
        // Draw stem first
        let finalPos = this.drawStem(this.xPos, this.height);

        // Draw flower head at final position
        noStroke();
        fill(this.color);
        if (finalPos.x == undefined) finalPos.x = width / 2;

        // Draw petals at final position
        for (let angle = 0; angle < TWO_PI; angle += TWO_PI / this.petalCount) {
            let petalX = finalPos.x + cos(angle) * this.petalSize / 2;
            let petalY = finalPos.y + sin(angle) * this.petalSize / 2;
            circle(petalX, petalY, this.petalSize / 2);
        }

        // Draw center of flower at final position
        fill(255, 220, 0);
        circle(finalPos.x, finalPos.y, this.petalSize / 2);

        // Draw username at final position
        fill(0);
        textAlign(CENTER, BOTTOM);
        text(this.name, finalPos.x, finalPos.y - this.petalSize / 2 - this.petalSize / 10);

    }

    drawStem(x, length) {
        stroke(this.color);
        strokeWeight(4);
        noFill();
        let currentX = x;
        let currentY = height;
        let goingUp = true;
        let finalPosition;

        beginShape();
        curveVertex(currentX, height);  // Start point
        curveVertex(currentX, height);  // Repeat for curve smoothing
        
        if (length <= height) {
            // Add some gentle curves for short stems
            curveVertex(currentX - 10, height - length/3);
            curveVertex(currentX + 10, height - length*2/3);
            curveVertex(currentX, height - length);
            curveVertex(currentX, height - length);
            finalPosition = { x: currentX, y: height - length };
        } else {
            let progress = length;
            let segmentStart = height;
            let waveAmount = 500;  // How much the stem waves left and right

            while (progress > 0) {
                if (goingUp) {
                    currentY = height - min(progress, height);
                    // Add wavy effect
                    curveVertex(currentX + sin(currentY/50) * waveAmount, currentY);
                    if (currentY <= 0) {
                        currentX += this.rightOffset;
                        curveVertex(currentX, currentY);
                        goingUp = false;
                        segmentStart = 0;
                    }
                } else {
                    let distanceFromTop = min(progress, height);
                    currentY = segmentStart + distanceFromTop;
                    curveVertex(currentX, currentY);
                    if (currentY >= height) {
                        currentX += this.rightOffset;
                        curveVertex(currentX, currentY);
                        goingUp = true;
                        segmentStart = height;
                    }
                }
                progress -= min(progress, height);
                finalPosition = { x: currentX, y: currentY };
            }
        }
        endShape();
        return finalPosition;
    }

    update(data) {
        this.height = data.height;
        this.xPos = data.xPos;

        this.color = data.color || this.color;
        this.petalSize = data.petalSize || this.petalSize;
        this.petalCount = data.petalCount || this.petalCount;
        this.name = data.name || this.name;

    }
}

