const main_element = document.getElementsByTagName('main')[0];
let font;

let voters;
let to_remove_voters = [];
const min_voters = 1;
let max_voters;
const max_voters_per_pixel = 0.003;

let candidates;
let to_remove_candidates = [];
const min_candidates = 2;
const max_candidates = 7;

let arrows = [];

let votingmethod;
let voter_maschine;
let results;
let max_votes;

let frozen_sim = false;
let change_in_sim = true;

let selected;
let last_selected;
let clicked_selected;
let selected_div;

let new_envitoment_div;
let edit_enviroment_div;
let simulation_div;
let visualization_div;

let strategic_chance = 0;
let voter_population = 100;
let candidate_population = 3;

let vote_result_div;
let voting_results;

let strategic_chance_slider;
let voter_population_slider;
let reset_voter_color_buttton;
let hide_voters_button;
let delete_arrows_button;
let candidate_population_slider;
let reset_button;
let simulate_button;
let auto_simulate_check_box;
let simfreezer;
let support_vis_checkbox;

let add_voter_button;
let delete_voter_button;
let add_candidate_button;
let delete_candidate_button;

let voting_type_selector;

let tool_div;
let current_tool;
let tools = new Map([['select tool', SelectTool],
['delete tool', DeleteTool],
['voter painter', VoterPainter],
['honesty painter', HonestyPainter],
['strategy painter', StrategyPainter]]);
let tool_selector;
let tool_size;
let max_tool_size = 200;
let tool_color = 'green';
const activated_tool_stroke_weight = 5;
const inactive_tool_stroke_weight = 2;
const voter_per_pixel = 0.001;

let canvas;
WIDTH = 800;
HEIGHT = 660;

let approval_range;
let approval_range_size = 0.2;
let support_range;
let support_range_size = 0.2;
let supporter_population;
let supporter_per_candidate;
let seems_win_percent = 1.1;
let seems_win_candidates = [];
let seems_lose_candidates = [];

let approval_slider;
let supporter_slider;
let seems_win_slider;

const votingmethods = new Map([
  ['plurarity', PlurarityVoter],
  ['anti-plurarity', AntiPlurarityVoter],
  // ['theoretical perfect', PerfectVoter],
  ['approval voting', ApprovalVoter],
  ['borda counting', BordaCounting],
  ['supplementary vote', SupplementaryVoter],
  ['Sri Lankan Contingent vote', SriLankanContingentVoter],
  ['contingent vote', ContingentVoter],
  ['instant runof', InstantRunOffVoter],
  ['coombs', CoombsVoting],
  ['copleland', CopelandVoter],
  ['tideman', TideMan]]
);

let stepping_box;
let hide_stepping_box;

const grow_speed = 1;
const selected_size_adder = 5;
const clicked_selected_size_adder = 15;
const clicked_selected_laser_color = 'rgb(0, 0, 0)'
const clicked_selected_stroke_weight = 4;

const default_stroke = 'rgb(0,0,0)'
const strategic_voter_color = 'rgb(0, 0, 0)';
const strategic_voter_stroeke_weight = 3;
const honest_voter_color = '#F18F01';
const voter_size = 15;
const voter_strokeWeight = 2;
const support_circle_color = 111

const candidate_colors = ['#FEFCFB', '#ED3907', '#7247FF', '#162CD9', '#2BB7DE', '#BF1160', '#0FFA42'];
const candidate_size = 40;
const candidate_strokeWeight = 5;

const background_color = 0;

const selected_size = 5;

function random_voter(i) {
  return new Voter(round(random(width)), round(random(height)), random_bool(strategic_chance), honest_voter_color, 'voter#' + i);
}

function update_voter_population_slider() {
  voter_population_slider.setValue(voters.length);
}

function update_candidate_poupulation() {
  candidate_population_slider.setValue(candidates.length);
}

function add_voter() {
  if ((voters.length != max_voters) & (!(frozen_sim))) {
    voters.push(random_voter(voters.length));
    update_voter_population_slider();
    change_in_sim = true;
  }
}

function add_voter_to_position(x, y) {
  if ((voters.length != max_voters) & (!(frozen_sim))) {
    let x_ = constrain(round(x), 0, width);
    let y_ = constrain(round(y), 0, height);

    voters.push(new Voter(x_, y_, random_bool(strategic_chance), honest_voter_color));
    update_voter_population_slider();
    change_in_sim = true;
  }
}

function reset_voter_color() {
  for (let i = 0; i < voters.length; i++) {
    voters[i].color = honest_voter_color;
  }
}

function toggle_voter_hide() {
  voters.forEach((v) => { v.toggle_hidden() })
}

function remove_voter() {
  if ((voters.length != min_voters) & (!(frozen_sim))) {
    delete voters[voters.length - 1].remove();
    update_voter_population_slider();
  }
}

function add_arrow(arrow) {
  arrows.push(arrow);
}

function delete_arrows() {
  for (const arr of arrows) {
    arr.remove();
  }
}

function remove_specific_voter(voter) {
  // voters = voters.filter(function(curval){return curval != voter})
  if ((voters.length - to_remove_voters.length != min_voters) & (!(frozen_sim))) {
    to_remove_voters.push(voter);
  }
}

function remove_specific_candidate(candidate) {
  // candidates = candidates.filter(function(curval){return curval != candidate})
  if ((candidates.length - to_remove_candidates != min_candidates) & (!(frozen_sim))) {
    to_remove_candidates.push(candidate);
  }
}

function random_candidate(i) {
  return new Candidate(round(random(width)), round(random(height)), rewrapp_index(candidate_colors, i), 'candidate#' + i);
}

function add_candidate() {
  if ((candidates.length != max_candidates) & (!(frozen_sim))) {
    candidates.push(random_candidate(candidates.length));
    update_candidate_poupulation();
    change_in_sim = true;
  }
}

function remove_candidate() {
  if ((candidates.length != min_candidates) & (!(frozen_sim))) {
    candidates[candidates.length - 1].remove();
    update_candidate_poupulation();
  }
}

function remove_people() {
  if (((to_remove_candidates.length != 0) || (to_remove_voters.length != 0)) & (!(frozen_sim))) {
    candidates = inverse_filter_array_by_array(candidates, to_remove_candidates);
    voters = inverse_filter_array_by_array(voters, to_remove_voters);

    to_remove_candidates = [];
    to_remove_voters = [];

    update_voter_population_slider();
    update_candidate_poupulation();

    change_in_sim = true;
  }
}

function delete_everything() {
  voters = [];
  candidates = [];
  arrows = [];
}

function make_voters(db) {
  // Add voters to the sim
  if (!(frozen_sim)) {
    voters = [];
    for (let i = 0; i < db; i++) {
      voters.push(random_voter(i));
    }
    update_voter_population_slider();
  }
}

function make_candidates(db) {
  // Add candidates to the sim
  if (!(frozen_sim)) {
    candidates = [];
    for (let i = 0; i < db; i++) {
      candidates.push(random_candidate(i));
    }
  }
}

function empty_function() {
  return undefined;
}

/* The extra function is a visualizatin function which runs in every frame
   By default it doesn't do anythong but this can de easily overwritten by votingmethods for example*/
let extra_function = empty_function;

let extra_varible;

function draw_everyone() {
  // Draws the voters and the candidates onto the canvas
  stroke(default_stroke);

  if (typeof selected != 'undefined') {
    selected.grow_by(selected_size_adder);
  }

  for (let i = 0; i < voters.length; i++) {
    voters[i].show();
  }

  for (i = 0; i < candidates.length; i++) {
    candidates[i].show();
  }

  for (i = 0; i < arrows.length; i++) {
    arrows[i].show();
  }

}

function draw_background() {
  // Function for drawing the background. Currently it's very simple
  background(background_color);
}


supporter_draw = empty_function;

function load_clicked_selected() {
  if (typeof (clicked_selected) != 'undefined') {
    let ch = selected_div.child();
    if (ch.length != 0) {
      ch[0].remove();
    }
    selected_div.child(clicked_selected.get_div());
  }
}

function mousePressed() {
  if (is_point_inside_rect(0, 0, width, height, mouseX, mouseY)) {
    current_tool.on_click();
  }
}

function mouseDragged() {
  current_tool.on_drag();
}

function mouseReleased() {
  current_tool.on_relase();
}

function handle_elements() {
  // Update values based on inputs
  strategic_chance = strategic_chance_slider.value();
  voter_population = voter_population_slider.value();
  candidate_population = candidate_population_slider.value();
}

function reset_on_select() {
  for (let i = 0; i < voters.length; i++) {
    voters[i].on_select = empty_function;
  }

  for (let i = 0; i < candidates.length; i++) {
    candidates[i].on_select = empty_function;
  }
}

function reset_enviroment() {
  frozen_sim = false;
  delete_everything();
  reset_on_select();
  make_voters(voter_population);
  make_candidates(candidate_population);
  stepping_box.delete_content();
  stepping_box.hide_next();
}

function select_voting() {
  votingmethod = votingmethods.get(voting_type_selector.value());
  extra_function = empty_function
}

function select_tool() {
  let current_tool_class = tools.get(tool_selector.value());
  current_tool = new current_tool_class()
}

function get_results_elements(results, show_method = function (place) { return place.get_p() }) {
  // Returns the HTML element to be put into the results div

  let returned = document.createElement("ol");
  for (let i = 0; i < results.length; i++) {

    let subdiv = createDiv(int_to_serial_number(i + 1));
    subdiv.addClass('place_div')
    let places = results[i];

    for (let j = 0; j < places.length; j++) {
      subdiv.child(show_method(places[j]));
    }

    subdiv.parent(returned);
  }
  return returned;
}

function display_votes(voter_maschine) {
  // Updates the results div and resets the stepping_box content
  stepping_box.delete_content();

  vote_result_div.html('Voting results:');
  vote_result_div.child(get_results_elements(voting_results))

  voter_maschine.extra_visualize(voters);
}


auto_simulate = empty_function;

function freeze() {
  frozen_sim = true;
  console.log(simfreezer.elt)
  simfreezer.child()[0].checked = true;
}

function melt() {
  frozen_sim = false;
  simfreezer.child()[0].checked = false;
}

function simulate_voting() {
  // Handles the voting process. Uses the selected voting_method

  reset_on_select();
  max_votes = voters.length;

  candidates.forEach((cand) => { cand.reset_text() })

  count_supporters();
  calculate_seems_win_candidates();

  voter_maschine = new votingmethod(candidates);

  voter_maschine.prepare_for_voting();

  for (let i = 0; i < voters.length; i++) {
    voter_maschine.registrate_vote(voters[i]);
  }

  voting_results = voter_maschine.count_votes()
  console.log('The voting machine:');
  console.log(voter_maschine);

  console.log('The results:');
  console.log(voting_results);

  console.log('The voters:');
  console.log(voters);

  display_votes(voter_maschine);
  voter_maschine.stepping_box_func(stepping_box);
  load_clicked_selected();
}

function auto_simulate_true() {
  if (change_in_sim) {
    simulate_voting();
    change_in_sim = false;
    delete_arrows();
  }
}


function preload() {
  font = loadFont("../fonts/Comfortaa-VariableFont_wght.ttf");
}

function windowResized() {
  resizeCanvas(constrain(WIDTH, 0, windowWidth - 20), constrain(HEIGHT, 0, windowHeight - 30));
}

function calc_approval_range() {
  approval_range = Math.floor(dist(0, 0, WIDTH, HEIGHT) * approval_range_size);
}

function calc_supporter_range() {
  support_range = Math.floor(dist(0, 0, WIDTH, HEIGHT) * support_range_size);
}

function setup() {

  canvas = createCanvas(constrain(WIDTH, 0, windowWidth - 20), constrain(HEIGHT, 0, windowHeight - 30), WEBGL);
  canvas.addClass('canvas');

  max_voters = width * height * max_voters_per_pixel;

  calc_approval_range()
  calc_supporter_range();

  selected_div = select("#selected")

  stroke(default_stroke);

  strategic_chance_slider = slider_with_name('strategic voter chance: ', 0, 1, strategic_chance, 0.01);
  voter_population_slider = slider_with_name('number of voters: ', min_voters, max_voters, voter_population, 1);
  candidate_population_slider = slider_with_name('number of candidates: ', min_candidates, max_candidates, candidate_population, 1);

  add_voter_button = createButton('add voter');
  add_voter_button.mousePressed(add_voter);

  reset_voter_color_buttton = createButton('reset voter colors');
  reset_voter_color_buttton.mousePressed(reset_voter_color);

  hide_voters_button = createButton('hide all voters');
  hide_voters_button.mousePressed(toggle_voter_hide);

  delete_arrows_button = createButton('delete all arrows');
  delete_arrows_button.mousePressed(delete_arrows);

  support_vis_checkbox = createCheckbox('visualiza support ranges', false);
  support_vis_checkbox.changed(function () {
    if (this.checked()) {
      supporter_draw = function () {
        for (let i = 0; i < candidates.length; i++) {
          push()
          fill(support_circle_color);
          let cand = candidates[i];
          circle(cand.x, cand.y, support_range * 2);
          pop()
        }
      };
    } else {
      supporter_draw = empty_function;
    }
  })

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
  for (const x of tools.entries()) {
    tool_selector.option(x[0]);
  }

  tool_selector.changed(select_tool);
  select_tool();

  tool_size = slider_with_name('tool size: ', 0, max_tool_size, 0, 1);

  simulate_button = createButton('simulate');
  simulate_button.mousePressed(simulate_voting);
  simulate_button.addClass('simulate_button');

  auto_simulate_check_box = createCheckbox('auto simulate', false);
  auto_simulate_check_box.changed(function () {
    if (this.checked()) {
      auto_simulate = auto_simulate_true;
    } else {
      auto_simulate = empty_function;
    }
  })

  simfreezer = createCheckbox('freeze visualization', false);
  simfreezer.changed(function () {
    if (this.checked()) {
      freeze();
    } else {
      melt();
    }
  })

  approval_slider = slider_with_name('approval range: ', 0.1, 1, approval_range_size, 0.01);
  approval_slider.input((val) => {
    approval_range_size = val;
    calc_approval_range();
    change_in_sim = true;
  });

  supporter_slider = slider_with_name('support range: ', 0.1, 1, support_range_size, 0.01);
  supporter_slider.input((val) => {
    support_range_size = val;
    calc_supporter_range();
    change_in_sim = true;
  })

  seems_win_slider = slider_with_name('winner prediction percentage: ', 0.9, 2, seems_win_percent, 0.02);
  seems_win_slider.input((val) => {
    seems_win_percent = val;
    change_in_sim = true;
  })


  new_envitoment_div = select('#new_environment_div');

  edit_enviroment_div = select('#edit_enviroment_div');

  Simulation_div = select('#Simulation_div');

  tool_div = select('#tool_div');

  advanced = select('#advanced');

  visualization_div = select('#visualization');

  new_envitoment_div.child(strategic_chance_slider);
  new_envitoment_div.child(voter_population_slider);
  new_envitoment_div.child(candidate_population_slider);
  new_envitoment_div.child(reset_button);

  edit_enviroment_div.child(add_voter_button);
  edit_enviroment_div.child(add_candidate_button);
  edit_enviroment_div.child(delete_candidate_button);
  edit_enviroment_div.child(delete_voter_button);

  Simulation_div.child(document.createElement('br'))
  Simulation_div.child(voting_type_selector);
  Simulation_div.child(simulate_button);
  Simulation_div.child(auto_simulate_check_box);
  Simulation_div.child(simfreezer);

  tool_div.child(document.createElement('br'))
  tool_div.child(tool_selector);
  tool_div.child(tool_size);

  advanced.child(approval_slider);
  advanced.child(supporter_slider);
  advanced.child(seems_win_slider);

  visualization_div.child(reset_voter_color_buttton);
  visualization_div.child(hide_voters_button);
  visualization_div.child(delete_arrows_button);
  visualization_div.child(support_vis_checkbox);


  vote_result_div = select('#vote_results');

  // results_and_selected_d = select('#results-and-selected-div');
  // results_and_selected_d.child(selected_div);
  // results_and_selected_d.child(vote_result_div);

  // results_and_selected_d.parent(main_element);

  make_voters(voter_population);
  make_candidates(candidate_population);

  stepping_box = new SteppingBox();
}

function draw() {
  // Runs at every frame
  translate(-width / 2, -height / 2)

  // Order here is important
  auto_simulate();
  remove_people();
  draw_background();
  extra_function();
  supporter_draw();
  current_tool.draw();
  draw_everyone();


  handle_elements();
}
