function random_bool(true_chance){
  return (random()<true_chance);
}

function rewrapp_index(arr,i){
  return arr[i%arr.length];
}

function inverse_filter_array_by_array(arr, filter_arr){
  return arr.filter(function(x){return !(filter_arr.includes(x))});
}
