class Voter{
  constructor(x, y, strategic){
    this.x = x;
    this.y = y;
    this.strategic = strategic;
    this.voted_for = undefined;
  }

  distance_to_candidate(candidate){
    let x_dist = this.x - candidate.x;
    let y_dist = this.y - candidate.y;
    return Math.sqrt(x_dist*x_dist + y_dist*y_dist);
  }

  show(){
    fill(honest_voter_color);
    if (this.strategic){
      fill(strategic_voter_color);
    }
    circle(this.x, this.y, voter_size);
  }

  get_div(){
    let returned = createDiv('Voter');

    let xp = createP('x: ' + this.x);
    let yp = createP('y: ' + this.y);

    let strategic_p = createCheckbox('strategic', this.strategic);
    strategic_p.parent_voter = this;
    strategic_p.changed(strategic_changed);

    let voted_for_d = createDiv('Voted_for:');
    if (Array.isArray(this.voted_for)){
      for (let i = 0; i<this.voted_for.length; i++){
          voted_for_d.child(this.voted_for[i].get_p());
      }

    }else if (typeof this.voted_for === 'undefined'){
      voted_for_d.child(createP('noone'))
    }else{
      voted_for_d.child(this.voted_for.get_p());

    }

    let delete_button = createButton('Delete');
    delete_button.parent_voter = this;
    delete_button.mousePressed(delete_selected_voter);

    returned.child(xp);
    returned.child(yp);
    returned.child(strategic_p);
    returned.child(voted_for_d);
    returned.child(delete_button);

    return returned;
  }
}

function strategic_changed(){
  this.parent_voter.strategic = this.checked();
}

function delete_selected_voter(){
  remove_specific_voter(this.parent_voter);
  selected_div.child()[0].remove();
}