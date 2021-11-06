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
    this.show_image = null;
  }
  show(){
    this.grow_to_size();
    strokeWeight(candidate_strokeWeight);

    if (this.show_image){
      let half_size = this.size * 0.5
      image(this.show_image, this.x-half_size, this.y-half_size, this.size, this.size);
    }else{
      fill(this.color);
      circle(this.x, this.y, this.size);
    }
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

    let this_ = this;

    let image_input = createFileInput(function (file) {
      if (file.type === 'image'){
        this_.show_image = loadImage(file.data);
        this_.show_image.resize(35,35);
      }
    })

    let delete_button = createButton('Delete');
    delete_button.parent_candidate = this;
    delete_button.mousePressed(delete_selected_candidate);
    delete_button.class('delete_person');

    returned.child(name);
    returned.child(xp);
    returned.child(yp);
    returned.child(votes_d);
    returned.child(color_picker);
    returned.child(image_input);
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
  this.parent_candidate.show_image = null;
}
