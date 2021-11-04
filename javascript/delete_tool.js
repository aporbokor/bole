class DeleteTool extends DrawTool{
  constructor(){
    super();
    this.color = 'red';
  }

  draw(){
    this.draw_outline();
  }

  on_drag(){
    let to_delete = [];

    for (let i = 0; i < voters.length; i++){
      let voter = voters[i];
      if (dist(voter.x, voter.y, mouseX, mouseY) < tool_size.value()){
        console.log('pushed')
        to_delete.push(voter);
      }
    }
    for (let j = 0; j < to_delete.length; j++){
      remove_specific_voter(to_delete[j]);
      clicked_selected = undefined;
    }
  }
}
