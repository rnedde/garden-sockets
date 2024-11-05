class Flower {
    constructor(name, color, petalSize, petalCount, initialHeight, xPos) {
        this.name = name;
        this.color = color;
        this.petalSize = petalSize;
        this.petalCount = petalCount;
        this.height = initialHeight;
        this.xPos = xPos;
        this.rightOffset = 6;
        
        // Define a max height the flower can asymptotically approach
        this.maxHeight = height * 0.8;  // Set max height to 90% of canvas height
        this.growthRate = 0.0001; // Adjust this value to control the growth speed
    }

    // Update the height using a logarithmic-like function
    grow() {
        this.height += this.growthRate * (this.maxHeight - this.height);
    }

    draw() {
        // Draw stem first
        let finalPos = this.drawStem(this.xPos, this.height);

        // Draw flower head at final position
        noStroke();
        fill(this.color);
        if (finalPos.x === undefined) finalPos.x = width / 2;

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
        stroke(0);
        strokeWeight(2);
        noFill();
        let currentX = x;
        let currentY = height;
        let goingUp = true;
        let finalPosition;

        beginShape();
        vertex(currentX, height);

        if (length <= height) {
            currentY = height - length;
            vertex(currentX, currentY);
            finalPosition = { x: currentX, y: currentY };
        } else {
            let progress = length;
            let segmentStart = height;

            while (progress > 0) {
                if (goingUp) {
                    currentY = height - min(progress, height);
                    vertex(currentX, currentY);
                    if (currentY <= 0) {
                        currentX += this.rightOffset;
                        vertex(currentX, currentY);
                        goingUp = false;
                        segmentStart = 0;
                    }
                } else {
                    let distanceFromTop = min(progress, height);
                    currentY = segmentStart + distanceFromTop;
                    vertex(currentX, currentY);
                    if (currentY >= height) {
                        currentX += this.rightOffset;
                        vertex(currentX, currentY);
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
        this.xPos = data.xPos;
        this.color = data.color || this.color;
        this.petalSize = data.petalSize || this.petalSize;
        this.petalCount = data.petalCount || this.petalCount;
        this.name = data.name || this.name;
    }
}
