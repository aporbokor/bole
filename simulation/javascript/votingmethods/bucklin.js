class Bucklin extends RankingVotingMethod {
  prepare_for_voting() {
    super.prepare_for_voting();
    this.results_per_round = [];
  }

  set_max(candidates) {
    for (let i = 0; i < this.candidates.length; i++) {
      candidates[i].final = 0;
    }
  }

  count_votes() {
    this.set_max(candidates);
    let done = false;
    for (let i = 0; i < this.candidates.length; i++) {
      for (let j = 0; j < this.candidates.length; j++) {
        this.candidates[j].final += this.candidates[j].votes[i];
        if (this.candidates[j].final > max_votes / 2) {
          done = true;
        }
      }
      if (done) {
        return count_votes_for_ints(
          candidates,
          (this.get_votes = function (cand) {
            return cand.final;
          })
        );
      }
    }
  }

  extra_visualize(voters) {
    super.extra_visualize(voters);
    for (const cand of this.candidates) {
      cand.text = cand.final;
      cand.text_label = 'final vote count';
    }
  }
}
