let voters;
let candidates;
let votingmethod;
let selected;

WIDTH = 720;
HEIGHT = 400;

let voter_color = '#E63946';
let voter_size = 15;

let candidate_colors = ['#F1FAEE', '#A8DADC', '#457B9D', '#1D3557'];
let candidate_size = 35;

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

function setup() {
  // Create the canvas
  createCanvas(WIDTH, HEIGHT);

  // Set colors
  // fill(204, 101, 192, 127);
  stroke(127, 63, 120);

  make_voters(300)
  make_candidates(3)

}

function draw() {
  draw_background();
  draw_everyone();
}
