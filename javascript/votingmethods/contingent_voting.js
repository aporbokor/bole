class ContingentVoter extends RunoffLike{

  registrate_honest_vote(voter){
    voter.voted_for = super.registrate_honest_vote(voter).slice(0,2);
  }

  elliminate_canidates(sub_votes, elliminated){
    const losers = this.get_majority_losers(sub_votes);
    if (losers.length > 0){
      this.won_by_majority = true;
      return losers;
    }
    return sub_votes.sorted_array().slice(2);
  }
}
