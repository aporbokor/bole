let voters;
let candidates;
let votingmethod;
let results;
let selected;
let last_selected;
let locked = false;
let strategic_chance = 0.2;
let voter_population = 100;
let candidate_population = 3;


let strategic_chance_slider;
let voter_population_slider;
let candidate_population_slider;
let reset_button;
let simulate_button;
let voting_type_selector;

const WIDTH = 720;
const HEIGHT = 400;

let votingmethods = new Map([
  ['plurarity', PlurarityVoter],
  ['theoretical_perfect', PerfectVoter]]
)

let strategic_voter_color = '#B63946';
let honest_voter_color = '#E63946';
let voter_size = 15;

let candidate_colors = ['#F1FAEE', '#A8DADC', '#457B9D', '#1D3557'];
let candidate_size = 35;

let selected_size = 5;

function random_bool(true_chance){
  return (random()<true_chance);
}

function rewrapp_index(arr,i){
  return arr[i%arr.length];
}

function random_voter(){
  return new Voter(round(random(WIDTH)), round(random(HEIGHT)), random_bool(strategic_chance));
}

function random_candidate(i){
  return new Candidate(round(random(WIDTH)), round(random(HEIGHT)), rewrapp_index(candidate_colors,i));
}

function make_voters(db){
  voters = [];
  for (let i = 0; i<db; i++){
    voters.push(random_voter());
  }
}

function make_candidates(db){
  candidates = [];
  for (let i = 0; i<db; i++){
    candidates.push(random_candidate(i));
  }
}

function draw_everyone(){
  for (let i = 0; i<voters.length; i++){
    voters[i].show();
  }

  for (i = 0; i<candidates.length; i++){
    candidates[i].show();
  }

}

function draw_background(){
  background(200);
}

function point_in_circle(point_x, point_y, circle_x, circle_y, radius){
  let x_dist = point_x - circle_x;
  let y_dist = point_y - circle_y;
  return Math.sqrt(x_dist*x_dist + y_dist*y_dist) <= radius;
}

function find_selected(){
  if (locked){
    return undefined;
  }
  for (let i = 0; i<candidates.length; i++){
    let candidate = candidates[i];
    if (point_in_circle(mouseX, mouseY,candidate.x, candidate.y, candidate_size)){
      selected = candidate;
      last_selected = selected;
      return undefined;
    }
  }
  for (i = 0; i<voters.length; i++){
    let voter = voters[i];
    if (point_in_circle(mouseX, mouseY,voter.x, voter.y, voter_size)){
      selected = voter;
      last_selected = selected;
      return undefined;
    }
  }
  selected = undefined;
}

function mousePressed(){
  if (selected != undefined){
    locked = true;
  }
}

function mouseDragged() {
  if (locked) {
    selected.x = constrain(mouseX, 0, WIDTH);
    selected.y = constrain(mouseY, 0, HEIGHT);
  }
}

function mouseReleased() {
  locked = false;
}

function handle_elements(){
  strategic_chance = strategic_chance_slider.value();
  voter_population = voter_population_slider.value();
  candidate_population = candidate_population_slider.value();
}

function reset_enviroment(){
  voters = [];
  candidates = [];
  make_voters(voter_population);
  make_candidates(candidate_population);

}

function select_voting(){
  votingmethod = votingmethods.get(voting_type_selector.value())

}

function simulate_voting(){
  let voter_maschine = new votingmethod(candidates);

  voter_maschine.prepare_for_voting();

  for (let i = 0; i<voters.length; i++){
    voter_maschine.registrate_vote(voters[i]);
  }
  console.log('The voting maschine:');
  console.log(voter_maschine);

  console.log('The results:');
  console.log(voter_maschine.count_votes());

  console.log('The voters:');
  console.log(voters);
}

function setup() {
  // Create the canvas
  createCanvas(WIDTH, HEIGHT);

  // Set colors
  // fill(204, 101, 192, 127);
  stroke(127, 63, 120);

  make_voters(voter_population);
  make_candidates(candidate_population);

  strategic_chance_slider = createSlider(0, 1, 0, 0.01);
  voter_population_slider = createSlider(1,1000, 1, 1);
  candidate_population_slider = createSlider(2, 20, 1);

  reset_button = createButton('reset enviroment');
  reset_button.mousePressed(reset_enviroment);

  voting_type_selector = createSelect();

  for (const x of votingmethods.entries()) {
    voting_type_selector.option(x[0]);
  }
  voting_type_selector.changed(select_voting);
  select_voting();

  simulate_button = createButton('simulate');
  simulate_button.mousePressed(simulate_voting);

}

function draw() {
  find_selected();
  handle_elements();
  draw_background();
  draw_everyone();
}
