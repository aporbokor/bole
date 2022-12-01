class Plurality extends NumberVotecountVotingMethod {
  register_honest_vote(voter) {
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
    min_candidate.votes += 1;
    voter.voted_for = min_candidate;
  }

  register_strategic_vote(voter) {
    let min_tav = Infinity;
    let min_candidate = seems_win_candidates[0];

    for (let i = 0; i < seems_win_candidates.length; i++) {
      let curr_cand = seems_win_candidates[i];
      let tav = voter.distance_to_candidate(curr_cand);
      if (tav < min_tav) {
        min_tav = tav;
        min_candidate = curr_cand;
      }
    }
    min_candidate.votes += 1;
    voter.voted_for = min_candidate;
  }

  register_vote(voter) {
    if (voter.strategic & (seems_win_candidates.length >= 2)) {
      this.register_strategic_vote(voter);
      return;
    }
    this.register_honest_vote(voter);
  }

  stepping_box_func(stepping_box) {
    stepping_box.set_content(
      createP(
        "Plurality voting works like the following: every voter votes for their favorite  candidate, and then we count the votes. The candidate with the most votes wins."
      )
    );
  }
}

// Testing stuff
// let voters = [new Voter(0, 0, false), new Voter(1, 1, false), new Voter(0.5, 0.5, false), new Voter(0.1, 0.1, false)];
//
// let candidates = [new Candidate(0, 0, undefined), new Candidate(0.5, 0.5, undefined), new Candidate(1, 1, undefined)];
//
// let votings = new Plurality(candidates);
// votings.prepare_for_voting()
//
// console.log(votings);
//
// for (let i = 0; i< voters.length; i++){
//   votings.register_vote(voters[i]);
// }
//
// console.log(candidates);
// console.log(voters);
// console.log(votings.count_votes());
