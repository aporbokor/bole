class Bucklin extends RankingVotingMethod {
  prepare_for_voting() {
    super.prepare_for_voting();
    this.results_per_round = [];
  }

  set_max(candidates) {
    for (let i = 0; i < length(this.candidates); i++) {
      candidates[i].final = 0;
    }
  }

  count_votes() {
    this.set_max(candidates);
    let done = False;
    for (let i = 0; i < length(this.candidates); i++) {
      for (let j = 0; j < length(this.candidates); j++) {
        this.candidates[j].final += this.candidates[j].votes[i];
        if (this.candidates[j].final > max_votes / 2) {
          done = True;
        }
      }
      if (done) {
        count_votes_for_ints(
          candidates,
          (get_votes = function (cand) {
            return cand.final;
          })
        );
      }
    }
  }
}
