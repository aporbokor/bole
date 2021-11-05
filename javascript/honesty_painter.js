class HonestyPainter extends DrawTool {
  constructor(){
    super();
    this.color = 'gray';
  }

  draw(){
    this.draw_outline();
    if (mouseIsPressed){
      for (let i = 0; i < voters.length; i++){
        let voter = voters[i];
        if (is_inside_tool(voter)){
          voter.strategic = false;
        }
      }
    }
  }
}

class StrategyPainter extends DrawTool {
  constructor(){
    super();
    this.color = 'white';
  }

  draw(){
    this.draw_outline();
    if (mouseIsPressed){
      for (let i = 0; i < voters.length; i++){
        let voter = voters[i];
        if (is_inside_tool(voter)){
          voter.strategic = true;
        }
      }
    }
  }
}
