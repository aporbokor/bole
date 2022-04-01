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
  }

  show() {
    noFill();
    stroke(this.color);
    circle(this.parent_cand.x, this.parent_cand.y, this.size * 2);

    this.draw_text();
    stroke(default_stroke);

    if (!this.parent_cand.shown) {
      this.target_size = 0;
    }

    let og_growspeed = grow_speed;
    grow_speed = this.grow_speed;
    this.grow_to_size();
    grow_speed = og_growspeed;
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
