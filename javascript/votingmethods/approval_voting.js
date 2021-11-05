class ApprovalVoter extends VotingMethod{

  constructor(candidates){
    super();
    this.candidates = candidates;
  }

  prepare_for_voting(){
    for (let i = 0; i<this.candidates.length; i++){
      this.candidates[i].votes = 0;
    }
  }

  registrate_honest_vote(voter){
    let counted = this.candidates.filter(function(c){return voter.distance_to_candidate(c) <= approval_range});

    if (counted.length == 0){
      let min_tav = Infinity;
      let min_candidate = this.candidates[0];

      for (let i = 0; i<this.candidates.length; i++){
        let curr_cand = this.candidates[i];
        let tav = voter.distance_to_candidate(curr_cand);
        if (tav < min_tav){
          min_tav = tav;
          min_candidate = curr_cand;
        }
      }
      counted.push(min_candidate);
    }
    console.log(counted)
    voter.voted_for = counted;

  }

  registrate_vote(voter){
    if (voter.strategic){
      this.registrate_strategic_vote(voter);
    }else{
      this.registrate_honest_vote(voter);
    }
    let counted = voter.voted_for;
    for (let i = 0; i < counted.length; i++){
      counted[i].votes += 1;
    }
  }

  registrate_strategic_vote(voter){
    let counted = []
    let min_tav = Infinity;
    let min_candidate = this.candidates[0];

    for (let i = 0; i<this.candidates.length; i++){
      let curr_cand = this.candidates[i];
      let tav = voter.distance_to_candidate(curr_cand);
      if (tav < min_tav){
        min_tav = tav;
        min_candidate = curr_cand;
      }
    }
    counted.push(min_candidate);
    voter.voted_for = counted;
  }

  count_votes(){
    return count_votes_for_ints(this.candidates);
  }

  extra_visualize(voters){
    for (let i = 0; i<voters.length; i++){
      voters[i].color = voters[i].voted_for[0].color;
    }

    extra_function = function(){
      noFill()
      for (let i = 0; i < candidates.length; i++){
        stroke(candidates[i].color)
        circle(candidates[i].x, candidates[i].y, approval_range*2)
      }
      stroke(default_stroke);
      if (candidates.some(isin)){
        for (let i = 0; i < voters.length; i++){
          if (voters[i].voted_for.some(isin)){
            voters[i].target_size += selected_size_adder;
          }
        }
      }
    }
  }
}

function isin(a){
  return (a === clicked_selected);
}
