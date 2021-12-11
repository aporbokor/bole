class AntiPlurarityVoter extends NumberVotecountVotingMethod{

  registrate_vote(voter){
    let voted_for_candidate;

    //code
    
    voted_for_candidate.votes += 1;
    voter.voted_for = voted_for_candidate;
  }

  count_votes(){
    return super.count_votes().reverse();
  }
}
