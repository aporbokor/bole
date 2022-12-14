function print_json(a) {
  console.log(JSON.stringify(a));
}

function cursor_in_canvas() {
  // returns wether the cursor is inside of the canvas or not
  return !(mouseX < 0 || mouseX > width || mouseY < 0 || mouseY > height);
}

function sum_of_natural_numbers(start, end, step = 1) {
  /* Adding up natural numbers from start to end with the increase of step
      example: sum_of_natural_numbers(0, 100) = 0 + 1 + 2 + ... 100*/

  let range = end - start;
  return (range / 2) * (2 * start + (range - 1) * step);
}

function factorial(n) {
  if (n == 0) {
    return 1;
  }

  return n * factorial(n - 1);
}

function same_opinion(opinion1, opinion2) {
  // Checks if two voter opinions are the same

  for (let i = 0; i < opinion1.length; i++) {
    if (opinion1[i].id != opinion2[i].id) {
      return false;
    }
  }
  return true;
}

function ABC_constructor(instance, class_) {
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

  if (instance.constructor == class_) {
    throw new Error("Abstract baseclass can't be initialized");
  }
}

function sum(arr) {
  /*Returns the sum of every item in an array
    arr[0] + arr[1] + ... arr[len(arr)-1]*/

  let returned = 0;

  for (let i = 0; i < arr.length; i++) {
    returned += arr[i];
  }
  return returned;
}

function union(setA, setB) {
  const _union = new Set(setA);
  for (const elem of setB) {
    _union.add(elem);
  }
  return _union;
}

function* combinations(array, n) {
  // Returns every combination of array of length n
  if (n === 1) {
    for (const a of array) {
      yield [a];
    }
    return;
  }

  for (let i = 0; i <= array.length - n; i++) {
    for (const c of combinations(array.slice(i + 1), n - 1)) {
      yield [array[i], ...c];
    }
  }
}

function filledTwoDMatrix(dim1, dim2, fill_value) {
  let returned = [];
  for (let i = 0; i < dim1; i++) {
    let sub = [];
    for (let j = 0; j < dim2; j++) {
      sub.push(fill_value);
    }
    returned.push(sub);
  }
  return returned;
}

function twoDMatrixWithZeros(dim1, dim2) {
  //Crates a 2d array with the dimensions of (dim1, dim2) and fills it with 0-s
  return filledTwoDMatrix(dim1, dim2, 0);
}

// create a 2d boolean array, initially filling everything with false
function tdBooleanArray(d1, d2) {
  let arr = [];
  for (let i = 0; i < d1; i++) {
    let subarr = [];
    for (let j = 0; j < d2; j++) {
      subarr.push(false);
    }
    arr.push(subarr);
  }
  console.log(arr);
  return arr;
}

function gen_bool_arr(s) {
  let arr = [];
  for (let i = 0; i < s; i++) {
    let subarr = new Array(s).fill(false);
    arr.push(subarr);
  }
  return arr;
}

function set_diagonal(matrix, value) {
  //Sets every item in the main diagonal of a 2d matrix equal to value

  for (let i = 0; i < matrix.length; i++) {
    matrix[i][i] = value;
  }
}

function int_to_serial_number(i) {
  /* Returns a string from an int containing the serial number of that int
     examples: 1st, 2nd, 11th, 13th, 20th, 31st*/

  let str_int = "" + i;

  if ((str_int.length > 1) & (str_int.substr(-2, 1) === "1")) {
    return str_int + "th";
  }
  if (str_int.slice(-1) === "1") {
    return str_int + "st";
  }
  if (str_int.slice(-1) === "2") {
    return str_int + "nd";
  }
  if (str_int.slice(-1) === "3") {
    return str_int + "rd";
  }
  return str_int + "th";
}

function random_bool(true_chance) {
  // Coinflip function. Returns a random bool
  return random() < true_chance;
}

function rewrapp_index(arr, i) {
  // Returns the ith element of an infinite cylce where the elements of arr repeat themselves
  return arr[i % arr.length];
}

function inverse_filter_array_by_array(arr, filter_arr) {
  // Returns an array wich is the diffenence between the arr, and the filter_arr
  return arr.filter(function (x) {
    return !filter_arr.includes(x);
  });
}

function point_in_circle(point_x, point_y, circle_x, circle_y, radius) {
  // Checks if a point is inside of a circle
  return dist(point_x, point_y, circle_x, circle_y) <= radius;
}

function random_point_inside_circle(x, y, r) {
  //Generates a random point inside of a circle with a uniform distrubution
  let ans_x = Infinity;
  let ans_y = Infinity;

  const corner_x = x - r;
  const corner_y = y - r;

  while (!point_in_circle(ans_x, ans_y, x, y, r)) {
    ans_x = random(2 * r) + corner_x;
    ans_y = random(2 * r) + corner_y;
  }

  return { x: ans_x, y: ans_y };
}

function distance_from_line_segment(point, linestart, lineend) {
  let x = point.x;
  let y = point.y;

  let x1 = linestart.x;
  let y1 = linestart.y;

  let x2 = lineend.x;
  let y2 = lineend.y;

  let A = x - x1;
  let B = y - y1;
  let C = x2 - x1;
  let D = y2 - y1;

  let dot = A * C + B * D;
  let len_sq = C * C + D * D;
  let param = -1;
  if (len_sq != 0)
    //in case of 0 length line
    param = dot / len_sq;

  let xx, yy;

  if (param < 0) {
    xx = x1;
    yy = y1;
  } else if (param > 1) {
    xx = x2;
    yy = y2;
  } else {
    xx = x1 + param * C;
    yy = y1 + param * D;
  }

  let dx = x - xx;
  let dy = y - yy;
  return Math.sqrt(dx * dx + dy * dy);
}

function is_point_inside_rect(x1, y1, x2, y2, px, py) {
  // Checks if a point is inside of a rectangle
  return !(px < x1 || px > x2 || py < y1 || py > y2);
}

class Counter extends Map {
  // A Map modified to be able to count and keep track of the counts of diferent objects

  constructor(start_value = 0) {
    super();
    this.start_value = start_value;
  }

  static from_array(arr) {
    let returned = new Counter(0);

    for (const x of arr) {
      returned.count(x);
    }

    return returned;
  }

  copy() {
    let returned = new Counter(this.start_value);

    for (const x of this.entries()) {
      returned.set(x[0], x[1]);
    }
    return returned;
  }

  count(object) {
    // Increases Counter[object] by one
    if (this.has(object)) {
      this.set(object, this.get(object) + 1);
      return;
    }
    this.set(object, this.start_value);
  }

  mins() {
    // Returns the array of minimums based on counts

    let min_val = Infinity;
    let returned = [];

    for (const x of this.entries()) {
      let value = x[1];
      let key = x[0];

      if (value < min_val) {
        min_val = value;
        returned = [];
      }
      if (value == min_val) {
        returned.push(key);
      }
    }
    return returned;
  }

  maxs() {
    // Returns the array of maximums based on counts

    let max_val = -Infinity;
    let returned = [];

    for (const x of this.entries()) {
      let value = x[1];
      let key = x[0];

      if (value > max_val) {
        max_val = value;
        returned = [];
      }
      if (value == max_val) {
        returned.push(key);
      }
    }
    return returned;
  }

  min_count() {
    // Returns the count of the object wich has the smallest count

    let min_val = Infinity;

    for (const x of this.entries()) {
      if (x[1] < min_val) {
        min_val = x[1];
      }
    }
    return min_val;
  }

  max_count() {
    // Returns the count of the object wich has the largest count

    let max_val = -Infinity;

    for (const x of this.entries()) {
      if (x[1] > max_val) {
        max_val = x[1];
      }
    }
    return max_val;
  }

  sorted_array() {
    // Returns an array of the counted objects, sorted by the counts of those objects

    let returned = Array.from(this);
    returned.sort(function (a, b) {
      return b[1] - a[1];
    });

    for (let i = 0; i < returned.length; i++) {
      returned[i] = returned[i][0];
    }

    return returned;
  }
}

function get_progress(speed) {
  // Returns the progress based on some speed and the time passed (in milliseconds) between frames

  return deltaTime * speed;
}
