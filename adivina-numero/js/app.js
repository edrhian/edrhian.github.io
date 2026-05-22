// ELEMENTOS Y VARIABLES
// Paso 1
const divPaso1 = document.querySelector("#paso1");
const inputNombre = document.querySelector("#nombre");
const btnContinuar1 = document.querySelector("#continuar1");
const smallError1 = document.querySelector("#error1");
let nombre;
// Paso 2
const divPaso2 = document.querySelector("#paso2");
const pEnunciado = document.querySelector("#enunciado");
const divNum1 = document.querySelector("#num1");
const inputNumMin = document.querySelector("#numMin");
const btnContinuar2 = document.querySelector("#continuar2");
const smallError2 = document.querySelector("#error2");
const divNum2 = document.querySelector("#num2");
const inputNumMax = document.querySelector("#numMax");
const btnContinuar3 = document.querySelector("#continuar3");
const smallError3 = document.querySelector("#error3");
let numMin;
let numMax;
// JuegoBtns
const divJuegoBtns = document.querySelector("#juegoBtns");
let numAleatorio;
const sectionError4 = document.querySelector("#error4");

const divDeNuevo = document.querySelector("#deNuevo");
const btnReset = document.querySelector("#reset");
const btnNo = document.querySelector("#no");

// Accesibilidad
const divBtnContrast = document.querySelector("#contraste");
const btnDisminuir = document.querySelector("#disminuir");
const btnAumentar = document.querySelector("#aumentar");
let contrasteActivado = false;

// FUNCIONES AUXILIARES
// Mira si hay algun numero en el string (se puede sustituir por regex)
function anyDigit(str) {
    for (let i = 0; i < 10; i++) {
        if (str.includes(i)) {
            return true;
        }
    }
    return false;
}
// Da un int aleatorio entre min(incluido) y max (excluido)
function getRandomInt(min, max) {
    const minCeiled = Math.ceil(min);
    const maxFloored = Math.floor(max);
    return Math.floor(Math.random() * (maxFloored - minCeiled) + minCeiled);
}

// ONLOAD
window.addEventListener("DOMContentLoaded", () => {
    if (sessionStorage.getItem("nombre") != "") {
        inputNombre.value = sessionStorage.getItem("nombre");
    } else {
        inputNombre.value = "";
    }
});


// PASO 1
btnContinuar1.addEventListener("click", () => {
    nombre = inputNombre.value;
    if (anyDigit(nombre) || nombre.length == 0) {
        smallError1.innerHTML = "Nombre no válido, vuelve a probar teniendo en cuenta que no puedes introducir carácteres numéricos.";
        smallError1.style.color = "red";
    } else {
        smallError1.innerHTML = `Bienvenid@ ${nombre}.`;
        smallError1.style.color = "orange";
        setTimeout(() => {
            divPaso1.classList.add("hidden");
            initPaso2();
        }, 1000);
    }
});

// PASO 2
function initPaso2() {
    divPaso2.classList.remove("hidden");
    pEnunciado.innerHTML = `Bienvenid@ ${nombre}. El juego consiste en lo siguiente: Tendrás que indicarnos un número del 1 al 10, después otro del 30 al 40 y en ese momento el juego seleccionará de manera aleatoria otro dentro del rango comprendido entre las dos cifras que has introducido. Tendrás 5 intentos para adivinarlo.`;
}

// validar si min y max estan correctos
let minOk = false;
let maxOk = false;

btnContinuar2.addEventListener("click", () => {
    numMin = parseInt(inputNumMin.value);
    if (numMin >= 1 && numMin <= 10) {
        smallError2.innerHTML = `Tu primer número es el: ${numMin}`;
        smallError2.style.color = "red";
        divNum2.classList.remove("hidden");
        minOk = true;
    } else {
        smallError2.innerHTML = `Pon un numero entre el 1 y el 10`;
        smallError2.style.color = "red";
        minOk = false;
    }
});

btnContinuar3.addEventListener("click", () => {
    numMax = parseInt(inputNumMax.value);
    if (numMax >= 30 && numMax <= 40) {
        smallError3.innerHTML = `Tu segundo número es el: ${numMax}`;
        smallError3.style.color = "red";
        maxOk = true;
    } else {
        smallError3.innerHTML = `Pon un numero entre el 30 y el 40`;
        smallError3.style.color = "red";
        maxOk = false;
    }
    if (minOk && maxOk) {
        setTimeout(() => {
            divPaso2.classList.add("hidden");
            initJuegoBtns();
        }, 1000);
    }
});


// EL JUEGO
function initJuegoBtns() {
    console.log("juego ya");
    divJuegoBtns.innerHTML += `<p class="ajustable" tabindex="0">${nombre}, tus números son el ${numMin} y el ${numMax}.</p>`;
    divJuegoBtns.innerHTML += `<p class="ajustable" tabindex="0">Adivina el número dentro de ese rango que ha pensado el juego de manera aleatoria intento 1 de 5</p>`;
    numAleatorio = getRandomInt(numMin, numMax + 1);
    console.log("Numero Aleatorio", numAleatorio);

    // Actualiza el contraste por si acaso se ha cambiado
    actualizarContraste();

    const divListaBtn = creaListaBotones(numMin, numMax);
    divJuegoBtns.appendChild(divListaBtn);

    // Set btn func
    const allBtnJugable = document.querySelectorAll(".btnJugable");
    // console.log(allBtnJugable);
    const maxIntentos = 5;
    let counterIntentos = 0;

    allBtnJugable.forEach(btn => {
        btn.addEventListener("click", () => {
            counterIntentos++;
            const numClicado = btn.innerHTML;
            if (numClicado == numAleatorio) {
                sectionError4.innerHTML = `¡Felicidades ${nombre}, has conseguido adivinar el numero aleatorio (${numAleatorio}) en ${counterIntentos} intentos!`;
                sectionError4.style.color = "green";
                disableAllBtnJugables();
                divDeNuevo.classList.remove("hidden");
                return;
            }
            if (numClicado != numAleatorio) {
                sectionError4.innerHTML = `Has elegido el ${numClicado}, tu número es ${pista(numClicado)}. Intento ${counterIntentos} de ${maxIntentos}.`;
                sectionError4.style.color = "red";
            }

            btn.disabled = true;
            if (counterIntentos == maxIntentos) {
                sectionError4.innerHTML = `Lo sentimos Pepe, has agotado tus intentos: El número era el ${numAleatorio}. ¡Suerte en tu próxima partida!`;
                sectionError4.style.color = "red";
                disableAllBtnJugables();
                divDeNuevo.classList.remove("hidden");
            }
        });
    });
};

// Volver a jugar, guarda el nombre del usuario para luego recuperarlo en el reload
btnReset.addEventListener("click", () => {
    sessionStorage.setItem("nombre", nombre);
    location.reload();
});

// Salir, eliminar el nombre del usuario, luego onload dejara vacio el input
btnNo.addEventListener("click", () => {
    location.reload();
    sessionStorage.setItem("nombre", "");
});

function creaListaBotones(numMin, numMax) {
    const divListaBtn = document.createElement("div");
    for (let i = numMin; i < numMax + 1; i++) {
        divListaBtn.innerHTML += singleBoton(i);
    }
    return divListaBtn;
};

const singleBoton = (num) => {
    return `<button class="w3-button w3-teal btnJugable ajustable" tabindex="0">${num}</button>`;
};

function pista(numClicado) {
    if (numClicado < numAleatorio) {
        return "mayor";
    } else if (numClicado > numAleatorio) {
        return "menor";
    }
}

function disableAllBtnJugables() {
    const allBtnJugable = document.querySelectorAll(".btnJugable");

    allBtnJugable.forEach(btn => {
        btn.disabled = true;
    });
}

// FUNCION ACCESIBILIDAD
divBtnContrast.addEventListener("click", () => {
    contrasteActivado = !contrasteActivado;
    actualizarContraste();
});

function actualizarContraste() {
    if (contrasteActivado) {
        const pAll = document.querySelectorAll("p");

        pAll.forEach(element => {
            element.style.color = "white";
        });

        const allLabels = document.querySelectorAll("label");

        allLabels.forEach(label => {
            label.style.color = "white";
        });

        const body = document.querySelector("body");
        body.style.backgroundColor = "#060515";
    } else {
        const pAll = document.querySelectorAll("p");

        pAll.forEach(element => {
            element.style.color = "black";
        });

        const allLabels = document.querySelectorAll("label");

        allLabels.forEach(label => {
            label.style.color = "black";
        });

        const body = document.querySelector("body");
        body.style.backgroundColor = "white";
    }
}

// Uso como referencia el font-size de las "p" para calcular el 200%
const originalSize = parseFloat(window.getComputedStyle(document.querySelector("p")).getPropertyValue('font-size'));
const maxSize = originalSize * 2;
const minSize = originalSize;
let currRelativeSize = originalSize;

// Por cuantos px aumenta o disminuye
const flatValue = 3;

function aumentarFuente() {
    // Todos los elementos con tamaño ajustable
    const allAjustable = document.querySelectorAll(".ajustable");
    if (currRelativeSize > maxSize) {
        return;
    }
    allAjustable.forEach(element => {
        let currSize = window.getComputedStyle(element).getPropertyValue('font-size');
        currSize = parseFloat(currSize);
        element.style.fontSize = `${currSize + flatValue}px`;

        if (element.classList.contains("btnJugable")) {
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
    // Todos los elementos con tamaño ajustable
    const allAjustable = document.querySelectorAll(".ajustable");
    if (currRelativeSize <= minSize) {
        return;
    }
    allAjustable.forEach(element => {
        let currSize = window.getComputedStyle(element).getPropertyValue('font-size');
        currSize = parseFloat(currSize);
        element.style.fontSize = `${currSize - flatValue}px`;

        if (element.classList.contains("btnJugable")) {
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

// Aumentar o disminuir por teclado
document.addEventListener("keydown", (e) => {
    const tecla = e["key"];
    console.log(tecla);

    if (tecla == "ArrowUp") {
        aumentarFuente();
        return false;
    }

    if (tecla == "ArrowDown") {
        disminuirFuente();
        return false;
    }
});
