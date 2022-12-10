function slider_with_name(name, min, max, value, step) {
  // Creates a div with a p and a slider

  let returned = createDiv();
  let text = createP(name + value);
  text.class("named_slider_title");

  let slider = createSlider(min, max, value, step);

  returned.child(text);
  returned.title_text = text;

  returned.child(slider);

  returned.class("named_slider");

  returned.setValue = function (val) {
    slider.elt.value = val;
    this.value();
  };

  returned.value = function () {
    text.html(name + slider.value());
    return slider.value();
  };

  returned.input = (func) => {
    slider.elt.addEventListener("input", function () {
      const val = parseFloat(this.value);
      returned.setValue(val);
      func(val);
    });
  };
  returned.slider = slider;

  return returned;
}

function createProgress(name, value, max) {
  /* Creates a div with p and progress elements.
     Value can be a number (result in 1 progress)
     or an array of numbers (results in multiple proggresses)*/

  let returned = createDiv();

  if (typeof value === "number") {
    let bar = document.createElement("progress");
    bar.setAttribute("class", "progress_");
    bar.setAttribute("value", value);
    bar.setAttribute("max", max);
    bar.innerHTML = name;

    let p = createP(name + value);
    returned.child(p);
    returned.label = p;

    returned.child(bar);
  } else if (Array.isArray(value)) {
    let p = createP(name + value.join(", "));
    returned.child(p);
    returned.label = p;
    for (let i = 0; i < value.length; i++) {
      let bar = document.createElement("progress");
      bar.setAttribute("class", "progress_");
      bar.setAttribute("value", value[i]);
      bar.setAttribute("max", max);
      bar.innerHTML = name;

      returned.child(bar);
      returned.child(document.createElement("br"));
    }
  }
  return returned;
}

function table_from_matrix(matrix, x_axis, y_axis) {
  // Creates a table element from a 2d matrix

  let table = document.createElement("table");
  let first_row = document.createElement("tr");

  let corner = document.createElement("th");
  corner.classList.add("table-corner");

  let x_axis_text = document.createElement("p");
  let y_axis_text = document.createElement("p");

  corner.appendChild(x_axis_text);
  corner.appendChild(y_axis_text);

  first_row.appendChild(corner);

  for (let i = 0; i < x_axis.length; i++) {
    let cell = document.createElement("th");
    cell.classList.add("table-top");

    cell.innerHTML = x_axis[i];
    first_row.appendChild(cell);
  }

  table.appendChild(first_row);

  for (let i = 0; i < matrix.length; i++) {
    let matrix_row = matrix[i];
    let row = document.createElement("tr");
    let table_left = document.createElement("th");

    table_left.innerHTML = y_axis[i];
    row.appendChild(table_left);

    for (let j = 0; j < matrix_row.length; j++) {
      let cell = document.createElement("td");
      cell.innerHTML = matrix_row[j];
      row.appendChild(cell);
    }
    table.appendChild(row);
  }
  return table;
}

function createDivWithP(text) {
  // Creates a div with a p element

  let returned = createDiv();
  let p = createP(text);

  p.class("p_div_p");
  returned.child(p);

  returned.class("div_w_p");
  returned.p = p;

  return returned;
}

function createButtonWithIcon(text, icon_file_name) {
  let returned = createButton(
    `<i class="button-icon" style="--bg-image:url('../../misc/img/icons/${icon_file_name}')"></i> <p>${text}</p>`
  );
  returned.class("button-with-icon");
  return returned;
}

class stepingBox {
  // Class used for the steping_box
  constructor() {
    this.main_div = select(".step_by_step");

    this.next_button = createA("#defaultCanvas0", "next step");
    this.next_button.class("next_step");
    this.next_button.parent_box = this;
    this.next_func_ = null;

    this.content_div = createDiv();
    this.content_div.class("steping_content_div");
    this.content_div.inside = createP("No voting yet");
    this.content_div.child(this.content_div.inside);

    this.main_div.child(this.content_div);
    this.main_div.child(this.next_button);

    this.main_div.parent(main_element);
    this.hide_next();

    this.visualized_system = null;

    // hide_steping_box = createButton('hide step by step box');
    // this.shown = true;
    // hide_steping_box.parent_steping_box = this;

    // hide_steping_box.mousePressed(function () {
    //   if (this.parent_steping_box.shown) {
    //     this.parent_steping_box.hide();
    //     vote_result_div.show();
    //     this.html("show step by step box");
    //   } else {
    //     this.parent_steping_box.show();
    //     vote_result_div.hide();
    //     this.html("hide step by step box");
    //   }
    //   this.parent_steping_box.shown = !(this.parent_steping_box.shown);
    // })

    // szimulation_div.child(hide_steping_box);
    // this.hide();
    this.next_button.mousePressed(freeze);
    console.log(this.next_button.elt);
  }

  delete_content() {
    // Removes the content from the steping box
    this.content_div.inside.remove();
  }

  set_content(element) {
    // Sets the content from the steping box

    this.delete_content();
    this.content_div.inside = element;
    this.content_div.child(element);
  }

  next_func(func) {
    /* The funtion to be executed when clicking the next button.
       Used to set the content of the content box.
       The this keyword in that function will return te button itself.
       You can acess the steping_box itself by saying: this.parent_box*/

    this.next_func_ = func;
    this.next_button.mouseReleased(func);
  }

  hide_next() {
    // Hides the next button
    melt();
    this.next_button.hide();
  }

  hide() {
    // Hides the box itself
    this.main_div.hide();
  }

  show() {
    this.main_div.show();
  }

  show_next() {
    this.next_button.show();
  }
}
