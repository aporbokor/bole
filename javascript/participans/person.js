class Person{
  // ABC for the voters and candidates

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

  default_show(){
    if (this.shown){
        if (this.show_image){
          let half_size = this.size * 0.5
          texture(this.show_image);
      }
      stroke(this.color);
      circle(this.x, this.y, this.size);
    }
    stroke(default_stroke);
  }

  // Visual methods
  show(){
    // Runs in every frame. Used to draw the person. Usually calls the default_show method at some point
    throw new Error("You must implement a show method to your Person class");
  }

  hide(){
    this.shown = false;
  }

  appear(){
    this.shown = true;
  }

  grow_to_size(){
    /* Method used for dynamic size-changes.
       When called in every frame the voter will grow by grow_speed per frame
       until it reaches its target_size. Resets the target_size in the end,
       so when we want that to change we need to maually set it every time
       before we call this method*/

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
    /* Sets the target size of the person.
       If called for the first time it is relative to the default_size.
       After that is is relative to size we set earlier*/

    if (! this.to_delete){
      this.target_size += value;
    }
  }

  // DOM methods
  get_name_p(){
    // Return a p element wich represents the person

    let returned = document.createElement("p");
    returned.style.color = this.color;
    returned.classList.add("person_name");

    if (!this.show_image){
      returned.innerText =  `● ${this.name}`;
      return returned;
    }

    returned.innerText = this.profile_pic.outerHTML + ` ${this.name}`;
    return returned;
  }

  get_simple_name_p(){
    // Return a p elemetn with the person's name
    let returned = document.createElement("p");
    returned.style.color = this.color;
    returned.classList.add("person_name");
    returned.innerText = this.name;
    return returned;
  }

  get_custom_p(progress_data, text_after_name='|votes'){
    // Creates a DOM element with the person's name and progresses made of hte proggres_data

    let text = this.get_name_p().innerText + text_after_name;
    let returned = createProgress(text, progress_data, max_votes);

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
    /* Creates a div representing the person to be used in the selected div.
       Must define an extra_to_div abstractmethod for this to work*/

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
    // Must define this for get_div to work
    throw new Error("You must implement an get_extra_to_div method to your Person class");
  }

  remove_self(){
    throw new Error("You must implement a remove_self method to your Person class");
  }

  remove(){
    this.to_delete = true;
  }
}


// Functions for input elements and buttons in the selected div
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
