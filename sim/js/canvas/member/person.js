class Person extends Drawable {
  // ABC for the voters and candidates

  constructor(x, y, color, name, default_size) {
    super(color, name, default_size);
    ABC_constructor(this, Person);

    this.x = x;
    this.y = y;

    this.arrows_from = [];
  }

  // Visual methods
  default_show() {
    // if (!(this.shown)) {
    //   return
    // }

    if (this.show_image) {
      texture(this.show_image);
    }
    stroke(this.color);
    circle(this.x, this.y, this.size);

    this.draw_text();
    stroke(default_stroke);
  }

  draw_text() {
    // Draws text inside person

    if (
      this.text != null &&
      (clicked_selected === this || !this.show_image) &&
      !this.hidden_text
    ) {
      textFont(font);
      textAlign(CENTER, CENTER);

      let size = this.size * 0.4;
      textSize(size);
      let box = font.textBounds(this.text.toString(), this.x, this.y);

      fill(255);
      stroke(255);
      noStroke();
      circle(this.x, this.y, box.w + 12);

      fill(0);
      text(this.text, this.x, this.y);
    }
  }

  remove_arrows_from() {
    // Removes every arrow which starts at this person

    for (let i = 0; i < this.arrows_from.length; i++) {
      this.arrows_from[i].remove();
    }
  }

  // DOM methods
  show_on_event(element, event = "click") {
    // Sets the person as the selected, if an event listener registeres an specific event on an html element
    element.select_on = this;

    element.addEventListener(event, function () {
      console.log(this.select_on);
      clicked_selected = this.select_on;
    });
  }

  get_name_p(extra_text = "") {
    // Return a p element wich represents the person

    let returned = document.createElement("p");
    returned.style.color = this.target_color;
    returned.classList.add("person_name");

    if (!this.show_image) {
      returned.innerText = `● ${this.name}${extra_text}`;
      return returned;
    }

    returned.innerHTML =
      this.profile_pic.outerHTML + ` ${this.name}${extra_text}`;

    this.show_on_event(returned);
    return returned;
  }

  get_simple_name_p() {
    // Return a p elemetn with the person's name
    let returned = document.createElement("p");
    returned.style.color = this.target_color;
    returned.classList.add("person_name");
    returned.innerText = this.name;
    this.show_on_event(returned);
    return returned;
  }

  get_custom_p(progress_data, text_after_name = "| Votes: ") {
    // Creates a DOM element with the person's name and progresses made of thee proggres_data

    let text = this.get_name_p().innerHTML + text_after_name;
    let returned = createProgress(text, progress_data, max_votes);

    returned.style("color", this.color);
    returned.candidate_parent = this;
    returned.mousePressed(function () {
      clicked_selected = this.candidate_parent;
      load_clicked_selected();
    });
    returned.mouseMoved(function () {
      selected = this.candidate_parent;
    });
    returned.label.style("color", this.target_color);
    returned.class("candidate_p");

    this.show_on_event(returned.elt);
    return returned;
  }

  get_delete_arrows_from_button() {
    if (this.arrows_from.length == 0) {
      return null;
    }

    let returned = createButton(
      `Remove arrows pointing from this ${this.constructor.name}`
    );
    returned.parent = this;

    returned.mousePressed(function () {
      this.parent.remove_arrows_from();
    });

    return returned;
  }

  get_div() {
    /* Creates a div representing the person to be used in the selected div.
       Must define an extra_to_div abstractmethod for this to work*/

    let returned = createDiv(this.constructor.name + ": ");
    returned.style("color", this.target_color);

    let edit_app = this.edit_apperance_div();

    let xp = createP("x: " + round(this.x));
    let yp = createP("y: " + round(this.y));

    let extra_to_div = this.get_extra_to_div();

    let this_ = this;

    let image_input = createFileInput(function (file) {
      if (file.type === "image") {
        this_.profile_pic = document.createElement("image");
        this_.profile_pic.src = file.data;
        this_.profile_pic.setAttribute("class", "person_profile_pic");
        this_.show_image = loadImage(file.data);
        this_.show_image.resize(35, 35);
      }
    });

    let delete_button = this.get_delete_button();

    const text = this.get_text();
    let del_arr = this.get_delete_arrows_from_button();

    returned.child(edit_app);
    returned.child(image_input);
    returned.child(xp);
    returned.child(yp);
    if (text != null) {
      returned.child(text);
    }

    returned.child(extra_to_div);

    if (del_arr != null) {
      returned.child(del_arr);
    }
    returned.child(delete_button);

    returned.class(this.constructor.name + "_div");

    return returned;
  }

  get_extra_to_div() {
    // Must define this for get_div to work
    throw new Error(
      "You must implement an get_extra_to_div method to your Person class"
    );
  }
}
