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

  extra_visualize(voters){
    return undefined;
  }

  stepping_box_func(steppig_box){
    stepping_box.set_content(createP('Step by step visualization is not avalable for this votingmethod'))
  }
}

function count_votes_for_ints(candidates, get_votes=function (cand){return cand.votes}){
  let result = [];
  let used_votecounts = new Set();

  for (let i = 0; i<candidates.length; i++){
    let append = [];
    let max_counts = -1;
    for (let j = 0; j<candidates.length; j++){
      let votes = get_votes(candidates[j]);
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

function best_candidate_tier_list(voter, candidates){
  let returned = candidates.concat([]);
  returned.sort(function (a,b){return voter.distance_to_candidate(a)-voter.distance_to_candidate(b)});
  return returned;
}
