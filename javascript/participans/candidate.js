class Candidate extends Person{
  constructor(x, y, color, name){
    super(x, y, color, name);
    this.votes = undefined;
    this.size = 0;
    this.default_size = candidate_size;
    this.target_size = this.default_size;
    this.show_image = null;
    this.supporters = 0;
  }
  show(){
    this.grow_to_size();
    strokeWeight(candidate_strokeWeight);

    this.default_show();
  }

  remove_self(){
    remove_specific_candidate(this);
  }

  get_small_p(){
    let returned;
    if (typeof(this.votes) === 'undefined'){
      returned = createP(this.name + '|no votes yet');
    }else if (Array.isArray(this.votes)){
      returned = createP(this.name + '|votes: ' + this.votes.join(', '));
    } else {
      returned = createP(this.name + '|votes: ' + this.votes);
    }

    returned.class('candidate_p');
    returned.style('color', this.color);

    return returned;
  }

  get_custom_p(text_after_name){

    let returned = createProgress(this.name + '|votes: ', text_after_name, max_votes);

    returned.style('color', this.color);
    returned.candidate_parent = this;
    returned.mousePressed(function (){
      clicked_selected = this.candidate_parent;
      load_clicked_selected();
    });
    returned.mouseMoved(function(){selected = this.candidate_parent});
    returned.label.style('color', this.color);
    returned.class('candidate_p');

    return returned;
  }

  get_p(){
    return this.get_custom_p(this.votes);
  }
  get_extra_to_div(){
    let extra_to_div = createDiv();

    if (Array.isArray(this.votes)){
        extra_to_div.child(createP('Votes:' + this.votes.toString()));

    }else if (typeof this.votes === 'undefined'){
      extra_to_div.child(createP('none'))
    }else{
      extra_to_div.child(createP('Votes: ' + this.votes));
    }

    if (this.supporters == 0){
      extra_to_div.child(createP('Supporters: not avelable until a simulation has run'));
    } else {
      extra_to_div.child(createP('Supporters: ' + this.supporters));
    }

    return extra_to_div;
  }
}

function count_supporters(){
  supporter_population = 0;

  for (let i = 0; i < candidates.length; i++){
    candidates[i].supporters = 0;
  }

  for (let i = 0; i < voters.length; i++){
    let voter = voters[i];
    voter.supports = [];
    for (let j = 0; j < candidates.length; j++){
      let candidate = candidates[j];
      let res = (dist(candidate.x, candidate.y, voter.x, voter.y) <= support_range);

      if (res){
        supporter_population += 1;
        candidate.supporters += 1;
        voter.supports.push(candidate);
      }
    }
  }
}

function calculate_seems_win_candidates(){
    supporter_per_candidate = supporter_population/candidates.length;
    const supporters_to_win = seems_win_percent * supporter_per_candidate;

    seems_win_candidates = [];
    seems_lose_candidates = [];

    for (let i = 0; i < candidates.length; i++){
      let candidate = candidates[i];

      if (candidate.supporters >= supporters_to_win ){
        seems_win_candidates.push(candidate);
        continue;
      }
      seems_lose_candidates.push(candidate);
    }
}
