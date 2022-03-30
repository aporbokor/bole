class evaluativeVoter extends cardinalVotingMethod {
  registrate_honest_vote(voter) {
    let for_range = approval_range * 0.8;
    let abstain_range = approval_range * 1.5;
    let prefs = this.candidates.filter(function (c) {
      return voter.distance_to_candidate(c) >= for_range;
    });
    let abstains = this.candidates.filter(function (c) {
      return voter.distance_to_candidate(c) >= abstain_range;
    });
    for (let i = 0; i < prefs.length; i++) {
      prefs[i].votes[0] += 1;
    }
    for (let j = 0; j < abstains.length; j++) {
      abstains[j].votes[1] += 1;
    }
  }
  registrate_strategic_vote(voter) {}
}
