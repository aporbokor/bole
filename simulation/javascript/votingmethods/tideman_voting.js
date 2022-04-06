class TideMan extends CondorcetVotingMethod {
  count_votes() {
    this.calc_relative_strength_matrix();
    console.log(this.relative_strength_matrix);
    this.add_pairs();
    this.sort_pairs();
    console.log(this.pairs);
    this.locked = tdBooleanArray(
      this.candidates.length,
      this.candidates.length
    );
    console.log('work pls');
    console.log(this.locked);
    this.create_graph();
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
    return [
      [winner],
      this.candidates.filter(function (c) {
        c = !winner;
      }),
    ];
  }
}
