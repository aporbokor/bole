const tutor = document.getElementById("starter-btn");

const intro = introJs().setOptions({
  tooltipClass: "customTooltip",
});

tutor.addEventListener("click", () => {
  intro.start();
});

// setTimeout(() => {
//   if (localStorage.getItem("first_visiter") != "yep") {
//     intro.start();
//   }

//   localStorage.setItem("first_visiter", "yep");
// }, 2000);
