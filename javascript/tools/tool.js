class Tool{
  constructor(){
    if (this.constructor == Tool){
      throw new Error("Abstract baseclass can't be initialized");
    }
  }

  on_click(){
    return undefined;
  }

  on_relase(){
    return undefined;
  }

  on_drag(){
    return undefined;
  }

  draw(){
    throw new Error("You must implement an draw method to your Person class");
  }
}

class DrawTool extends Tool{
  constructor(){
    super();
    if (this.constructor == DrawTool){
      throw new Error("Abstract baseclass can't be initialized");
    }
    this.weight = inactive_tool_stroke_weight;
  }

  draw_outline(){
    stroke(this.color);
    strokeWeight(this.weight);
    noFill();
    circle(mouseX, mouseY, tool_size.value()*2);
    for (let i = 0; i < voters.length; i++){
      let voter = voters[i]
      if (is_inside_tool(voter)){
        voter.grow_by(selected_size_adder)
      }
    }
  }
  on_click(){
    this.weight = activated_tool_stroke_weight;
  }

  on_relase(){
    this.weight = inactive_tool_stroke_weight;
  }
}

function is_inside_tool(voter){
  return (dist(voter.x, voter.y, mouseX, mouseY) <= tool_size.value());
}
