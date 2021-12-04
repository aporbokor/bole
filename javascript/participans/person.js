class Person{
  constructor(x, y, color, name, sim){
    ABC_constructor(this, Person);

    this.x = x;
    this.y = y;
    this.color = color;
    this.name = name;

    this.to_delete = false;
    this.shown = true;
    this.parent_sim = sim;
  }

  show(){
    throw new Error("You must implement a show method to your Person class");
  }

  hide(){
    this.shown = false;
  }

  appear(){
    this.shown = true;
  }

  default_show(){
    if (this.shown){
        if (this.show_image){
          let half_size = this.size * 0.5
          texture(this.show_image);
          // image(this.show_image, this.x-half_size, this.y-half_size, this.size, this.size);
       }else{
        stroke(this.color);
      }
      circle(this.x, this.y, this.size);
    }
    stroke(default_stroke);
  }

  get_name_p(){
    if (!this.show_image){
      return  `● ${this.name}`;
    }
    console.log(this.show_image.elt);
    let returned = this.profile_pic.outerHTML + ` ${this.name}`;
    return returned;
  }

  get_custom_p(text_after_name){

    let returned = createProgress(this.get_name_p() + '|votes: ', text_after_name, max_votes);

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

  get_div(){
    let returned = createDiv(this.constructor.name + ': ');
    returned.style('color', this.color);

    let name = createInput(this.name);
    name.parent_person = this;
    name.input(update_person_name);

    let xp = createP('x: ' + this.x);
    let yp = createP('y: ' + this.y);

    let extra_to_div = this.get_extra_to_div();
    let color_picker = createColorPicker(this.color);
    color_picker.parent_person = this;
    color_picker.parent_div = returned;
    color_picker.input(set_color);

    let this_ = this;

    let image_input = createFileInput(function (file) {
      if (file.type === 'image'){
        this_.profile_pic = document.createElement('img');
        this_.profile_pic.src = file.data;
        this_.profile_pic.setAttribute("class","person_profile_pic");
        this_.show_image = loadImage(file.data);
        this_.show_image.resize(35,35);
      }
    })

    let delete_button = createButton('Delete');
    delete_button.parent_person = this;
    delete_button.mousePressed(delete_selected_person);
    delete_button.class('delete_person');

    returned.child(name);
    returned.child(xp);
    returned.child(yp);
    returned.child(extra_to_div);
    returned.child(color_picker);
    returned.child(image_input);
    returned.child(delete_button);

    returned.class(this.constructor.name + '_div');

    return returned;
  }

  get_extra_to_div(){
    throw new Error("You must implement an get_extra_to_div method to your Person class");
  }

  remove_self(){
    throw new Error("You must implement a remove_self method to your Person class");
  }

  remove(){
    this.to_delete = true;
  }

  grow_to_size(){
    let dif = Math.abs(this.size - this.target_size);

    if (dif <= grow_speed){
      this.size = this.target_size;

    } else if (this.size < this.target_size){
      this.size += grow_speed;

    } else {
      this.size -= grow_speed;
    }
    if (this.to_delete){
      this.target_size = 0;
      if (this.size == 0){
        this.remove_self()
        this.to_delete = false;
      }
      return;
    }

    this.target_size = this.default_size;

  }

  grow_by(value){
    if (! this.to_delete){
      this.target_size += value;
    }
  }
}

function delete_selected_person(){
  this.parent_person.remove();
  selected_div.child()[0].remove();
}

function update_person_name(){
  this.parent_person.name = this.value();
}

function set_color(){
  let val = this.value();
  this.parent_person.color = this.value();
  this.parent_div.style('color',val);
  this.parent_person.show_image = null;
}
