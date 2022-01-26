class Drawable {
  // Baseclass for stuff what gets drawn to the canvas
  constructor(color, name, default_size) {
    ABC_constructor(this, Drawable);

    this.color = color;
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
  }

  hide() {
    this.to_show = false;
  }

  toggle_hidden() {
    this.to_show = !this.to_show;
  }


  grow_to_size() {
    /* Method used for dynamic size-changes.
       When called in every frame the voter will grow by grow_speed per frame
       until it reaches its target_size. Resets the target_size in the end,
       so when we want that to change we need to maually set it every time
       before we call this method*/

    if (!(this.to_show)) {
      this.target_size = this.hidden_size;
    }

    if (this.size <= this.hidden_size) {
      this.shown = false;
    } else {
      this.shown = true;
    }

    let dif = Math.abs(this.size - this.target_size);

    if (dif <= grow_speed) {
      this.size = this.target_size;

    } else if (this.size < this.target_size) {
      this.size += grow_speed;

    } else {
      this.size -= grow_speed;
    }
    if (this.to_delete) {
      this.target_size = 0;
      if (this.size == 0) {
        this.remove_self()
        this.to_delete = false;
      }
      return;
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
    throw new Error("You must implement a remove_self method to your Drawable class");
  }

  // DOM methods
  get_div() {
    throw new Error("You must implement a get_div method for your Drawable class");
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

    returned.child(name);
    returned.child(color_picker);
    returned.child(this.get_hide_checkbox());

    return returned;
  }


  get_text() {
    /* Returns the p representation of the text what is currently being displayed inside the person.
       If this.text_label is null, than it returns null*/

    if (this.text_label == null) {
      return null;
    }

    let returned = document.createElement("p");
    returned.innerHTML = `${this.text_label}: ${this.text}`
    return returned;
  }



  get_delete_button() {
    let delete_button = createButton('Delete');
    delete_button.parent_person = this;
    delete_button.mousePressed(delete_selected_drawable);
    delete_button.class('delete_person');
    return delete_button;
  }

  get_hide_checkbox() {
    let checkbox = createCheckbox(`Hide ${this.constructor.name}`, !this.to_show);
    checkbox.parent = this;
    checkbox.changed(function () {
      if (this.checked()) {
        this.parent.hide();
      } else {
        this.parent.appear();
      }
    })

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
  this.parent_person.color = this.value();
  this.parent_div.style('color', val);
  this.parent_person.show_image = null;
}


class Arrow extends Drawable {
  // The arrow what can be drawn between 2 People instances
  constructor(color, name, start, end, endStyle = null, startStyle = null, lineStyle = null) {
    super(color, name, 0);
    this.hidden_size = 0.01;
    this.shown = true;
    this.end_person = end;
    this.start_person = start;
    this.closeness = 0.6;

    this.start_person_data = null;
    this.end_person_data = null;

    this.start_person.arrows_from.push(this);
    add_arrow(this);

    if (lineStyle === null) {
      this.lineStyle = new NormalArrowLine(5);
    } else {
      this.lineStyle = lineStyle;
    }
    this.lineStyle.parent = this;


    if (endStyle === null) {
      this.endStyle = new TriArrowHead(this.lineStyle.lineweight * 5, this.lineStyle.lineweight * 5);
    } else {
      this.endStyle = endStyle;
    }
    this.endStyle.parent = this;

    if (startStyle === null) {
      this.startStyle = new CutArrowHead(this.lineStyle.lineweight, this.lineStyle.lineweight);
    } else {
      this.startStyle = startStyle;
    }

    this.startStyle.parent = this;
    this.calc_vectors();
  }

  set_end_styles(start, end) {
    this.startStyle = start;
    this.endStyle = end;
    this.endStyle.parent = this;
    this.startStyle.parent = this;
  }

  calc_vectors() {
    this.start_person_vector = createVector(this.start_person.x, this.start_person.y);
    this.end_person_vector = createVector(this.end_person.x, this.end_person.y);
    this.person_disance = p5.Vector.sub(this.end_person_vector, this.start_person_vector);

    this.start_vector_offset = this.person_disance.copy();
    this.start_vector_offset.setMag((this.start_person.size * this.closeness) + this.startStyle.width);

    this.start_vector = p5.Vector.add(this.start_person_vector, this.start_vector_offset);

    this.end_vector_offset = this.person_disance.copy();
    this.end_vector_offset.mult(-1);
    this.end_vector_offset.setMag(this.end_person.size * this.closeness);

    this.end_vector = p5.Vector.add(this.end_person_vector, this.end_vector_offset);

    this.arrow_distance = p5.Vector.sub(this.end_vector, this.start_vector);
    this.default_size = this.arrow_distance.mag() * 0.05;

    this.curr_distance_vector = this.arrow_distance.copy();
    this.curr_distance_vector.setMag(this.size * 20);
    this.curr_distance_vector.limit((this.default_size * 20) - this.endStyle.width);

    this.curr_end_vector = p5.Vector.add(this.start_vector, this.curr_distance_vector);

    this.half_vector = this.curr_distance_vector.copy();
    this.half_vector.mult(0.5);
    this.half_vector = p5.Vector.add(this.half_vector, this.start_vector);
  }

  show() {

    if ((this.end_person.to_delete) || (this.start_person.to_delete)) {
      this.remove();
    }

    this.to_show = ((this.end_person.shown) & (this.start_person.shown))


    this.calc_vectors();
    this.grow_to_size();


    push();
    noStroke();
    fill(this.color);
    translate(this.start_vector.x, this.start_vector.y);
    line(0, 0, this.curr_distance_vector.x, this.curr_distance_vector.y);

    push();
    rotate(this.curr_distance_vector.heading());
    this.lineStyle.show();

    translate(this.curr_distance_vector.mag(), 0);

    this.endStyle.show();
    pop();

    push();
    rotate(PI + this.curr_distance_vector.heading());
    this.startStyle.show();
    pop()

    pop();
    this.draw_text();

  }

  draw_text() {
    // Draws text inside Arrow

    if (!this.shown) {
      return
    }

    if (this.text != null) {

      push();
      translate(this.half_vector.x, this.half_vector.y);
      textFont(font);
      textAlign(CENTER, CENTER);

      textSize(14);
      let box = font.textBounds(this.text.toString(), this.x, this.y)

      fill(255);
      stroke(255);
      noStroke();
      circle(0, 0, box.w + 12);

      fill(0);
      text(this.text, 0, 0);
      pop();
    }
  }

  remove_self() {
    this.start_person.arrows_from.splice(this.start_person.arrows_from.indexOf(this), 1);
    arrows.splice(arrows.indexOf(this), 1);
  }

  get_ends_div() {
    let returned = createDiv();

    let start = createDiv();

    start.child(createP("Arrow start:"))
    start.child(this.start_person.get_name_p());
    start.child(createP(this.start_person_data));

    let end = createDiv();

    end.child(createP("Arrow end:"))
    end.child(this.end_person.get_name_p());
    end.child(createP(this.end_person_data));

    returned.child(start);
    returned.child(end);
    return returned;
  }

  get_div() {
    let returned = createDiv(this.constructor.name + ': ');
    returned.style('color', this.color);

    returned.child(this.edit_apperance_div());
    returned.child(this.get_text());
    returned.child(createP(`Arrow length: ${round(this.person_disance.mag())}`))
    returned.child(this.get_ends_div());
    returned.child(this.get_delete_button());

    returned.class(this.constructor.name + '_div');

    return returned;
  }
}

class ArrowHead {
  // Baseclass for the different styles of arrowheads. Just pass an instance in to the Arrow constructor
  constructor(size, width) {
    ABC_constructor(this, ArrowHead);
    this.size = size;
    this.width = width;
    this.parent = parent;
  }

  show() {
    throw new Error("You must define a show method for your ArrowHead class!")
  }
}


class TriArrowHead extends ArrowHead {
  show() {
    triangle(0, this.size / 2, 0, -this.size / 2, this.width, 0);
  }
}

class ReversedTriArrowHead extends ArrowHead {
  show() {
    triangle(this.width, this.size / 2, this.width, -this.size / 2, 0, 0);
  }
}

class HalfTriArrowHead extends ArrowHead {
  show() {
    const top = this.parent.lineStyle.lineweight / 2;
    triangle(0, top, 0, -this.size / 2, this.width, top);
  }
}

class CutArrowHead extends ArrowHead {
  show() {
    triangle(0, this.size / 2, this.width, this.size / 2, 0, 0);
    triangle(0, -this.size / 2, this.width, -this.size / 2, 0, 0);
  }
}

class RectArrowHead extends ArrowHead {
  show() {
    rect(0, -this.size / 2, this.width, this.size);
  }
}

class ArrowLineStyle {
  // Baseclass for the different styles of arrowheads. Just pass an instance in to the Arrow constructor
  constructor(lineweight) {
    ABC_constructor(this, ArrowLineStyle);
    this.lineweight = lineweight;
  }

  show() {
    throw new Error("You must define a show method for your ArrowHead class!")
  }
}

class NormalArrowLine extends ArrowLineStyle {
  show() {
    let len = this.parent.curr_distance_vector.mag();
    rect(0, -this.lineweight / 2, len, this.lineweight);
  }
}
