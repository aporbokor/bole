class Arrow extends Drawable {
  // The arrow what can be drawn between 2 People instances
  constructor(
    color,
    name,
    start,
    end,
    endStyle = null,
    startStyle = null,
    lineStyle = null
  ) {
    super(color, name, 0);
    this.hidden_size = 0.01;
    this.shown = true;
    this.end_person = end;
    this.start_person = start;
    this.closeness = 0.6;

    this.text_place = 0.4;

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
      this.endStyle = new TriArrowHead(
        this.lineStyle.lineweight * 5,
        this.lineStyle.lineweight * 5
      );
    } else {
      this.endStyle = endStyle;
    }
    this.endStyle.parent = this;

    if (startStyle === null) {
      this.startStyle = new CutArrowHead(
        this.lineStyle.lineweight,
        this.lineStyle.lineweight
      );
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
    this.start_person_vector = createVector(
      this.start_person.x,
      this.start_person.y
    );
    this.end_person_vector = createVector(this.end_person.x, this.end_person.y);
    this.person_disance = p5.Vector.sub(
      this.end_person_vector,
      this.start_person_vector
    );

    this.start_vector_offset = this.person_disance.copy();
    this.start_vector_offset.setMag(
      this.start_person.size * this.closeness + this.startStyle.width
    );

    this.start_vector = p5.Vector.add(
      this.start_person_vector,
      this.start_vector_offset
    );

    this.end_vector_offset = this.person_disance.copy();
    this.end_vector_offset.mult(-1);
    this.end_vector_offset.setMag(this.end_person.size * this.closeness);

    this.end_vector = p5.Vector.add(
      this.end_person_vector,
      this.end_vector_offset
    );

    this.arrow_distance = p5.Vector.sub(this.end_vector, this.start_vector);
    this.default_size = this.arrow_distance.mag() * 0.05;

    this.curr_distance_vector = this.arrow_distance.copy();
    this.curr_distance_vector.setMag(this.size * 20);
    this.curr_distance_vector.limit(
      this.default_size * 20 - this.endStyle.width
    );

    this.curr_end_vector = p5.Vector.add(
      this.start_vector,
      this.curr_distance_vector
    );

    this.text_vector = this.curr_distance_vector.copy();
    this.text_vector.mult(this.text_place);
    this.text_vector = p5.Vector.add(this.text_vector, this.start_vector);
  }

  show() {
    if (this.end_person.to_delete || this.start_person.to_delete) {
      this.remove();
    }

    if (!this.to_delete & !(this.end_person.shown & this.start_person.shown)) {
      this.target_size = this.hidden_size;
    }

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
    pop();

    pop();
    this.draw_text();
  }

  draw_text() {
    // Draws text inside Arrow

    if (!this.shown) {
      return;
    }

    if (this.text != null && !this.hidden_text) {
      push();
      translate(this.text_vector.x, this.text_vector.y);
      textFont(font);
      textAlign(CENTER, CENTER);

      textSize(14);
      let box = font.textBounds(this.text.toString(), this.x, this.y);

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
    this.start_person.arrows_from.splice(
      this.start_person.arrows_from.indexOf(this),
      1
    );
    arrows.splice(arrows.indexOf(this), 1);
  }

  get_ends_div() {
    let returned = createDiv();

    let start = createDiv();

    start.child(createP("Arrow start:"));
    start.child(this.start_person.get_name_p());
    start.child(createP(this.start_person_data));

    let end = createDiv();

    end.child(createP("Arrow end:"));
    end.child(this.end_person.get_name_p());
    end.child(createP(this.end_person_data));

    returned.child(start);
    returned.child(end);
    return returned;
  }

  text_place_slider() {
    let returned = slider_with_name("text position: ", 0, 1, 0.5, 0.01);

    let slider = returned.child()[1];
    slider.parent_arrow = this;

    returned.input((val) => (this.text_place = val));

    return returned;
  }

  get_div() {
    let returned = createDiv(this.constructor.name + ": ");
    returned.style("color", this.color);

    returned.child(this.edit_apperance_div());
    returned.child(this.text_place_slider());
    returned.child(this.get_text());
    returned.child(
      createP(`Arrow length: ${round(this.person_disance.mag())}`)
    );
    returned.child(this.get_ends_div());
    returned.child(this.get_delete_button());

    returned.class(this.constructor.name + "_div");

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
    throw new Error("You must define a show method for your ArrowHead class!");
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
    throw new Error("You must define a show method for your ArrowHead class!");
  }
}

class NormalArrowLine extends ArrowLineStyle {
  show() {
    let len = this.parent.curr_distance_vector.mag();
    rect(0, -this.lineweight / 2, len, this.lineweight);
  }
}
