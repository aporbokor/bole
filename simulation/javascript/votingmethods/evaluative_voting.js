class evaluativeVoter extends cardinalVotingMethod {
  constructor(candidates) {
    super(candidates);

    this.ranges = [
      (approval_range * 2) / 3,
      (approval_range * 4) / 3,
      max_range,
    ];
  }

  count_votes() {
    for (const cand of candidates) {
      cand.score = cand.votes[0] - cand.votes[2];
    }

    return count_votes_for_ints(
      this.candidates,
      (this.get_votes = function (c) {
        return c.score;
      })
    );
  }

  vote_to_text(vote) {
    if (vote == 0) {
      return "for";
    }
    if (vote == 1) {
      return "abstain";
    }
    return "against";
  }

  extra_visualize(voters) {
    this.paint_voters();

    for (const cand of candidates) {
      cand.text = cand.score;
      cand.text_label = "score";
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
