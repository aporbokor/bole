class Score extends cardinalVotingMethod {
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

    max_votes = 10 * voters.length;
    this.vote_to_text = (n) => 9 - n;
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

  get_results_data(cand) {
    return [cand.score, "| Score: "];
  }

  extra_visualize(voters) {
    this.paint_voters();

    for (const cand of candidates) {
      cand.text = cand.score;
      cand.text_label = "score";
    }

    this.set_up_voter_arrows();

    extra_function = function () {
      for (let i = 0; i < candidates.length; i++) {
        voting_machine.draw_circles_around_candidate(candidates[i]);
      }
      if (candidates.some(isin)) {
        voting_machine.resize_voters(clicked_selected);
      }
    };
  }

  stepping_box_func(stepping_box) {
    stepping_box.set_content(
      createP(
        "Score voting works like the following: every voter votes ranks every candidate using 10 scores: from 0 to 9. In the end we evaluate the scores for each candidate and the candidate with the most points wins."
      )
    );
  }
}
