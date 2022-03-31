class ApprovalVoter extends cardinalVotingMethod {
  constructor(candidates) {
    super(candidates);
    this.ranges = [approval_range, max_range];
  }
  extra_visualize(voters) {
    for (let i = 0; i < voters.length; i++) {
      for (let j = 0; j < this.ranges.length; j++) {
        if (voters[i].voted_for[j].length != 0) {
          voters[i].set_color(voters[i].voted_for[j][0].color);
          break;
        }
      }
    }

    extra_function = function () {
      noFill();
      for (let i = 0; i < candidates.length; i++) {
        stroke(candidates[i].color);
        circle(candidates[i].x, candidates[i].y, approval_range * 2);
      }
      stroke(default_stroke);
      if (candidates.some(isin)) {
        for (let i = 0; i < voters.length; i++) {
          if (voters[i].voted_for.some(isin)) {
            voters[i].target_size += selected_size_adder;
          }
        }
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
