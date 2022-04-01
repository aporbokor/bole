class TideMan extends CondorcetVotingMethod {
  sort_pairs() {
    let matrix = this.calc_relative_strength_matrix();
  }
}
