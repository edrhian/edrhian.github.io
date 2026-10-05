function degreesToRadians(degrees) {
    return degrees * (Math.PI / 180);
}

class Vector {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    sumUnit(unit) {
        this.x += unit;
        this.y += unit;
    }

    sumVector(vector) {
        this.x += vector.x;
        this.y += vector.y;
    }

    multUnit(unit) {
        this.x *= unit;
        this.y *= unit;
    }

    multVector(vector) {
        this.x *= vector.x;
        this.y *= vector.y;
    }

    calcAngledVector(unit, angle) {
        this.x += unit * Math.cos(degreesToRadians(angle));
        this.y += unit * Math.sin(degreesToRadians(angle));
    }
}

export default Vector;
