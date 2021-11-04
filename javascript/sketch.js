let voters;
const min_voters = 1;
const max_voters = 1000;

let candidates;
const min_candidates = 2;
const max_candidates = 24;

let votingmethod;
let results;

let selected;
let last_selected;
let clicked_selected;
let selected_div;
let szim_gombok;
let new_envitoment_div;
let edit_enviroment_div;
let simulation_div;

let locked = false;
let strategic_chance = 0.2;
let voter_population = 100;
let candidate_population = 3;

let vote_result_div;
let voting_results;


let strategic_chance_slider;
let voter_population_slider;
let reset_voter_color_buttton;
let candidate_population_slider;
let reset_button;
let simulate_button;

let add_voter_button;
let delete_voter_button;
let add_candidate_button;
let delete_candidate_button;

let voting_type_selector;
let FPS;

let tool_div;
let current_tool;
let tools = new Map([['no tool',NoTool],
                     ['delete tool', DeleteTool]]);
let tool_selector;
let tool_size;
let max_tool_size = 200;
let tool_color = 'green'

let canvas;
const WIDTH = 720;
const HEIGHT = 400;

const approval_range = Math.floor(WIDTH*0.3);
let votingmethods = new Map([
  ['plurarity', PlurarityVoter],
  ['theoretical perfect', PerfectVoter],
  ['approval voting', ApprovalVoter],
  ['instant runof', InstantRunOffVoter]]
)

const grow_speed = 1;
const selected_size_adder = 5;
const clicked_selected_size_adder = 7;
const clicked_selected_laser_color = 'rgb(255, 0, 0)'

const default_stroke = 'rgba(0,0,0,0.5)'
const strategic_voter_color = 'rgba(0, 0, 0, 0.5)';
const honest_voter_color = '#E63946';
const voter_size = 15;
const voter_strokeWeight = 1;

const candidate_colors = ['#F1FAEE', '#A8DADC', '#457B9D', '#1D3557'];
const candidate_size = 35;
const candidate_strokeWeight = 7;

const selected_size = 5;

function random_bool(true_chance){
  return (random()<true_chance);
}

function rewrapp_index(arr,i){
  return arr[i%arr.length];
}

function random_voter(){
  return new Voter(round(random(WIDTH)), round(random(HEIGHT)), random_bool(strategic_chance),honest_voter_color);
}

function add_voter(){
  if (voters.length != max_voters){
    voters.push(random_voter());
  }
}

function reset_voter_color(){
  for (let i = 0; i < voters.length; i++){
    voters[i].color = honest_voter_color
  }
}

function remove_voter(){
  if (voters.length != min_voters){
    delete voters.pop();
  }
}

function remove_specific_voter(voter){
  voters = voters.filter(function(curval){return curval != voter})
}

function remove_specific_candidate(candidate){
  candidates = candidates.filter(function(curval){return curval != candidate})
}

function random_candidate(i){
  return new Candidate(round(random(WIDTH)), round(random(HEIGHT)), rewrapp_index(candidate_colors,i), 'candidate#' + i);
}

function add_candidate(){
  if (candidates.length != max_candidates){
    candidates.push(random_candidate(candidates.length))
  }
}

function remove_candidate(){
  if (candidates.length != min_candidates){
    candidates.pop();
  }
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

function empty_function(){
  return undefined;
}

let extra_function = empty_function;

let extra_varible;

function draw_everyone(){
  stroke(default_stroke);

  if (typeof selected != 'undefined'){
    selected.target_size = selected.target_size + selected_size_adder;
  }

  for (let i = 0; i<voters.length; i++){
    voters[i].show();
  }

  for (i = 0; i<candidates.length; i++){
    candidates[i].show();
  }

  if (typeof clicked_selected != 'undefined'){
    clicked_selected.target_size = clicked_selected.target_size + clicked_selected_size_adder;
    stroke(clicked_selected_laser_color);
    line(clicked_selected.x, 0, clicked_selected.x, clicked_selected.y);
    stroke(default_stroke);
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

function load_clicked_selected(){
  if (typeof(clicked_selected) != 'undefined'){
    let ch = selected_div.child();
    if (ch.length != 0){
      ch[0].remove();
    }
    selected_div.child(clicked_selected.get_div());
  }
}

function mousePressed(){
  if (selected != undefined){
    locked = true;
    clicked_selected = last_selected;
    load_clicked_selected();
  }
  current_tool.on_click();
}

function mouseDragged() {
  if (locked) {
    selected.x = constrain(mouseX, 0, WIDTH);
    selected.y = constrain(mouseY, 0, HEIGHT);
    load_clicked_selected();
  }
  current_tool.on_drag();
}

function mouseReleased() {
  locked = false;
  current_tool.on_relase();
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
  votingmethod = votingmethods.get(voting_type_selector.value());
  extra_function = empty_function
}

function select_tool(){
  let current_tool_class = tools.get(tool_selector.value());
  current_tool = new current_tool_class()
}

function int_to_str(i){
  let str_int = '' + i;
  if (str_int.slice(-2,-3) === '1'){
    return i + 'th';
  }
  if (str_int.slice(-1) === '1'){
    return i + 'st';
  }
  if (str_int.slice(-1) === '2'){
    return i + 'nd';
  }
  if (str_int.slice(-1) === '3'){
    return i + 'rd';
  }
  return i + 'th';
}

function display_votes(voter_maschine){
  vote_result_div.html('Voting results:');
  for (let i = 0; i < voting_results.length; i++){
    let subdiv = createDiv(int_to_str(i+1));
    subdiv.class('place_div')
    let places = voting_results[i];
    for (let j = 0; j < places.length; j++){
      subdiv.child(places[j].get_p());
    }
    vote_result_div.child(subdiv);
  }
  voter_maschine.extra_visualize(voters);
}

function simulate_voting(){
  let voter_maschine = new votingmethod(candidates);


  voter_maschine.prepare_for_voting();

  for (let i = 0; i<voters.length; i++){
    voter_maschine.registrate_vote(voters[i]);
  }

  voting_results = voter_maschine.count_votes()
  console.log('The voting maschine:');
  console.log(voter_maschine);

  console.log('The results:');
  console.log(voting_results);

  console.log('The voters:');
  console.log(voters);

  display_votes(voter_maschine);
  load_clicked_selected();
}

function setup() {
  canvas = createCanvas(WIDTH, HEIGHT);
  canvas.class('canvas')

  selected_div = createDiv('Nobody is selected');
  selected_div.class('selected')


  stroke(default_stroke);
  FPS = document.createElement('p');
  document.body.appendChild(FPS);

  make_voters(voter_population);
  make_candidates(candidate_population);

  szim_gombok = createDiv('szimulation buttons')

  strategic_chance_slider = slider_with_name('strategic voter chance: ',0, 1, 0, 0.01);
  voter_population_slider = slider_with_name('number of voters: ', min_voters, max_voters, 1, 1);
  candidate_population_slider = slider_with_name('number of candidates: ', min_candidates, max_candidates, 1, 1);

  add_voter_button = createButton('add voter');
  add_voter_button.mousePressed(add_voter);

  reset_voter_color_buttton = createButton('reset voter colors');
  reset_voter_color_buttton.mousePressed(reset_voter_color)

  add_candidate_button = createButton('add candidate');
  add_candidate_button.mousePressed(add_candidate);

  delete_candidate_button = createButton('delete candidate');
  delete_candidate_button.mousePressed(remove_candidate);

  delete_voter_button = createButton('delete voter');
  delete_voter_button.mousePressed(remove_voter);

  reset_button = createButton('reset enviroment');
  reset_button.mousePressed(reset_enviroment);

  voting_type_selector = createSelect();

  for (const x of votingmethods.entries()) {
    voting_type_selector.option(x[0]);
  }

  voting_type_selector.changed(select_voting);
  select_voting();

  tool_selector = createSelect();
  for (const x of tools.entries()){
    tool_selector.option(x[0]);
  }

  tool_selector.changed(select_tool);
  select_tool();

  tool_size = slider_with_name('tool size: ', 0, max_tool_size,0,1);

  simulate_button = createButton('simulate');
  simulate_button.mousePressed(simulate_voting);
  simulate_button.class('simulate_button');

  new_envitoment_div = createDiv('Nev enviroment');
  new_envitoment_div.class('new_envitoment_div');

  edit_enviroment_div = createDiv('Edit enviroment');
  edit_enviroment_div.class('edit_enviroment_div');

  szimulation_div = createDiv('Szimulation');
  szimulation_div.class('szimulation_div');

  tool_div = createDiv('tools');
  tool_div.class('tool_div');

  new_envitoment_div.child(strategic_chance_slider);
  new_envitoment_div.child(voter_population_slider);
  new_envitoment_div.child(candidate_population_slider);
  edit_enviroment_div.child(add_voter_button);
  edit_enviroment_div.child(reset_voter_color_buttton);
  edit_enviroment_div.child(add_candidate_button);
  edit_enviroment_div.child(delete_candidate_button);
  edit_enviroment_div.child(delete_voter_button);
  new_envitoment_div.child(reset_button);
  szimulation_div.child(voting_type_selector);
  szimulation_div.child(simulate_button);
  tool_div.child(tool_selector);
  tool_div.child(tool_size);

  szim_gombok.child(new_envitoment_div);
  szim_gombok.child(edit_enviroment_div);
  szim_gombok.child(szimulation_div);
  szim_gombok.class('sim_gombok');
  szim_gombok.child(tool_div);

  // selected_div = createDiv('Nobody is selected');
  // selected_div.class('selected')

  vote_result_div = createDiv('Voting results:');
  vote_result_div.class('vote_results');

  szim_gombok.parent(document.getElementsByTagName('main')[0])

}

function draw() {
  let start = new Date().getTime();

  draw_background();
  extra_function();
  find_selected();
  current_tool.draw();
  draw_everyone();
  handle_elements();

  let end = new Date().getTime() - start;
  FPS.innerText = 'FPS: ' + frameRate();
}
