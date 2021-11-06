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
      let min = mins(this.candidates, i, was);
      if (min != Infinity){
        let min_candidates = this.candidates.filter(function (a) {
          return (!(was.has(a))&(a.votes[i] == min)) })

        result.unshift(min_candidates);

        for (let f = 0; f < min_candidates.length; f++){
          was.add(min_candidates[f]);
        }
      }
    }
    return result;
  }

  extra_visualize(voters){
    for (let i = 0; i < voters.length; i++){
      voters[i].color = voters[i].voted_for[0].color;
    }

    extra_function = function(){
      if (typeof(clicked_selected) != 'undefined'){
        if (typeof(clicked_selected.voted_for) != 'undefined'){
          let voter = clicked_selected;
          for (let j = 0; j < voter.voted_for.length; j++){
            let candidate = voter.voted_for[j];
            stroke(candidate.color);
            strokeWeight(map(voter.voted_for.length - j, 1, voter.voted_for.length, 1, clicked_selected_stroke_weight));
            line(voter.x, voter.y, candidate.x, candidate.y);
          }
        } else {
          let candidate = clicked_selected;
          for (let i = 0; i < voters.length; i++){
            let voter = voters[i];
            let place = voter.voted_for.findIndex(function (a){return a === candidate});
            voter.grow_by(map(voter.voted_for.length-place,1,voter.voted_for.length,-0.5*voter_size, 0.5*voter_size));
          }
        }
      }
    }
  }
}

function mins(candidates_, place, was){
  let min = Infinity;

  for (let j = 0; j < candidates_.length; j++){

    if (!(was.has(candidates_[j]))){
      let votes = candidates_[j].votes[place];

      if (votes < min){
        min = votes;
      }
    }
  }
  return min;
}
