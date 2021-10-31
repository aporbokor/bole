class Candidate{
  constructor(x, y, color, name){
    this.x = x;
    this.y = y;
    this.name = name;
    this.color = color;
    this.votes = undefined;
  }
  show(){
    fill(this.color);
    circle(this.x, this.y, candidate_size);
  }

  get_p(){
    let vote_ = 'unedfined';
    if (typeof this.votes === 'number'){
      vote_ = this.votes;
    } else if (Array.isArray(this.votes)){
      vote_ = this.votes.toString();
    }
    let returned = createP(this.name + '|votes:' + vote_);
    returned.style('color', this.color);
    return returned;
  }

  get_div(){
    let returned = createDiv('Candidate: ');
    returned.style('color', this.color);

    let name = createInput(this.name);
    name.parent_candidate = this;
    name.input(update_candidate_name);

    let xp = createP('x: ' + this.x);
    let yp = createP('y: ' + this.y);

    let votes_d = createDiv('votes:');
    if (Array.isArray(this.votes)){
        voteds_d.child(createP('Votes:' + this.votes.toString()));

    }else if (typeof this.votes === 'undefined'){
      votes_d.child(createP('none'))
    }else{
      voteds_d.child(createP('Votes: ' + this.votes));

    }

    let delete_button = createButton('Delete');
    delete_button.parent_candidate = this;
    delete_button.mousePressed(delete_selected_candidate);

    returned.child(name);
    returned.child(xp);
    returned.child(yp);
    returned.child(votes_d);
    returned.child(delete_button);

    return returned;
  }
}

function delete_selected_candidate(){
  remove_specific_candidate(this.parent_candidate);
  selected_div.child()[0].remove();
}

function update_candidate_name(){
  this.parent_candidate.name = this.value();
}
