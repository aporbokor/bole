class Tool{
  constructor(){
    ABC_constructor(this, Tool);
  }

  on_click(){
    // Defines what happens when the user clicks. Default behavior is nothing
    return undefined;
  }

  on_relase(){
    // Defines what happens when the user relases the mouse. Default behavior is nothing
    return undefined;
  }

  on_drag(){
    // Defines what happens when the user drags the mouse. Default behavior is nothing
    return undefined;
  }

  draw(){
    // Abstract mehod, Defines what happens in every frame
    throw new Error("You must implement an draw method to your Tool class");
  }
}

class DrawTool extends Tool{
  // ABC for a Tool which has effect inside of the circle with a radius of tool_size and with the midpoint of the cursor

  constructor(){
    super();
    ABC_constructor(this, DrawTool);
    this.weight = inactive_tool_stroke_weight;
    // Every class which inherits from this class will have to define a color attribute
  }

  draw_outline(){
    // Draws the circle around the cursor with te color of this.color

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
  // Checks if a voter is inside of a DrawTool
  return (dist(voter.x, voter.y, mouseX, mouseY) <= tool_size.value());
}
