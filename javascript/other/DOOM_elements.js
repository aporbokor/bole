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

    this.main_div.parent(main_element);
    this.hide_next();

    this.visualized_system = null;
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
    this.next_button.hide();
  }

  show_next(){
    this.next_button.show();
  }
}
