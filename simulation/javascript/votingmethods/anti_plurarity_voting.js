class AntiPlurarityVoter extends NumberVotecountVotingMethod {
  registrate_honest_vote(voter) {
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

  registrate_strategic_vote(voter) {
    let min_distance = Infinity;
    let min_candidate = seems_win_candidates[0];

    for (let i = 0; i < seems_win_candidates.length; i++) {
      let curr_cand = seems_win_candidates[i];
      let distance = voter.distance_to_candidate(curr_cand);
      if (distance < min_distance) {
        min_distance = distance;
        min_candidate = curr_cand;
      }
      if (min_candidate != seems_win_candidates[0]) {
        seems_win_candidates[0].votes += 1;
        voter.voted_for = seems_win_candidates[0];
      } else {
        seems_win_candidates[1].votes += 1;
        voter.voted_for = seems_win_candidates[1];
      }
    }
  }

  registrate_vote(voter) {
    this.registrate_honest_vote(voter);
  }

  count_votes() {
    return super.count_votes().reverse();
  }
}
