const btnBackToTop = document.querySelector("#backToTop");
const aCopyPortfolio = document.querySelector("#copyPortfolio");

window.onscroll = () => {
  if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
    btnBackToTop.style.display = "block";
  } else {
    btnBackToTop.style.display = "none";
  }
};

let topFunction = () => {
  document.body.scrollTop = 0; // For Safari
  document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
};

let copyToClipboard = () => {
  navigator.clipboard
    .writeText("https://edrhian.github.io")
    .then(() => {
      aCopyPortfolio.textContent = "¡Copiado!";

      setTimeout(() => {
        aCopyPortfolio.textContent = "Copiar enlace";
      }, 2000);
    })
    .catch((err) => {
      console.error("Error al copiar al portapapeles: ", err);
    });
};
