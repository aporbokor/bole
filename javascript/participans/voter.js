class Voter extends Person{
  constructor(x, y, strategic, color, name){
    super(x, y, color, name);
    this.strategic = strategic;
    this.voted_for = undefined;
    this.size = 0;
    this.default_size = voter_size;
    this.target_size = this.default_size;
    this.supports = [];
  }

  distance_to_candidate(candidate){
    let x_dist = this.x - candidate.x;
    let y_dist = this.y - candidate.y;
    return Math.sqrt(x_dist*x_dist + y_dist*y_dist);
  }

  show(){
    this.grow_to_size();
    fill(this.color);

    if (this.strategic){
      strokeWeight(strategic_voter_stroeke_weight)
      stroke(strategic_voter_color);
    }else{
      strokeWeight(voter_strokeWeight);
    }

    this.default_show();
  }

  remove_self(){
    remove_specific_voter(this);
  }

  get_extra_to_div(){
    let returned = createDiv();
    let strategic_p = createCheckbox('strategic', this.strategic);
    let supports_d = createDiv('Supports:');

    strategic_p.parent_voter = this;
    strategic_p.changed(strategic_changed);

    let voted_for_d = createDiv('Voted_for:');
    if (Array.isArray(this.voted_for)){
      for (let i = 0; i<this.voted_for.length; i++){
          voted_for_d.child(this.voted_for[i].get_small_p());
      }

    }else if (typeof this.voted_for === 'undefined'){
      voted_for_d.child(createP('this person has not voted for anyone yet'));
    }else{
      voted_for_d.child(this.voted_for.get_p());
    }
    if (this.supports.length != 0){
      for (let i = 0; i<this.supports.length; i++){
          supports_d.child(this.supports[i].get_small_p());
      }

    } else {
      supports_d.child(createP('this voter doesn\'t support anyone'));
    }

    returned.child(strategic_p);
    returned.child(voted_for_d);
    returned.child(supports_d);
    return returned;
  }
}

function strategic_changed(){
  this.parent_voter.strategic = this.checked();
}

function delete_selected_voter(){
  this.parent_voter.remove();
  selected_div.child()[0].remove();
}
