class InstantRunOffVoter extends VotingMethod{

  constructor(candidates){
    super();
    this.candidates = candidates;
  }

  prepare_for_voting(){
    for (let i = 0; i<this.candidates.length; i++){
      let votes = [];
      for (let j = 0; j<this.candidates.length; j++){
        votes.push(0);
      }
      this.candidates[i].votes = votes;
    }
  }

  registrate_honest_vote(voter){
    voter.voted_for = best_candidate_tier_list(voter, this.candidates);
  }

  registrate_vote(voter){
    this.registrate_honest_vote(voter);
    for (let i = 0; i < voter.voted_for.length; i++){
      voter.voted_for[i].votes[i] += 1;
    }
  }

  count_votes(){
    let result = [];
    let was = new Set();

    for (let i = 0; i < this.candidates.length; i++){
      let min_candidates = mins(this.candidates, i, was);
      result.unshift(min_candidates)
      // let min = Infinity;
      // let min_candidates = [];
      //
      // for (let j = 0; j < this.candidates.length; j++){
      //
      //   if (!(was.has(this.candidates[j]))){
      //     let votes = this.candidates[j].votes[i];
      //
      //     if (votes < min){
      //       min = votes;
      //       min_candidates = [];
      //     }
      //     if (votes === min){
      //       min_candidates.push(this.candidates[j]);
      //     }
      //   }
      // }
      // for (let f = 0; f < min_candidates.length; f++){
      //   was.add(min_candidates[i]);
      // }
      // if (min_candidates.length != 0){
      //   result.unshift(min_candidates);
      // }
    }
    return result;
  }
}

function mins(candidates_, place, was){
  let min = Infinity;
  let min_candidates = [];

  for (let j = 0; j < candidates_.length; j++){

    if (!(was.has(candidates_[j]))){
      let votes = candidates_[j].votes[place];

      if (votes < min){
        min = votes;
        min_candidates = [];
      }
      if (votes === min){
        min_candidates.push(candidates_[j]);
      }
    }
  }
  for (let f = 0; f < min_candidates.length; f++){
    was.add(min_candidates[f]);
  }
  return min_candidates;
}
