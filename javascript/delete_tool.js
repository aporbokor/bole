class DeleteTool extends DrawTool{
  constructor(){
    super();
    this.color = 'red';
  }

  draw(){
    this.draw_outline();
    if (mouseIsPressed){
      let to_delete = [];

      for (let i = 0; i < voters.length; i++){
        let voter = voters[i];
        if (dist(voter.x, voter.y, mouseX, mouseY) < tool_size.value()){
          to_delete.push(voter);
        }
      }
      for (let j = 0; j < to_delete.length; j++){
        to_delete[j].remove();
        // remove_specific_voter(to_delete[j]);
        clicked_selected = undefined;
      }
    }
  }

}
