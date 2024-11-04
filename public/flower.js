class Flower {
    constructor(name, color, petalSize, petalCount, height, leafPositions, xPos, startTime) {
        this.name = name;
        this.color = color;
        this.petalSize = petalSize;
        this.petalCount = petalCount;
        this.height = height;
        this.leafPositions = leafPositions;
        this.xPos = xPos;
        this.rightOffset = 6;
        this.growthSpeed = 5;
    }


    draw() {
        console.log("Drawing flower with xPos:", this.xPos);

        // Draw stem first
        let finalPos = this.drawStem(this.xPos, this.height);
    
        // Draw flower head at final position
        noStroke();
        fill(this.color);
        if(finalPos.x==undefined) finalPos.x = width/2;

        // Draw petals at final position
        for (let angle = 0; angle < TWO_PI; angle += TWO_PI/this.petalCount) {
            let petalX = finalPos.x + cos(angle) * this.petalSize/2;
            let petalY = finalPos.y + sin(angle) * this.petalSize/2;
            circle(petalX, petalY, this.petalSize/2);
        }
        
        // Draw center of flower at final position
        fill(255, 220, 0);
        circle(finalPos.x, finalPos.y, this.petalSize/2);
        
        // Draw username at final position
        fill(0);
        textAlign(CENTER, BOTTOM);
        text(this.name, finalPos.x, finalPos.y - this.petalSize/2 - 5);

        // // Draw leaves
        // this.leafPositions.forEach(pos => {
        //     this.drawLeaf(pos.x, pos.y, pos.up, pos.isLeft);
        // });
    }
    
    drawStem(x, length) {
        stroke(0);
        strokeWeight(2);
        noFill();
        console.log("Drawing stem with x:", x);
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
                    if (random() < 0.1) {
                        this.leafPositions.push({ 
                            x: currentX, 
                            y: currentY, 
                            up: goingUp,
                            isLeft: random() < 0.5 
                        });
                    }
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
        console.log("Final position:", finalPosition);
        return finalPosition;
    }
    
    drawLeaf(x, y, goingUp, isLeft) {
        push();
        translate(x, y);
        
        fill(34, 139, 34);
        noStroke();
        
        let angle = isLeft ? PI : 0;
        if (!goingUp) angle = isLeft ? PI/2 : -PI/2;
        
        rotate(angle);
        
        beginShape();
        vertex(0, 0);
        bezierVertex(10, -10, 20, -10, 30, 0);
        bezierVertex(20, 10, 10, 10, 0, 0);
        endShape(CLOSE);
        
        pop();
    }

    update(data) {
        this.height = data.height;
        this.xPos = data.xPos;
        this.leafPositions = data.leafPositions;
        // Optionally update other properties if needed
        this.color = data.color || this.color;
        this.petalSize = data.petalSize || this.petalSize;
        this.petalCount = data.petalCount || this.petalCount;
        this.name = data.name || this.name;
        
        console.log("Updated flower:", this.name, "height:", this.height, "xPos:", this.xPos);
    }
}

