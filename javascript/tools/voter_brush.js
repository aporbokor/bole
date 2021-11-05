class VoterPainter extends DrawTool{
  constructor(){
    super();
    this.color = 'green';
  }
  draw(){
    this.draw_outline();

    if (mouseIsPressed & is_point_inside_rect(0,0,width,height,mouseX,mouseY)){
      for (let i = 0; i <= floor(voter_per_pixel*(tool_size.value()**2)); i++){
        let pos = random_point_inside_circle(mouseX, mouseY, tool_size.value());
        add_voter_to_position(pos.x, pos.y);
      }
    }
  }
}
