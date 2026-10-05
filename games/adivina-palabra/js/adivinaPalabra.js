// Elementos
const btnAdivinarPalabra = document.querySelector("#boton");
const divInputs = document.querySelector(".inputs");
const spanPista = document.querySelector(".pista>span");
const spanIntentosRestantes = document.querySelector(".restantes>span");
const spanLetrasErroneas = document.querySelector(".letrasErroneas>span");
const divMostraResultado = document.querySelector(".mostra");
const inputLletra = document.querySelector(".lletra");

// Variables
let indexPalabraAleatoria;
indexPalabraAleatoria = getRandomInt(0, listado.length);

let palabraObject;
palabraObject = listado[indexPalabraAleatoria];

let palabra = palabraObject["palabra"];

let intentosRestantes;
if (palabra.length >= 7) {
    intentosRestantes = 8;
} else {
    intentosRestantes = 6;
}
let estadoJuego = "jugando";
let arrletrasErroneas;
arrletrasErroneas = [];

// Son las letras que ha adivinado el jugador
let adivina;
adivina = [];
for (let i = 0; i < palabra.length; i++) {
    adivina.push("");
}

// Crea las celdas para cada letra
divInputs.innerHTML = "";
for (let i = 0; i < palabra.length; i++) {
    divInputs.innerHTML += `<div id="letra${i}" class="celda ajustable" tabindex="0"></div>`;
}
// Muestra info inicial
spanPista.innerHTML = `${palabraObject["pista"]}`;
spanIntentosRestantes.innerHTML = `${intentosRestantes}`;


// FUNCIONES
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random#examples
function getRandomInt(min, max) {
    const minCeiled = Math.ceil(min);
    const maxFloored = Math.floor(max);
    return Math.floor(Math.random() * (maxFloored - minCeiled) + minCeiled);
}

// Mira si la letra esta en la palabra y devuelve las coincidencias (con los index)
function checkLetra(letraElegida) {
    let reg = new RegExp(letraElegida, 'g');
    let matches = [...palabra.matchAll(reg)];
    return matches;
};

function isWinOrLose() {
    if (!adivina.includes('')) {
        winGame();
        estadoJuego = "ganado";
        return true;
    }
    if (intentosRestantes <= 0) {
        loseGame();
        estadoJuego = "perdido";
        return true;
    }
    return false;
}

function loseGame() {
    divMostraResultado.innerHTML = msgError[getRandomInt(0, msgError.length)];
    divMostraResultado.style.color = "red";
    for (let i = 0; i < adivina.length; i++) {
        if (adivina[i] == '') {
            const outLetra = document.querySelector(`#letra${i}`);
            outLetra.innerHTML = palabra[i].toUpperCase();
            outLetra.style.color = "red";
        }
    }
    return false;
}

function winGame() {
    divMostraResultado.innerHTML = msg[getRandomInt(0, msg.length)];
    divMostraResultado.style.color = "green";
    spanIntentosRestantes.innerHTML = "Haz click en Adivinar palabra para volver a empezar";
    spanIntentosRestantes.style.color = "green";
    return true;
}

// Solo aceptamos Letras y numeros
// Evita que teclas especiales (Tab, Shift, etc.) se detecten en el juego
function isCharValid(letraElegida) {
    let x = letraElegida.match(/^[A-Za-z0-9]$/);

    return x;
}

// Gestion del focus al input
// Se gestiona con el documento entero
document.addEventListener("keydown", (e) => {
    const letraElegida = e["key"];

    if (letraElegida == "ArrowUp") {
        if (accessActivado) aumentarFuente();
        return false;
    }

    if (letraElegida == "ArrowDown") {
        if (accessActivado) disminuirFuente();
        return false;
    }


    // Si aún no se ha ganado
    if (estadoJuego != "jugando") return false;

    // Si no es una tecla especial o un caracter especial
    if (!isCharValid(letraElegida)) return false;

    // Si la letra ya se habia elegido antes
    if (adivina.includes(letraElegida) || arrletrasErroneas.includes(letraElegida)) return false;

    const matches = checkLetra(letraElegida);

    // Si la letra elegida no esta en la palabra
    if (!matches.length > 0) {
        arrletrasErroneas.push(letraElegida);
        spanLetrasErroneas.innerHTML += `${letraElegida}, `;
        intentosRestantes -= 1;
        spanIntentosRestantes.innerHTML = `${intentosRestantes}`;
    }

    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/matchAll#examples
    // Actualiza las celdas con la letra
    for (const match of matches) {
        adivina[match.index] = letraElegida;
        const outLetra = document.querySelector(`#letra${match.index}`);
        outLetra.innerHTML = letraElegida.toUpperCase();
        outLetra.style.color = "green";
    }
    isWinOrLose();
    return true;
});

const btnAccesibilidad = document.querySelector("#accesibilidad");
const btnContraste = document.querySelector("#contraste");
const btnAumentar = document.querySelector("#aumentar");
const btnDisminuir = document.querySelector("#disminuir");

// ACCESIBILIDAD
// Todos los elementos con tamaño ajustable
const allAjustable = document.querySelectorAll(".ajustable");

let accessActivado = false;
let contrasteActivado = false;

btnAdivinarPalabra.addEventListener("click", () => {
    location.reload();
});

// Mostrar menu accesibilidad
btnAccesibilidad.addEventListener("click", () => {
    if (accessActivado) {
        btnAumentar.classList.add("hidden");
        btnDisminuir.classList.add("hidden");
        btnContraste.classList.add("hidden");
    } else {
        btnAumentar.classList.remove("hidden");
        btnDisminuir.classList.remove("hidden");
        btnContraste.classList.remove("hidden");
    }
    accessActivado = !accessActivado;
});

btnContraste.addEventListener("click", () => {
    contrasteActivado = !contrasteActivado;
    if (contrasteActivado) {
        const pAll = document.querySelectorAll("p");

        pAll.forEach(element => {
            element.style.color = "white";
        });

        const h2 = document.querySelector("h2");
        h2.style.color = "white";

        const body = document.querySelector("body");
        body.style.backgroundColor = "black";
    } else {
        const pAll = document.querySelectorAll("p");

        pAll.forEach(element => {
            element.style.color = "black";
        });

        const h2 = document.querySelector("h2");
        h2.style.color = "black";

        const body = document.querySelector("body");
        body.style.backgroundColor = "white";
    }
});

// Uso como referencia el font-size de las "p" para calcular el 200%
const originalSize = parseFloat(window.getComputedStyle(document.querySelector("p")).getPropertyValue('font-size'));
const maxSize = originalSize * 2;
const minSize = originalSize;
let currRelativeSize = originalSize;

// Por cuantos px aumenta o disminuye
const flatValue = 3;

function aumentarFuente() {
    if (currRelativeSize > maxSize) {
        return;
    }
    allAjustable.forEach(element => {
        let currSize = window.getComputedStyle(element).getPropertyValue('font-size');
        currSize = parseFloat(currSize);
        element.style.fontSize = `${currSize + flatValue}px`;

        if (element.classList.contains("celda")) {
            let currWidth = window.getComputedStyle(element).getPropertyValue('width');
            currWidth = parseFloat(currWidth);

            let currHeight = window.getComputedStyle(element).getPropertyValue('height');
            currHeight = parseFloat(currHeight);

            element.style.width = `${currWidth + flatValue}px`;
            element.style.height = `${currHeight + flatValue}px`;
        }
    });
    currRelativeSize += flatValue;
}

function disminuirFuente() {
    if (currRelativeSize <= minSize) {
        return;
    }
    allAjustable.forEach(element => {
        let currSize = window.getComputedStyle(element).getPropertyValue('font-size');
        currSize = parseFloat(currSize);
        element.style.fontSize = `${currSize - flatValue}px`;

        if (element.classList.contains("celda")) {
            let currWidth = window.getComputedStyle(element).getPropertyValue('width');
            currWidth = parseFloat(currWidth);

            let currHeight = window.getComputedStyle(element).getPropertyValue('height');
            currHeight = parseFloat(currHeight);

            element.style.width = `${currWidth - flatValue}px`;
            element.style.height = `${currHeight - flatValue}px`;
        }
    });
    currRelativeSize -= flatValue;
}

btnAumentar.addEventListener("click", aumentarFuente);
btnDisminuir.addEventListener("click", disminuirFuente);
