class TideMan extends CondorcetVotingMethod {
  count_votes() {
    this.calc_relative_strength_matrix();
    console.log(this.locked);
    console.log(this.relative_strength_matrix);
    this.add_pairs();
    console.log(this.locked);
    this.sort_pairs();
    console.log(this.locked);
    console.log(this.pairs);
    this.create_graph();
    console.log(this.locked);
    let winner;
    for (let i = 0; i < this.candidates.length; i++) {
      for (let j = 0; j < this.candidates.length; j++) {
        if (this.locked[j][i] == false) {
          if (j == this.candidates.length - 1) {
            winner = this.candidates[i];
          }
        } else {
          break;
        }
      }
    }
    // TODO
    if (winner == undefined) {
      winner = this.candidates[this.pairs[0].winner];
    }
    return [
      [winner],
      this.candidates.filter(function (c) {
        c = !winner;
      }),
    ];
  }
  show_first() {
    let content = document.createElement("p");

    content.innerText =
      "Sorry, further step by step visualization is not currently available for this voting method, but we are working on it!";
    this.parent_box.set_content(content);
    this.parent_box.hide_next();
  }
}
