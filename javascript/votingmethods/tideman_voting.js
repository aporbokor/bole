class TideMan extends CondorcetVotingMethod{

  registrate_vote(voter){
    let voter_preference = this.best_candidate_tier_list(voter);
    this.pairviseCount(voter_preference);

  }

  count_votes(){
    
  }
}
