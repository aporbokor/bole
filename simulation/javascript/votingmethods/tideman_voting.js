class TideMan extends CondorcetVotingMethod {
  count_votes() {
    this.calc_relative_strength_matrix();
    this.add_pairs();
    this.sort_pairs();
    return true;
  }
}
