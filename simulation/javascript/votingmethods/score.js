class scoreVoter extends cardinalVotingMethod {
  constructor(candidates) {
    super(candidates);
    this.ranges = [
      approval_range / 3,
      (approval_range * 1.5) / 3,
      (approval_range * 2) / 3,
      (approval_range * 2.5) / 3,
      (approval_range * 3) / 3,
      (approval_range * 3.5) / 3,
      (approval_range * 4) / 3,
      (approval_range * 4.5) / 3,
      (approval_range * 5) / 3,
      max_range,
    ];
  }

  count_votes() {
    for (const c of candidates) {
      let s = this.ranges.length - 1;
      for (let i = 0; i < this.ranges.length - 1; i++) {
        c.score += c.votes[i] * s;
        s -= 1;
      }
    }
    return count_votes_for_ints(
      this.candidates,
      (this.get_votes = function (c) {
        return c.score;
      })
    );
  }

  extra_visualize(voters) {
    this.paint_voters();

    for (const cand of candidates) {
      cand.text = cand.score;
      cand.text_label = 'score';
    }

    extra_function = function () {
      for (let i = 0; i < candidates.length; i++) {
        voter_maschine.draw_circles_around_candidate(candidates[i]);
      }
      if (candidates.some(isin)) {
        voter_maschine.resize_voters(clicked_selected);
      }
    };
  }
}
