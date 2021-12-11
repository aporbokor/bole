function slider_with_name(name, min, max, value, step){
  let returned = createDiv();
  let text = createP(name + value);
  text.class('named_slider_title')

  let slider = createSlider(min, max, value, step);

  returned.child(text);
  returned.title_text = text;

  returned.child(slider);

  returned.class('named_slider');

  returned.setValue = function(val){
    slider.elt.value = val;
    this.value();
  }

  returned.value = function(){
    text.html(name + slider.value());
    return slider.value();
  }
  return returned;
}

function createProgress(name, value, max){
  let returned = createDiv();

  if (typeof(value) === 'number'){

    let bar = document.createElement('progress');
    bar.setAttribute("class","progress_");
    bar.setAttribute("value", value);
    bar.setAttribute("max", max);
    bar.innerHTML = name;

    let p = createP(name + value)
    returned.child(p);
    returned.label = p;

    returned.child(bar);

  } else if (Array.isArray(value)){
    let p = createP(name + value.join(', '));
    returned.child(p);
    returned.label = p;
    for (let i = 0; i < value.length; i++){
      let bar = document.createElement('progress');
      bar.setAttribute("class","progress_");
      bar.setAttribute("value", value[i]);
      bar.setAttribute("max", max);
      bar.innerHTML = name;

      returned.child(bar)
      returned.child(document.createElement('br'));
    }

  }
  return returned;
}

function table_from_matrix(matrix, x_axis, y_axis, x_name='', y_name=''){
  let table = document.createElement("table");
  let first_row = document.createElement("tr");

  let corner = document.createElement("th");
  corner.classList.add("table-corner");

  let x_axis_text = document.createElement("p");
  let y_axis_text = document.createElement("p");

  corner.appendChild(x_axis_text);
  corner.appendChild(y_axis_text);

  first_row.appendChild(corner);

  for (let i = 0; i < x_axis.length; i++){
    let cell = document.createElement("th");
    cell.classList.add("table-top");

    cell.innerHTML = x_axis[i];
    first_row.appendChild(cell);
  }

  table.appendChild(first_row);

  for (let i = 0; i<matrix.length; i++){
    let matrix_row = matrix[i];
    let row = document.createElement("tr");
    let table_left = document.createElement("th");

    table_left.innerHTML = y_axis[i];
    row.appendChild(table_left);

    for (let j = 0; j < matrix_row.length; j++){
      let cell = document.createElement("td");
      cell.innerHTML = matrix_row[j];
      row.appendChild(cell);
    }
    table.appendChild(row);
  }
  return table;
}

function createDivWithP(text){
  let returned = createDiv();
  let p = createP(text);

  p.class('p_div_p');
  returned.child(p);

  returned.class('div_w_p')
  returned.p = p;

  return returned;
}

class SteppingBox{
  constructor(){
    this.main_div = createDivWithP('The voting method step by step');
    this.main_div.class('step_by_stepp');
    this.main_div.addClass('under_selected');
    this.main_div.p.class('stepping_box_title');

    this.next_button = createButton('next step');
    this.next_button.class('next_stepp');
    this.next_button.parent_box = this;

    this.content_div = createDiv();
    this.content_div.class('stepping_content_div');
    this.content_div.inside = createP('No voting yet');
    this.content_div.child(this.content_div.inside);

    this.main_div.child(this.content_div);
    this.main_div.child(this.next_button);

    this.main_div.parent(results_and_selected_d);
    this.hide_next();

    this.visualized_system = null;

    hide_stepping_box = createButton('hide step by step box');
    this.shown = true;
    hide_stepping_box.parent_stepping_box = this;

    hide_stepping_box.mousePressed(function (){
      if (this.parent_stepping_box.shown){
        this.parent_stepping_box.hide();
        vote_result_div.show();
        this.html("show step by step box");
      }else{
        this.parent_stepping_box.show();
        vote_result_div.hide();
        this.html("hide step by step box");
      }
      this.parent_stepping_box.shown = !(this.parent_stepping_box.shown);
    })

    szimulation_div.child(hide_stepping_box);
    this.hide();
  }

  delete_content(){
    this.content_div.inside.remove();
  }

  set_content(element){
    this.delete_content();
    this.content_div.inside = element;
    this.content_div.child(element);
  }

  next_func(func){
    this.next_button.mousePressed(func);
  }

  hide_next(){
    frozen_sim = false;
    this.next_button.hide();
  }

  hide(){
    this.main_div.hide();
  }

  show(){
    this.main_div.show();
  }

  show_next(){
    frozen_sim = true;
    this.next_button.show();
  }
}
