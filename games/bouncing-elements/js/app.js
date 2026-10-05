const html = document.documentElement;
const body = document.querySelector("body");
const btnEsconder = document.querySelector("#esconder");

let bouncingObjects = [];

// Auxiliar
function getRandomInt(min, max) {
    const minCeiled = Math.ceil(min);
    const maxFloored = Math.floor(max);
    return Math.floor(Math.random() * (maxFloored - minCeiled) + minCeiled); // The maximum is exclusive and the minimum is inclusive
}

class BouncingElement {
    constructor(color = "red", height = 30, width = 30, posVector = [0, 0], movVector = [1, 1]) {
        this.color = color;
        this.height = height;
        this.width = width;
        this.maxPosVector = [100000, 100000];
        this.posVector = posVector;
        this.movVector = movVector;
        // Link object with a HTML element
        this.element = this.build();
        this.interval = setInterval(() => { this.tick(); }, 15);
    }

    // Create a HTML element for this object
    build() {
        const divElement = document.createElement("div");
        divElement.classList.add("bouncing-div");
        divElement.style.height = `${this.height}px`;
        divElement.style.width = `${this.width}px`;
        divElement.style.backgroundColor = `${this.color}`;
        divElement.style.left = `${this.posVector[0]}px`;
        divElement.style.top = `${this.posVector[1]}px`;

        return divElement;
    }

    destroy() {
        clearInterval(this.interval);
        this.element.remove();
    }

    // Limit Position and change direction
    checkOffLimits() {
        let offSetHeight = Math.max(body.offsetHeight,
            html.clientHeight, html.offsetHeight);

        this.maxPosVector[0] = body.offsetWidth - this.width;
        this.maxPosVector[1] = offSetHeight - this.height;

        for (let i = 0; i < 2; i++) {
            // Lower and right bounds
            if (this.posVector[i] >= this.maxPosVector[i]) {
                this.posVector[i] = this.maxPosVector[i];
                this.movVector[i] *= -1;
            }
            // Upper and left bounds
            if (this.posVector[i] <= 0) {
                this.posVector[i] = 0;
                this.movVector[i] *= -1;
            }
        }
    };

    // Move the element
    tick() {
        this.checkOffLimits();

        this.posVector[0] += this.movVector[0];
        this.posVector[1] += this.movVector[1];

        this.element.style.left = `${this.posVector[0]}px`;
        this.element.style.top = `${this.posVector[1]}px`;
    }
}

window.addEventListener("load", () => {
    // let bouncingObjects = [
    //     new BouncingElement("red", 30, 30, [0, 0], [1, 1]),
    //     new BouncingElement("blue", 35, 35, [30, 20], [1, 2]),
    //     new BouncingElement("green", 50, 50, [150, 150], [3, 2]),
    //     // new BouncingElement("black", 35, 35, [150, 150], [3, 0])
    // ];

    // bouncingObjects.forEach(bObj => {
    //     body.appendChild(bObj.element);
    // });
});

const crearAleatorio = (e) => {
    const color = `rgb(${getRandomInt(0, 256)},${getRandomInt(0, 256)},${getRandomInt(0, 256)})`;
    const size = getRandomInt(10, 50);
    let xPos;
    let yPos;

    if (e) {
        xPos = e.x;
        yPos = e.y;
    } else {
        let offSetHeight = Math.max(body.offsetHeight,
            html.clientHeight, html.offsetHeight);
        xPos = getRandomInt(0, body.offsetWidth - size);
        yPos = getRandomInt(0, offSetHeight - size);
    }

    const xMov = parseFloat(getRandomInt(-5001, 5001) / 1000);
    const yMov = parseFloat(getRandomInt(-5001, 5001) / 1000);
    // console.log(x, y);
    let ob = new BouncingElement(color, size, size, [xPos, yPos], [xMov, yMov]);
    body.appendChild(ob.element);
    bouncingObjects.push(ob);
};

document.addEventListener("click", (e) => {
    if (e.target === btnEsconder) return;
    crearAleatorio(e);
});

btnEsconder.addEventListener("click", () => {
    const h1 = document.querySelector("h1");
    const p = document.querySelector("p");
    h1.classList.add("hidden");
    p.classList.add("hidden");
    btnEsconder.classList.add("hidden");
});

document.addEventListener("keyup", (e) => {
    if (e.key === "Backspace") {
        bouncingObjects.forEach(bObj => bObj.destroy());
        bouncingObjects = [];
    } else {
        crearAleatorio();
    }
});
