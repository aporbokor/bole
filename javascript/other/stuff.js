function int_to_str(i){
  let str_int = '' + i;

  if ((str_int.length > 1)&(str_int.substr(-2,1) === '1')){
    return str_int + 'th';
  }
  if (str_int.slice(-1) === '1'){
    return str_int + 'st';
  }
  if (str_int.slice(-1) === '2'){
    return str_int + 'nd';
  }
  if (str_int.slice(-1) === '3'){
    return str_int + 'rd';
  }
  return str_int + 'th';
}

function random_bool(true_chance){
  return (random()<true_chance);
}

function rewrapp_index(arr,i){
  return arr[i%arr.length];
}

function inverse_filter_array_by_array(arr, filter_arr){
  return arr.filter(function(x){return !(filter_arr.includes(x))});
}

function point_in_circle(point_x, point_y, circle_x, circle_y, radius){
  return dist(point_x, point_y, circle_x, circle_y) <= radius;
}

function random_point_inside_circle(x, y, r){
  let result = {};

  let r_ = Math.sqrt(random()) * r;
  let ang = random(TWO_PI);

  result.x = x + (r_ * cos(ang))
  result.y = y + (r_ * sin(ang))

  return result;
}

function is_point_inside_rect(x1, y1, x2, y2, px, py){
  return !((px < x1)||(px > x2)||(py < y1)||(py > y2))
}

class Counter extends Map{

  constructor(){
    super();
  }

  count(object){
    if (this.has(object)){
      this.set(object, this.get(object)+1)
      return;
    }
    this.set(object,0);
  }

  mins(){
    let min_val = Infinity;
    let returned = [];

    for (const x of this.entries()){
      let value = x[1];
      let key = x[0];

      if (value < min_val){
        min_val = value;
        returned = [];
      }
      if (value == min_val){
        returned.push(key);
      }

    }
    return returned;
  }

}
