function slider_with_name(name, min, max, value, step){
  let returned = createDiv();
  let text = createP(name + value);

  let slider = createSlider(min, max, value, step);

  returned.child(text);
  returned.child(slider);

  returned.class('named_slider');

  returned.value = function(){
    text.html(name + slider.value());
    return slider.value();
  }
  return returned;
}

function createProgress(name, value, max){
  let returned = createDiv();
  let bar = document.createElement('progress');
  bar.setAttribute("value", value);
  bar.setAttribute("max", max);
  bar.innerHTML = name;

  returned.child(createP(name + value));
  returned.child(bar);

  return returned;
}
