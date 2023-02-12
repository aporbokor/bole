class Drawable {
  // Baseclass for stuff what gets drawn to the canvas
  constructor(color, name, default_size) {
    ABC_constructor(this, Drawable);

    this.color = color;
    this.start_color = this.color;
    this.target_color = this.color;
    this.color_progress = 0;
    this.color_animation_speed = 0.005;

    this.name = name;

    this.size = 0;
    this.default_size = default_size;
    this.target_size = this.default_size;

    this.to_delete = false;

    this.text = null;
    this.text_label = null;

    this.shown = true;
    this.to_show = true;

    this.hidden_size = 5;

    this.hidden_text = false;
  }

  reset_text() {
    this.text = null;
    this.text_label = null;
  }

  // Appearance methods
  show() {
    // Runs in every frame. Used to draw the Drawable. Has to involve this.size at some point
    throw new Error("You must implement a show method to your Person class");
  }

  appear() {
    this.to_show = true;

    if (voting_machine != undefined && voting_machine != null) {
      voting_machine.extra_visualize(voters);
    }
  }

  hide() {
    this.to_show = false;
    if (voting_machine != undefined && voting_machine != null) {
      voting_machine.extra_visualize(voters);
    }
  }

  toggle_hidden() {
    this.to_show = !this.to_show;
  }

  set_color(col) {
    this.changing_color = true;
    if (this.target_color.toString() == col.toString()) {
      return;
    }

    this.start_color = color(this.color);
    this.target_color = color(col);
    this.color_progress = 0;
  }

  update_color() {
    /* Method used to dynamicly lerp between colors*/
    // if (this.color_progress > 1) {
    //   return;
    // }
    this.color = lerpColor(
      color(this.start_color),
      color(this.target_color),
      get_progress(this.color_progress)
    );
    this.color_progress = min(
      this.color_progress + this.color_animation_speed,
      1
    );

    if (this.color_progress == 1) {
      this.changing_color = false;
    }
  }

  grow_to_size() {
    /* Method used for dynamic size-changes.
         When called in every frame the voter will grow by grow_speed per frame
         until it reaches its target_size. Resets the target_size in the end, 
         so when we want that to change we need to maually set it every time
         before we call this method*/

    this.update_color();

    if (this.to_delete) {
      this.target_size = 0;
      if (this.size == 0) {
        this.remove_self();
        this.to_delete = false;
      }
    } else if (!this.to_show) {
      this.target_size = this.hidden_size;
    }

    if (this.size <= this.hidden_size) {
      this.shown = false;
    } else {
      this.shown = true;
    }

    let dif = Math.abs(this.size - this.target_size);

    if (dif <= get_progress(grow_speed)) {
      this.size = this.target_size;
    } else if (this.size < this.target_size) {
      this.size += get_progress(grow_speed);
    } else {
      this.size -= get_progress(grow_speed);
    }

    this.target_size = this.default_size;
  }

  grow_by(value) {
    /* Sets the target size of the person.
         If called for the first time it is relative to the default_size.
         After that is is relative to size we set earlier*/

    if (!this.to_delete) {
      this.target_size += value;
    }
  }

  when_selected() {
    // Runs every frame where the Drawable is selected on
    this.grow_by(clicked_selected_size_adder);
  }

  on_select() {
    // Runs when the drawable gets selected. Default behavior is nothing
  }

  remove() {
    this.to_delete = true;
  }

  remove_self() {
    // This is what the delete button will call
    throw new Error(
      "You must implement a remove_self method to your Drawable class"
    );
  }

  // DOM methods
  get_div() {
    throw new Error(
      "You must implement a get_div method for your Drawable class"
    );
  }

  add_link_to_element(element, event_type = "dblclick") {
    // Makes a given element select the candidate if that element is double clicked
    element.addEventListener(event_type, (event) => {
      select_drawable(this);
    });
  }

  edit_apperance_div() {
    let returned = createDiv();

    let name = createInput(this.name);
    name.parent_person = this;
    name.input(update_drawable_name);

    let color_picker = createColorPicker(this.color);
    color_picker.parent_person = this;
    color_picker.parent_div = returned;
    color_picker.input(set_color);

    let text_hide = createCheckbox("Hide text", this.hidden_text);
    text_hide.parent_person = this;

    text_hide.changed(() => {
      this.hidden_text = text_hide.checked();
    });

    returned.child(name);
    returned.child(color_picker);
    returned.child(this.get_hide_checkbox());
    returned.child(text_hide);

    return returned;
  }

  get_text() {
    /* Returns the p representation of the text what is currently being displayed inside the person.
         If this.text_label is null, than it returns null*/

    if (this.text_label == null) {
      return null;
    }

    let returned = document.createElement("p");
    returned.innerHTML = `${this.text_label}: ${this.text}`;
    return returned;
  }

  get_delete_button() {
    let delete_button = createButton("Delete");
    delete_button.parent_person = this;
    delete_button.mousePressed(delete_selected_drawable);
    delete_button.class("delete_person");
    return delete_button;
  }

  get_hide_checkbox() {
    let checkbox = createCheckbox(
      `Hide ${this.constructor.name}`,
      !this.to_show
    );
    checkbox.parent = this;
    checkbox.changed(function () {
      if (this.checked()) {
        this.parent.hide();
      } else {
        this.parent.appear();
      }
    });

    return checkbox;
  }
}

// Functions for input elements and buttons in the selected div
function delete_selected_drawable() {
  this.parent_person.remove();
  selected_div.child()[0].remove();
}

function update_drawable_name() {
  this.parent_person.name = this.value();
}

function set_color() {
  let val = this.value();
  this.parent_person.set_color(this.value());
  this.parent_div.style("color", val);
  this.parent_person.show_image = null;
}
