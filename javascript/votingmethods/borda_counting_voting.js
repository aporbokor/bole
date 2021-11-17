class BordaCounting extends RankingVotingMethod{

  prepare_for_voting(){
    for (let i = 0; i<this.candidates.length; i++){
      this.candidates[i].votes = 0;
    }
    max_votes = increasing_sum(1, this.candidates.length) * voter_population * 0.5;
  }

  registrate_honest_vote(voter){
    return this.best_candidate_tier_list(voter);
  }

  registrate_strategic_vote(voter){
    let winner_tier_list = this.best_candidate_tier_list(voter, seems_win_candidates);
    let top = winner_tier_list[0];
    let bottom = winner_tier_list.slice(1);

    let loser_tier_list = this.best_candidate_tier_list(voter, seems_lose_candidates);

    let returned = loser_tier_list.concat(bottom);
    returned.unshift(top);

    return returned;
  }

  registrate_vote(voter){
    let tier_list;

    if (voter.strategic){
      tier_list = this.registrate_strategic_vote(voter);
    }else{
      tier_list = this.registrate_honest_vote(voter);
    }

    for (let i = 0; i < tier_list.length; i++){
      tier_list[i].votes += (tier_list.length - i);
    }

    voter.voted_for = tier_list;
  }

  count_votes(){
    return count_votes_for_ints(this.candidates);
  }
}
