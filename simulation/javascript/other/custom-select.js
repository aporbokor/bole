// look for any elements with the class "custom-select"
function initialize_select() {
  let x = document.getElementsByClassName("custom-select");
  console.log(x);
  let l = x.length;
  console.log(l);
  for (let i = 0; i < l; i++) {
    let selElmnt = x[i].getElementsByTagName("select")[0];
    console.log(selElmnt);
    let ll = selElmnt.length;
    // for each element, create a new div that will act as the selected item
    let a = document.createElement("div");
    a.setAttribute("class", "select-selected");
    a.innerHTML = selElmnt.options[selElmnt.selectedIndex].innerHTML;
    x[i].appendChild(a);
    // for each element, create a new div that will contain the option list
    let b = document.createElement("div");
    b.setAttribute("class", "select-items select-hide");
    for (let j = 1; j < ll; j++) {
      // for each option in the original select element,
      // create a new div that will act as an option item
      let c = document.createElement("div");
      c.innerHTML = selElmnt.options[j].innerHTML;
      c.addEventListener("click", function (e) {
        // When an item is clicked, update the original select box, and the selected item
        let s = this.parentNode.parentNode.getElementsByTagName("select")[0];
        let sl = s.length;
        let h = this.parentNode.previousSibling;
        for (let i = 0; i < sl; i++) {
          if (s.options[i].innerHTML == this.innerHTML) {
            s.selectedIndex = i;
            h.innerHTML = this.innerHTML;
            let y = this.parentNode.getELementsByClassName("same-as-selected");
            let yl = y.length;
            for (let k = 0; k < yl; k++) {
              y[k].removeAttribute("class");
            }
            this.setAttribute("class", "same-as-selected");
            break;
          }
        }
        h.click();
      });
      b.appendChild(c);
    }
    x[i].appendChild(b);
    a.addEventListener("click", function (e) {
      // when the select box is clicked, close all other boxes in the document,
      // except the current select box
      e.stopPropagation();
      closeAllSelect(this);
      this.nextSibling.classList.toggle("select-hide");
      this.classList.toggle("select-arrow-active");
    });
  }

  function closeAllSelect(el) {
    // a function that will close all select boxes in the document,
    // except the current selected box
    let arrNo = [];
    let x = document.getElementsByClassName("select-items");
    let y = document.getElementsByClassName("select-selected");
    let xl = x.length;
    let yl = y.length;
    for (let i = 0; i < yl; i++) {
      if (el == y[i]) {
        arrNo.push(i);
      } else {
        y[i].classList.remove("select-arrow-active");
      }
    }
    for (let i = 0; i < xl; i++) {
      if (arrNo.indexOf(i)) {
        x[i].classList.add("select-hide");
      }
    }
  }

  document.addEventListener("click", closeAllSelect);
}
