// ELEMETS
const main = document.querySelector("main");
const btnGen = document.querySelector("#gen");
const btnReset = document.querySelector("#reset");
const btnContrast = document.querySelector("#contrast");
const divList = document.querySelector("#list");
const divResult = document.querySelector("#result");
const divRemaining = document.querySelector("#remaining");

function getList() {
    const data = localStorage.getItem("numbers");
    if (!data) return [];
    return JSON.parse(data);
}

function saveList(lista) {
    localStorage.setItem("numbers", JSON.stringify(lista));
}

function updateView() {
    const list = getList();
    divList.innerHTML = list.length ? list.join(", ") : "none";
}

function generate() {
    const min = parseInt(document.getElementById("min").value);
    const max = parseInt(document.getElementById("max").value);

    if (isNaN(min) || isNaN(max) || min < 0 || max < 0) {
        alert("Only valid numbers");
        return;
    }

    if (min > max) {
        alert("Min must be lower than max");
        return;
    }

    const visited = getList();
    const available = [];

    for (let i = min; i <= max; i++) {
        if (!visited.includes(i)) {
            available.push(i);
        }
    }

    if (available.length === 0) {
        divResult.innerHTML = "No more numbers available";
        return;
    }

    const num = available[Math.floor(Math.random() * available.length)];
    visited.push(num);
    saveList(visited);

    divResult.innerHTML = "Current generated number: " + num;
    updateView();
    divRemaining.innerHTML = (available.length - 1) + " numbers left";
}

function reset() {
    localStorage.removeItem("numbers");
    divResult.innerHTML = "";
    divRemaining.innerHTML = "";
    updateView();
}

function toggleContrast() {
    document.body.classList.toggle("dark");
    main.classList.toggle("dark");

    const contrastActive = document.body.classList.contains("dark");

    localStorage.setItem("contrastActive", contrastActive);
    updateContrast();
}

function updateContrast() {
    const contrastActive = localStorage.getItem("contrastActive") === "true";

    if (contrastActive) {
        document.body.classList.add("dark");
        main.classList.add("dark");
    }
}

window.addEventListener("load", () => {
    updateView();
    updateContrast();
    btnGen.addEventListener("click", generate);
    btnReset.addEventListener("click", reset);
    btnContrast.addEventListener("click", toggleContrast);
})


