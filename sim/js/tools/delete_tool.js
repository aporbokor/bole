class DeleteTool extends DrawTool {
  constructor() {
    super();
    this.color = 'red';
  }

  draw() {
    this.draw_outline();
    if (mouseIsPressed & cursor_in_canvas()) {
      let to_delete = [];

      for (let i = 0; i < voters.length; i++) {
        let voter = voters[i];
        if (is_inside_tool(voter)) {
          to_delete.push(voter);
        }
      }
      for (let j = 0; j < to_delete.length; j++) {
        to_delete[j].remove();
        // remove_specific_voter(to_delete[j]);
        clicked_selected = undefined;
      }
    }
  }

}
