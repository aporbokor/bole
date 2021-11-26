class SupplementaryVoter extends RunoffLike{


  prepare_for_voting(){
    super.prepare_for_voting();
    for (let i = 0; i < this.candidates.length; i++){
      this.candidates[i].votes = this.candidates[i].votes.slice(0,2);
    }
  }

  registrate_honest_vote(voter){
    return super.registrate_honest_vote(voter).slice(0,2);
  }

  elliminate_canidates(sub_votes, elliminated){
    if (sub_votes.size <= 2){
      return sub_votes.mins();
    }

    const losers = this.get_majority_losers(sub_votes);
    if (losers.length > 0){
      this.won_by_majority = true;
      return losers;
    }
    let returned = sub_votes.sorted_array().slice(2);
    console.log(returned);
    return returned;
  }
}
