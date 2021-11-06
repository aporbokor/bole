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

  if (typeof(value) === 'number'){

    let bar = document.createElement('progress');
    bar.setAttribute("value", value);
    bar.setAttribute("max", max);
    bar.innerHTML = name;

    returned.child(createP(name + value));
    returned.child(bar);

  } else if (Array.isArray(value)){
    returned.child(createP(name + value.toString()));
    for (let i = 0; i < value.length; i++){
      let bar = document.createElement('progress');
      bar.setAttribute("value", i);
      bar.setAttribute("max", max);
      bar.innerHTML = name;

      returned.child(bar)
      returned.child(document.createElement('br'))
    }

  }
  return returned;
}
