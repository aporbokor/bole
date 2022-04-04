class ApprovalVoter extends cardinalVotingMethod {
  constructor(candidates) {
    super(candidates);
    this.ranges = [approval_range, max_range];
  }

  vote_to_text(vote) {
    if (vote == 0) {
      return "approve";
    }
    return "disapprove";
  }

  get_results_data(cand) {
    return [cand.votes[0], "| Approves: "];
  }

  extra_visualize(voters) {
    this.paint_voters();

    for (const cand of candidates) {
      cand.text = cand.votes[0];
      cand.text_label = "approves";
    }

    this.set_up_voter_arrows();

    extra_function = function () {
      for (let i = 0; i < candidates.length; i++) {
        voter_maschine.draw_circles_around_candidate(candidates[i]);
      }

      if (candidates.some(isin)) {
        voter_maschine.resize_voters(clicked_selected);
      }
    };
  }

  stepping_box_func(stepping_box) {
    stepping_box.set_content(
      createP(
        "Approval voting works like the following: every voter votes for n number of candidates who they approve with. In the end the candidate with the most approves wins. In our visualization every honest voter inside a candidate's approval range will approve with that candidate."
      )
    );
  }
  count_votes() {
    return count_votes_for_ints(
      this.candidates,
      (this.get_votes = function (c) {
        return c.votes[0];
      })
    );
  }
}

function isin(a) {
  return a === clicked_selected;
}
