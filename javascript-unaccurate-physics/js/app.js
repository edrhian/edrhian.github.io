import PlayArea from "./PlayArea.js";
import Rectangle from "./Rectangle.js";
import Vector from "./Vector.js";

const inputGravedad = document.querySelector("#gravedad");
const inputFriccion = document.querySelector("#friccion");
const inputReboteX = document.querySelector("#rebote_x");
const inputReboteY = document.querySelector("#rebote_y");
const inputVelocidadImpulso = document.querySelector("#v_impulso");

const playArea = new PlayArea(600, 600, 0.02);
// const main = document.querySelector("main");
// main.appendChild(playArea.element);
const divReserve = document.querySelector("#reserve");
divReserve.appendChild(playArea.element);
const sq1 = new Rectangle(300, 300, 30, 30, 3, 270, new Vector(0, 0.3), new Vector(1, 0.9), "red", playArea);
sq1.draw();

setInterval(() => {
    playArea.clear();
    sq1.draw();
}, 20);

// Inputs
inputGravedad.addEventListener("input", () => {
    const val = parseFloat(inputGravedad.value);
    if (!isNaN(val)) {
        sq1.acceleration.y = val;
    }
});

inputFriccion.addEventListener("input", () => {
    const val = parseFloat(inputFriccion.value);
    if (!isNaN(val)) {
        playArea.friction = val;
    }
});

inputReboteX.addEventListener("input", () => {
    const val = parseFloat(inputReboteX.value);
    if (!isNaN(val)) {
        sq1.reboundMult.x = val;
    }
});

inputReboteY.addEventListener("input", () => {
    const val = parseFloat(inputReboteY.value);
    if (!isNaN(val)) {
        sq1.reboundMult.y = val;
    }
});

// Movement
document.addEventListener("keydown", (e) => {
    // console.log(e.key);
    const key = e.key;
    const v = parseFloat(inputVelocidadImpulso.value);

    if (key == "ArrowUp") {
        sq1.velocity.y = -v;
    }
    if (key == "ArrowRight") {
        sq1.velocity.x = v;
    }
    if (key == "ArrowDown") {
        sq1.velocity.y = v;
    }
    if (key == "ArrowLeft") {
        sq1.velocity.x = -v;
    }
    sq1.checkOffLimits();
    playArea.clear();
    sq1.draw();
});

let tpTimeout = null;
let holding = false;
let cursorX = 0;
let cursorY = 0;

let cursorXLast = cursorX;
let cursorYLast = cursorY;

// Mover el cubo a la posicion del cursor
function justTp(e) {
    const playAreaLeft = playArea.element.getBoundingClientRect().left;
    const playAreaTop = playArea.element.getBoundingClientRect().top;

    const realX = cursorX - playAreaLeft;
    const realY = cursorY - playAreaTop;

    sq1.pos.x = realX - sq1.width / 2;
    sq1.pos.y = realY - sq1.height / 2;

    sq1.velocity.x = 0;
    sq1.velocity.y = 0;
}

function startTp(e) {
    if (e) {
        cursorX = e.x;
        cursorY = e.y;
    }

    holding = true;

    // Mueve el cubo si el cursor se mueve
    playArea.element.onmousemove = (e) => {
        if (!holding) return;
        cursorXLast = cursorX;
        cursorYLast = cursorY;
        cursorX = e.x;
        cursorY = e.y;

        justTp(e);
    };

    justTp(e);
    tpTimeout = setTimeout(() => {
        startTp();
    }, 10);
}

function stopTp() {
    clearTimeout(tpTimeout);
    holding = false;
}

playArea.element.addEventListener("mousedown", (e) => {
    startTp(e);
});

document.addEventListener("mouseup", () => {
    if (!holding) return;
    stopTp();
    calcVelocity();
});

// Calcula la velocidad del cubo a partir de la diferencia de distancia en el tiempo (los milisegundos del timeout)
function calcVelocity() {
    sq1.velocity.x = cursorX - cursorXLast;
    sq1.velocity.y = cursorY - cursorYLast;
    cursorX = 0;
    cursorY = 0;

    cursorXLast = cursorX;
    cursorYLast = cursorY;
}

window.onload = () => {
    inputGravedad.value = sq1.acceleration.y;
    inputFriccion.value = playArea.friction;
    inputReboteX.value = sq1.reboundMult.x;
    inputReboteY.value = sq1.reboundMult.y;
    inputVelocidadImpulso.value = 10;
};

