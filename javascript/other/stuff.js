function sum_of_natural_numbers(start, end, stepp=1){
  /* Adding up natural numbers from start to end with the increase of stepp
      example: sum_of_natural_numbers(0,100) = 0 + 1 + 2 + ... 100*/

  let range = end-start;
  return (range/2)*((2*start)+((range-1)*stepp));
}

function faktorial(n){
  if (n == 0){
    return 1;
  }

  return n * faktorial(n-1);
}

function ABC_constructor(instance, class_){
  /* Used in the constructor of abstract baseclasses (ABCs).
     Makes sure that you can't create an instance of an ABC.
     Usecase:
      class MyABC{
        constructor(any_args){
          ABC_constructor(this, MyABC);
          [other code]
        }
      }
  */

  if (instance.constructor == class_){
    throw new Error("Abstract baseclass can't be initialized");
  }
}

function sum(arr){
  /*Returns the sum of every item in an array
    arr[0] + arr[1] + ... arr[len(arr)-1]*/

  let returned = 0;

  for (let i = 0; i < arr.length; i++){
    returned += arr[i];
  }
  return returned;
}

function twoDMatrixWithZeros(dim1, dim2){
  //Crates a 2d array with the dimensions of (dim1, dim2) and fills it with 0-s

  let returned = [];
  for (let i = 0; i < dim1; i++){
    let sub = [];
    for (let j = 0; j < dim2; j++){
      sub.push(0);
    }
    returned.push(sub);
  }
  return returned;
}

function set_diagnal(matrix,value){
  //Sets every item in the main diagnal of a 2d matrix equal to value

  for(let i = 0; i < matrix.length; i++){
    matrix[i][i] = value;
  }
}

function int_to_serial_number(i){
  /* Returns a string from an int containing the serial number of that int
     examples: 1st, 2nd, 11th, 13th, 20th, 31st*/

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
  // Coinflip function. Returns a random bool
  return (random()<true_chance);
}

function rewrapp_index(arr,i){
  // Returns the ith element of an infinite cylce where the elements of arr repeat themselves
  return arr[i%arr.length];
}

function inverse_filter_array_by_array(arr, filter_arr){
  // Returns an array wich is the diffenence between the arr, and the filter_arr
  return arr.filter(function(x){return !(filter_arr.includes(x))});
}

function point_in_circle(point_x, point_y, circle_x, circle_y, radius){
  // Checks if a point is inside of a circle
  return dist(point_x, point_y, circle_x, circle_y) <= radius;
}

function random_point_inside_circle(x, y, r){
  //Generates a random point inside of a circle with a uniform distrubution

  let result = {};

  let r_ = Math.sqrt(random()) * r;
  let ang = random(TWO_PI);

  result.x = x + (r_ * cos(ang))
  result.y = y + (r_ * sin(ang))

  return result;
}

function is_point_inside_rect(x1, y1, x2, y2, px, py){
  // Checks if a point is inside of a rectangle
  return !((px < x1)||(px > x2)||(py < y1)||(py > y2))
}

class Counter extends Map{
  // A Map modified to be able to count and keep track of the counts of diferent objects

  constructor(start_value=0){
    super();
    this.start_value = start_value;
  }

  copy(){

    let returned = new Counter(this.start_value);

    for (const x of this.entries()){
      returned.set(x[0],x[1]);
    }
    return returned;
  }

  count(object){
    // Increases Counter[object] by one
    if (this.has(object)){
      this.set(object, this.get(object)+1)
      return;
    }
    this.set(object,this.start_value);
  }

  mins(){
    // Returns the array of minimums based on counts

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

  maxs(){
    // Returns the array of maximums based on counts

    let max_val = -Infinity;
    let returned = [];

    for (const x of this.entries()){
      let value = x[1];
      let key = x[0];

      if (value > max_val){
        max_val = value;
        returned = [];
      }
      if (value == max_val){
        returned.push(key);
      }

    }
    return returned;
  }

  min_count(){
    // Returns the count of the object wich has the smallest count

    let min_val = Infinity;

    for (const x of this.entries()){
      if (x[1] < min_val){
        min_val = x[1]
      }
    }
    return min_val;
  }

  max_count(){
    // Returns the count of the object wich has the largest count

    let max_val = -Infinity;

    for (const x of this.entries()){
      if (x[1] > max_val){
        max_val = x[1]
      }
    }
    return max_val;
  }

  sorted_array(){
    // Returns an array of the counted objects, sorted by the counts of those objects

    let returned = Array.from(this);
    returned.sort(function (a, b){
      return b[1] - a[1];
    });

    for (let i = 0; i < returned.length; i++){
      returned[i] = returned[i][0];
    }

    return returned;
  }
}
