class AntiPlurarityVoter extends NumberVotecountVotingMethod{

  registrate_honest_vote(voter){

  }

  registrate_strategic_vote(voter){
    let voted_for_candidate;

    
    voter.voted_for = voted_for_candidate;
  }

  registrate_vote(voter){

  }

  count_votes(){
    return super.count_votes().reverse();
  }
}
