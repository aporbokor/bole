class ApprovalVoter extends NumberVotecountVotingMethod {

  registrate_honest_vote(voter) {
    let counted = this.candidates.filter(function (c) { return voter.distance_to_candidate(c) <= approval_range });

    if (counted.length == 0) {
      let min_tav = Infinity;
      let min_candidate = this.candidates[0];

      for (let i = 0; i < this.candidates.length; i++) {
        let curr_cand = this.candidates[i];
        let tav = voter.distance_to_candidate(curr_cand);
        if (tav < min_tav) {
          min_tav = tav;
          min_candidate = curr_cand;
        }
      }
      counted.push(min_candidate);
    }
    voter.voted_for = counted;

  }

  registrate_vote(voter) {
    if (voter.strategic) {
      this.registrate_strategic_vote(voter);
    } else {
      this.registrate_honest_vote(voter);
    }
    let counted = voter.voted_for;
    for (let i = 0; i < counted.length; i++) {
      counted[i].votes += 1;
    }
  }

  registrate_strategic_vote(voter) {
    let counted = []
    let min_tav = Infinity;
    let min_candidate = this.candidates[0];

    for (let i = 0; i < this.candidates.length; i++) {
      let curr_cand = this.candidates[i];
      let tav = voter.distance_to_candidate(curr_cand);
      if (tav < min_tav) {
        min_tav = tav;
        min_candidate = curr_cand;
      }
    }
    counted.push(min_candidate);
    voter.voted_for = counted;
  }

  extra_visualize(voters) {
    this.display_votes()
    for (let i = 0; i < voters.length; i++) {
      voters[i].set_color(voters[i].voted_for[0].color);
    }

    extra_function = function () {
      noFill()
      for (let i = 0; i < candidates.length; i++) {
        stroke(candidates[i].color)
        circle(candidates[i].x, candidates[i].y, approval_range * 2)
      }
      stroke(default_stroke);
      if (candidates.some(isin)) {
        for (let i = 0; i < voters.length; i++) {
          if (voters[i].voted_for.some(isin)) {
            voters[i].target_size += selected_size_adder;
          }
        }
      }
    }
  }

  stepping_box_func(stepping_box) {
    stepping_box.set_content(createP("Approval voting works like the following: every voter votes for n number of candidates who they approve with. In the end the candidate with the most approves wins. In our visualization every honest voter inside a candidate's approval range will approve with that candidate."))
  }
}

function isin(a) {
  return (a === clicked_selected);
}
