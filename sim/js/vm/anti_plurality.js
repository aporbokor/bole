class Anti_plurality extends NumberVotecountVotingMethod {
  register_honest_vote(voter) {
    let max_distance = 0;
    let max_candidate = this.candidates[0];

    for (let i = 0; i < this.candidates.length; i++) {
      let curr_cand = this.candidates[i];
      let distance = voter.distance_to_candidate(curr_cand);
      if (distance > max_distance) {
        max_distance = distance;
        max_candidate = curr_cand;
      }
    }
    max_candidate.votes += 1;
    voter.voted_for = max_candidate;
  }

  register_strategic_vote(voter) {
    let max_distance = 0;
    let max_candidate = seems_win_candidates[0];

    for (let i = 0; i < seems_win_candidates.length; i++) {
      let curr_cand = seems_win_candidates[i];
      let distance = voter.distance_to_candidate(curr_cand);
      if (distance > max_distance) {
        max_distance = distance;
        max_candidate = curr_cand;
      }
    }
    max_candidate.votes += 1;
    voter.voted_for = max_candidate;
  }

  register_vote(voter) {
    if (voter.strategic & (seems_win_candidates.length >= 2)) {
      this.register_strategic_vote(voter);
    } else {
      this.register_honest_vote(voter);
    }
  }

  count_votes() {
    return super.count_votes().reverse();
  }

  steping_box_func(steping_box) {
    steping_box.set_content(
      createP(
        "Anti-plurality voting works like the following: every voter votes for their most hated candidate, and then we count the votes. The candidate with the least votes wins."
      )
    );
  }
}
