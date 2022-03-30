class ApprovalVoter extends cardinalVotingMethod {
  extra_visualize(voters) {
    for (let i = 0; i < voters.length; i++) {
      voters[i].set_color(voters[i].voted_for[0].color);
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
}

function isin(a) {
  return a === clicked_selected;
}
