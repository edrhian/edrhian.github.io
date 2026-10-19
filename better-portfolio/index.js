let btnBackToTop = document.querySelector("#backToTop");

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
  navigator.clipboard.writeText("edrhian.github.io");
  alert("Enlace de portfolio copiado al portapapeles");
};
