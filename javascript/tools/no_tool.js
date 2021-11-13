class SelectTool extends Tool{
  constructor(){
    super();
    this.locked = false;
  }

  draw_selected(){
    if (typeof clicked_selected != 'undefined'){
      clicked_selected.grow_by(clicked_selected_size_adder);
      stroke(clicked_selected_laser_color);
      strokeWeight(clicked_selected_stroke_weight);
      // line(clicked_selected.x, 0, clicked_selected.x, clicked_selected.y);
      stroke(default_stroke);
    }
  }

  draw(){
    if (this.locked){
      return undefined;
    }

    for (let i = 0; i<candidates.length; i++){
      let candidate = candidates[i];
      if (point_in_circle(mouseX, mouseY,candidate.x, candidate.y, candidate_size)){
        selected = candidate;
        last_selected = selected;
        return undefined;
      }
    }
    for (let i = 0; i<voters.length; i++){
      let voter = voters[i];
      if (point_in_circle(mouseX, mouseY,voter.x, voter.y, voter_size)){
        selected = voter;
        last_selected = selected;
        return undefined;
      }
    }
    selected = undefined;

    this.draw_selected();
  }

  on_click(){
    if (selected != undefined){
      this.locked = true;
      clicked_selected = last_selected;
      load_clicked_selected();
    } else {
      clicked_selected = undefined;
    }
  }

  on_drag(){
    if ((this.locked) & (!(frozen_sim))) {
      selected.x = constrain(mouseX, 0, width);
      selected.y = constrain(mouseY, 0, height);
      load_clicked_selected();
    }
  }
  on_relase(){
    this.locked = false;
  }
}
