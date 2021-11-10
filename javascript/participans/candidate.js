class Candidate extends Person{
  constructor(x, y, color, name){
    super(color, name);
    this.x = x;
    this.y = y;
    // this.name = name;
    // this.color = color;
    this.votes = undefined;
    this.size = 0;
    this.default_size = candidate_size;
    this.target_size = this.default_size;
    this.show_image = null;
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
    } else if (typeof(this.votes) === 'number'){
      returned = createP(this.name + '|votes: ' + this.votes);
    }

    returned.class('candidate_p');
    returned.style('color', this.color);

    return returned;
  }

  get_p(){

    let returned = createProgress(this.name + '|votes: ', this.votes, voters.length);

    returned.style('color', this.color);
    returned.candidate_parent = this;
    returned.mousePressed(function (){
      clicked_selected = this.candidate_parent;
      load_clicked_selected();
    });
    returned.mouseMoved(function(){selected = this.candidate_parent})
    returned.label.style('color', this.color)
    returned.class('candidate_p')

    return returned;
  }
  get_extra_to_div(){
    let extra_to_div = createDiv('votes:');
    if (Array.isArray(this.votes)){
        extra_to_div.child(createP('Votes:' + this.votes.toString()));

    }else if (typeof this.votes === 'undefined'){
      extra_to_div.child(createP('none'))
    }else{
      extra_to_div.child(createP('Votes: ' + this.votes));
    }

    return extra_to_div;
  }
}
