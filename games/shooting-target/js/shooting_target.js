// ELEMENTS
const divPlayArea = document.querySelector("#play_area");
const btnStart = document.querySelector("#start");
const divSpanTemporizador = document.querySelector("#temporizador>span");
const divSpanPuntos = document.querySelector("#puntos>span");
const selectTiempoJuego = document.querySelector("#tiempo");
const selectDificultad = document.querySelector("#dificultad");
const divLeaderboard = document.querySelector("#leaderboard");
const inputUsername = document.querySelector("#username");

// Atributos de los "targets" segun la dificultad
const dificultyModifications = {
    "facil": {
        "target": {
            "width": 100,
            "height": 100
        }
    },
    "normal": {
        "target": {
            "width": 75,
            "height": 75
        }
    },
    "dificil": {
        "target": {
            "width": 50,
            "height": 50
        }
    }
};

// Variables del juego
let maxSpawnX;
let maxSpawnY;
let targetAtributes = {
    "width": 0,
    "height": 0
};
let tiempoTotal;
let temporizador;
let puntuacion;
let dificultad;

// Size of HTML document (same as pageHeight/pageWidth in screenshot).
// document.height;
// document.width;

function getRandomInt(min, max) {
    const minCeiled = Math.ceil(min);
    const maxFloored = Math.floor(max);
    return Math.floor(Math.random() * (maxFloored - minCeiled) + minCeiled); // The maximum is exclusive and the minimum is inclusive
}

// Actualiza la configuracion del juego
function setGameConfig() {
    tiempoTotal = selectTiempoJuego.value;
    dificultad = selectDificultad.value;

    // Set target size
    targetAtributes["width"] = dificultyModifications[dificultad]["target"]["width"];
    targetAtributes["height"] = dificultyModifications[dificultad]["target"]["height"];

    // Spawn Coords Correction (evita que se salga de la area de juego)
    // Size of browser viewport.
    maxSpawnX = divPlayArea.offsetWidth - targetAtributes["width"];
    maxSpawnY = divPlayArea.offsetHeight - targetAtributes["height"];
    temporizador = tiempoTotal;
}

// Crea una diana con propiedades
function createTarget() {
    const btnTarget = document.createElement("button");
    btnTarget.classList.add("target");
    btnTarget.classList.add("fa");
    btnTarget.classList.add("fa-bullseye");
    btnTarget.style.width = `${targetAtributes["width"]}px`;
    btnTarget.style.height = `${targetAtributes["height"]}px`;
    btnTarget.style.fontSize = `${targetAtributes["height"]}px`;
    btnTarget.tabIndex = -1;


    btnTarget.addEventListener("click", () => {
        spawnTarget();
        puntuacion++;
        actualizarPuntuacion();
        btnTarget.remove();
    });
    return btnTarget;
};

function actualizarPuntuacion() {
    divSpanPuntos.innerHTML = puntuacion;
}

// Muestra la diana dentro del play area en una posición aleatoria
function spawnTarget() {
    const btnTarget = createTarget();
    btnTarget.style.top = `${getRandomInt(0, maxSpawnY)}px`;
    btnTarget.style.left = `${getRandomInt(0, maxSpawnX)}px`;
    divPlayArea.appendChild(btnTarget);
}

// Reinicia el juego
function restartGame() {
    setGameConfig();
    puntuacion = 0;
    actualizarPuntuacion();
    divPlayArea.innerHTML = "";
    divSpanTemporizador.innerHTML = `${temporizador}s`;
    spawnTarget();
}

// Quita todos los "targets"
function removeAllTargets() {
    const allBtnTargets = document.querySelectorAll(".target");

    allBtnTargets.forEach(element => {
        element.remove();
    });
}

// Empieza la partida
btnStart.addEventListener("click", () => {
    let intervalId;
    if (temporizador > 0) {
        return;
    }
    restartGame();

    //Nullish coalescing assignment
    intervalId ??= setInterval(() => {
        temporizador--;
        divSpanTemporizador.innerHTML = `${temporizador}s`;

        if (temporizador == 0) {
            clearInterval(intervalId);
            divSpanTemporizador.innerHTML = "Se acabó el tiempo";
            removeAllTargets();
            divPlayArea.innerHTML = `<h2>Has conseguido una puntacion total de ${puntuacion} puntos en ${tiempoTotal} segundos.</h2><h2>Tu media es de ${(puntuacion / tiempoTotal).toFixed(2)} puntos/segudo</h2>`;
            saveGameStats();
            loadLeaderboard();
        }
    }, 1000);
});

// https://stackoverflow.com/questions/3138564/looping-through-localstorage-in-html5-and-javascript
function loadLeaderboard() {
    divLeaderboard.innerHTML = "<h2>Tabla de puntuación</h2>";

    const tabla = document.createElement("table");
    tabla.innerHTML += `
        <tr>
            <th>Usuario</th>
            <th>Tiempo de juego</th>
            <th>Dificultad</th>
            <th>Puntos</th>
        </tr>`;

    for (let i = 0; i < localStorage.length; i++) {
        const idGame = localStorage.key(i);
        const idGameSplit = idGame.split("-");

        // Filtrar por categorias/configuraciones
        if (idGameSplit[1] != selectTiempoJuego.value || idGameSplit[2] != selectDificultad.value) {
            continue;
        }

        const gameScore = localStorage[idGame];

        tabla.innerHTML += `
        <tr>
            <td>${idGameSplit[0]}</td>
            <td>${idGameSplit[1]}s</td>
            <td>${idGameSplit[2]}</td>
            <td>${gameScore}</td>
        </tr>
        `;
    }

    divLeaderboard.appendChild(tabla);
}

// Guarda la puntuación del juego actual, solo si se supera el record anterior
function saveGameStats() {
    // key: nombre de usuario-tiempo-dificultad
    // value: puntos
    const idGame = `${inputUsername.value}-${selectTiempoJuego.value}-${selectDificultad.value}`;

    const userGameScore = localStorage.getItem(idGame);

    const userLastScore = userGameScore;

    console.log(puntuacion);

    if (userLastScore < puntuacion || !userGameScore) {
        localStorage.setItem(idGame, puntuacion);
        return true;
    }

    return false;
}

window.addEventListener("load", () => {
    loadLeaderboard();
});

selectTiempoJuego.addEventListener("change", loadLeaderboard);

selectDificultad.addEventListener("change", loadLeaderboard);
