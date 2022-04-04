class Range extends Drawable {
  /*This class creates and draws the circles araund the candidates. To be used for cardinal methods */
  constructor(
    color,
    name,
    default_size,
    parent_cand,
    text_color = "black",
    text_size = 32,
    width = 5
  ) {
    super(color, name, default_size);
    this.parent_cand = parent_cand;
    this.width = width;

    this.text_color = text_color;
    this.text_size = text_size;

    this.size = 0;
    this.grow_speed = 1;

    this.max_offset = this.size / 5;
    this.moving_speed = 2;

    this.x = this.parent_cand.x;
    this.y = this.parent_cand.y;
  }

  update_position() {
    this.target_x = this.parent_cand.x;
    this.target_y = this.parent_cand.y;

    let target_vector = createVector(this.target_x, this.target_y);
    let current_vector = createVector(this.x, this.y);

    let difference_vector = p5.Vector.sub(current_vector, target_vector);
    difference_vector.limit(this.max_offset);

    if (difference_vector.mag < this.moving_speed * 0.5) {
      this.x = this.target_x;
      this.y = this.target_y;
      return;
    }
    difference_vector.normalize();

    current_vector.add(difference_vector.mult(-this.moving_speed));

    this.x = current_vector.x;
    this.y = current_vector.y;
  }

  show() {
    noFill();
    stroke(this.color);
    circle(this.x, this.y, this.size * 2);

    this.draw_text();
    stroke(default_stroke);

    if (!this.parent_cand.shown) {
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
      const x = this.parent_cand.x + this.size;
      const y = this.parent_cand.y;

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
