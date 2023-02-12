class Range extends Drawable {
  /*This class creates and draws the circles araund the candidates. To be used for cardinal methods */
  constructor(
    color,
    name,
    default_size,
    parent_cand,
    text_color = "black",
    text_size = 16,
    width = 5
  ) {
    super(color, name, default_size);
    this.parent_cand = parent_cand;
    this.width = width;

    this.text_color = text_color;
    this.text_size = text_size;

    this.size = 0;
    this.grow_speed = 1;

    this.max_offset = this.target_size;
    this.moving_speed = 0.4;

    this.x = width / 2;
    this.y = height / 2;
  }

  update_position() {
    this.target_x = this.parent_cand.x;
    this.target_y = this.parent_cand.y;

    let progress = get_progress(this.moving_speed);

    let target_vector = createVector(this.target_x, this.target_y);
    let current_vector = createVector(this.x, this.y);

    let difference_vector = p5.Vector.sub(target_vector, current_vector);

    difference_vector.setMag(difference_vector.mag() - progress);

    difference_vector.limit(this.max_offset);

    if (difference_vector.mag() < progress) {
      this.x = this.target_x;
      this.y = this.target_y;
      return;
    }

    current_vector = p5.Vector.sub(target_vector, difference_vector);

    this.x = current_vector.x;
    this.y = current_vector.y;
  }

  show() {
    noFill();
    stroke(this.color);
    circle(this.x, this.y, this.size * 2);

    this.draw_text();
    stroke(default_stroke);

    if (!(this.parent_cand.shown & this.parent_cand.show_ranges)) {
      this.target_size = 0;
    }

    let og_growspeed = grow_speed;
    grow_speed = this.grow_speed;
    this.grow_to_size();
    grow_speed = og_growspeed;

    this.update_position();
  }

  draw_text() {
    if (this.text != null) {
      const x = this.x;
      const y = this.y - this.size;

      textFont(font);
      textAlign(CENTER, CENTER);

      textSize(this.text_size);
      let box = font.textBounds(this.text.toString(), x, y);

      fill(255);
      stroke(255);
      noStroke();
      circle(x, y, box.w + 12);

      fill(0);
      text(this.text, x, y);
    }
  }
}
