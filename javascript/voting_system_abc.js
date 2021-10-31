// Abstract base-classes

class VotingMethod{

  constructor(){
    if (this.constructor == VotingMethod){
      throw new Error("Abstract baseclass can't be initialized");
    }
  }

  prepare_for_voting(){
    throw new Error("You must implement a prepare_for_voting method to your VotingMethod class");
  }

  registrate_honest_vote(voter){
      throw new Error("You must implement a registrate_honest_vote method to your VotingMethod class");
  }

  registrate_strategic_vote(voter){
      throw new Error("You must implement a registrate_strategic_vote method to your VotingMethod class");
  }

  registrate_vote(voter){
      throw new Error("You must implement a registrate_vote method to your VotingMethod class");
  }

  count_votes(){
      throw new Error("You must implement a count_votes method to your VotingMethod class");
  }
}

function count_votes_for_ints(candidates){
  let result = [];
  let used_votecounts = new Set();

  for (let i = 0; i<candidates.length; i++){
    let append = [];
    let max_counts = -1;
    for (let j = 0; j<candidates.length; j++){
      let votes = candidates[j].votes;
      if ( (votes > max_counts) & (!(used_votecounts.has(votes)))){
        max_counts = votes;
        append = [];
      }
      if (votes == max_counts){
        append.push(candidates[j]);
      }
    }
    if (append.length > 0){
      result.push(append);
      used_votecounts.add(max_counts);
    }
  }
  return result;
}