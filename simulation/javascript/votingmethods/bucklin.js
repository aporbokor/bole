class Bucklin extends RankingVotingMethod {
  prepare_for_voting() {
    super.prepare_for_voting();
  }

  registrate_honest_vote(voter) {
    return this.best_candidate_tier_list(voter);
  }
  
  

  registrate_vote(voter) {
    let tier_list;
    tier_list = this.registrate_honest_vote(voter);
    this.update_votecounts(tier_list);
    voter.voted_for = tier_list;
  }
}
