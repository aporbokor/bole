class Evaluative extends cardinalVotingMethod {
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

  get_results_data(cand) {
    return [cand.score, "| Score: "];
  }

  extra_visualize(voters) {
    this.paint_voters();
    this.set_up_voter_arrows();

    for (const cand of candidates) {
      cand.text = cand.score;
      cand.text_label = "score";
    }

    extra_function = function () {
      for (let i = 0; i < candidates.length; i++) {
        voting_machine.draw_circles_around_candidate(candidates[i]);
      }
      if (candidates.some(isin)) {
        voting_machine.resize_voters(clicked_selected);
      }
    };
  }
  steping_box_func(steping_box) {
    steping_box.set_content(
      createP(
        "Evaluative voting works like the following: every voter votes ranks every candidate using 3 scores: for (1), abstain (0) and against (-1). In the end we evaluate the scores for each candidate and the candidate with the most points wins."
      )
    );
  }
}
