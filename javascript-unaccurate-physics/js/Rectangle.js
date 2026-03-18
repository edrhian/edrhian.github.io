import Vector from "./Vector.js";
// TODO: Separate X and Y Velocity, Acceleration and ReboundMult
class Rectangle {
    constructor(x = 0, y = 0, width = 1, height = 1, initVelocity = 0, initAngle = 0, acceleration = Vector(0, 0), reboundMult = Vector(0, 0), color = "blue", playArea) {
        this.width = width;
        this.height = height;

        this.pos = new Vector(x, y);
        this.velocity = new Vector(0, 0);
        this.velocity.calcAngledVector(initVelocity, initAngle);
        // this.angle = angle;
        this.acceleration = acceleration;
        this.reboundMult = reboundMult;
        this.collided = false;

        this.color = color;
        this.playArea = playArea;
        this.ctx = playArea.ctx;
        this.interval = setInterval(() => { this.tick(); }, 20);
    }

    draw() {
        this.ctx.fillStyle = this.color;
        this.ctx.fillRect(this.pos.x, this.pos.y, this.width, this.height);
    }

    checkOffLimits() {
        const boundX = this.playArea.width;
        const boundY = this.playArea.height;

        let offSide = [];
        // Right bounds
        if (this.pos.x + this.width > boundX) {
            // console.log("rightbound");
            this.pos.x = boundX - this.width;
            offSide.push("R");
        }
        // Down bounds
        if (this.pos.y + this.height > boundY) {
            // console.log("downbound");
            this.pos.y = boundY - this.height;
            offSide.push("D");
        }
        // Left bounds
        if (this.pos.x < 0) {
            // console.log("leftbound");
            this.pos.x = 0;
            offSide.push("L");
        }
        // Up bounds
        if (this.pos.y < 0) {
            // console.log("upbound");
            this.pos.y = 0;
            offSide.push("U");
        }
        return offSide;
    };

    rebound(sides) {
        if (sides.includes("R")) {
            this.velocity.x *= this.reboundMult.x;
            this.velocity.x *= -1;
        }
        if (sides.includes("D")) {
            this.velocity.y *= this.reboundMult.y;
            this.velocity.y *= -1;
        }
        if (sides.includes("L")) {
            this.velocity.x *= this.reboundMult.x;
            this.velocity.x *= -1;
        }
        if (sides.includes("U")) {
            this.velocity.y *= this.reboundMult.y;
            this.velocity.y *= -1;
        }
    }

    friction(offSides) {
        if (!offSides.includes("D")) return;

        this.velocity.x -= this.velocity.x * this.playArea.friction;
    }

    tick() {
        const offSides = this.checkOffLimits();

        if (offSides) {
            this.rebound(offSides);
            this.friction(offSides);
        }

        // Acceleracion
        this.velocity.sumVector(this.acceleration);
        this.pos.sumVector(this.velocity);
    }
}

export default Rectangle;
