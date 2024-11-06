//flower class with working log function

class Flower {
    
        constructor(name, color, petalSize, petalCount, initialHeight, xPos, baseY, topY) {
            this.name = name;
            this.color = color;
            this.petalSize = petalSize;
            this.petalCount = petalCount;
            this.height = initialHeight;
            this.xPos = xPos;
            this.baseY = baseY;
            this.topY = topY;
            this.rightOffset = 6;
            this.maxHeight = height * 0.8;
            this.growthRate = 0.00005;
        }
    

    // Update the height using a logarithmic-like function
    grow() {
        this.height += this.growthRate * (this.maxHeight - this.height);
    }

    draw() {
        // Draw stem first
        let finalPos = this.drawStem(this.xPos * width, this.height);

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
        textFont('Courier New');
        text(this.name, finalPos.x, finalPos.y - this.petalSize / 2 - 10);
    }

    drawStem(x, length) {
        stroke(10,150,0);
        strokeWeight(4);
        noFill();
        let currentX = x;
        let currentY = this.baseY;
        let goingUp = true;
        let finalPosition = { x: currentX, y: currentY };

        beginShape();
        curveVertex(currentX, this.baseY);  // Start point
        curveVertex(currentX, this.baseY);  // Repeat for curve smoothing

        let progress = length;
        let segmentLength = 200;  // Length of each up/down segment

        while (progress > 0) {
            if (goingUp) {
                let segmentEnd = currentY - min(progress, segmentLength);
                // Create gentle upward S-curve
                curveVertex(currentX - 10, currentY - (currentY - segmentEnd) / 3);
                curveVertex(currentX + 10, currentY - (currentY - segmentEnd) * 2 / 3);
                curveVertex(currentX, segmentEnd);

                currentY = segmentEnd;
                if (currentY <= this.topY + this.petalSize * 3) {
                    currentX += this.rightOffset;
                    goingUp = false;
                }
            } else {
                let segmentEnd = currentY + min(progress, segmentLength);
                // Create gentle downward S-curve
                curveVertex(currentX - 10, currentY + (segmentEnd - currentY) / 3);
                curveVertex(currentX + 10, currentY + (segmentEnd - currentY) * 2 / 3);
                curveVertex(currentX, segmentEnd);

                currentY = segmentEnd;
                if (currentY >= this.baseY) {
                    currentX += this.rightOffset;
                    goingUp = true;
                }
            }
            progress -= min(progress, segmentLength);
            finalPosition = { x: currentX, y: currentY };
        }

        curveVertex(currentX, currentY);  // Repeat end point for curve smoothing
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