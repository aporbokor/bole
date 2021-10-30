let voters;
let candidates;
let votingmethod;
let selected;
let locked = false;

WIDTH = 720;
HEIGHT = 400;

let voter_color = '#E63946';
let voter_size = 15;

let candidate_colors = ['#F1FAEE', '#A8DADC', '#457B9D', '#1D3557'];
let candidate_size = 35;

let selected_size = 5;

function random_voter(){
  return new Voter(round(random(WIDTH)), round(random(HEIGHT)), false);
}

function random_candidate(i){
  return new Candidate(round(random(WIDTH)), round(random(HEIGHT)), candidate_colors[i]);
}

function make_voters(db){
  voters = [];
  for (let i = 0; i<db; i++){
    voters.push(random_voter());
  }
  console.log(voters)
}

function make_candidates(db){
  candidates = [];
  for (let i = 0; i<db; i++){
    candidates.push(random_candidate(i));
  }
  console.log(candidates);
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
      return undefined;
    }
  }
  for (i = 0; i<voters.length; i++){
    let voter = voters[i];
    if (point_in_circle(mouseX, mouseY,voter.x, voter.y, voter_size)){
      selected = voter;
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

function setup() {
  // Create the canvas
  createCanvas(WIDTH, HEIGHT);

  // Set colors
  // fill(204, 101, 192, 127);
  stroke(127, 63, 120);

  make_voters(100)
  make_candidates(3)

}

function draw() {
  draw_background();
  find_selected();
  draw_everyone();
}
