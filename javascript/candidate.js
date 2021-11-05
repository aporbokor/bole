class Candidate extends Person{
  constructor(x, y, color, name){
    super();
    this.x = x;
    this.y = y;
    this.name = name;
    this.color = color;
    this.votes = undefined;
    this.size = 0;
    this.default_size = candidate_size;
    this.target_size = this.default_size;
  }
  show(){
    this.grow_to_size();
    strokeWeight(candidate_strokeWeight);
    fill(this.color);
    circle(this.x, this.y, this.size);
  }

  remove_self(){
    remove_specific_candidate(this);
  }

  get_p(){

    let returned = createProgress(this.name + '|votes:', this.votes, voters.length);

    returned.style('color', this.color);
    returned.candidate_parent = this;
    returned.mousePressed(function (){
      clicked_selected = this.candidate_parent;
      load_clicked_selected();
    });
    returned.mouseMoved(function(){selected = this.candidate_parent})
    returned.class('candidate_p')

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
        votes_d.child(createP('Votes:' + this.votes.toString()));

    }else if (typeof this.votes === 'undefined'){
      votes_d.child(createP('none'))
    }else{
      votes_d.child(createP('Votes: ' + this.votes));

    }

    let color_picker = createColorPicker(this.color);
    color_picker.parent_candidate = this;
    color_picker.parent_div = returned;
    color_picker.input(set_color);

    let delete_button = createButton('Delete');
    delete_button.parent_candidate = this;
    delete_button.mousePressed(delete_selected_candidate);
    delete_button.class('delete_person');

    returned.child(name);
    returned.child(xp);
    returned.child(yp);
    returned.child(votes_d);
    returned.child(color_picker);
    returned.child(delete_button);

    returned.class('candidate_div');

    return returned;
  }
}

function delete_selected_candidate(){
  this.parent_candidate.remove();
  selected_div.child()[0].remove();
}

function update_candidate_name(){
  this.parent_candidate.name = this.value();
}

function set_color(){
  let val = this.value();
  this.parent_candidate.color = this.value();
  this.parent_div.style('color',val);
}
