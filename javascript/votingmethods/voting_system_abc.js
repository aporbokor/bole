// Abstract base-classes

class VotingMethod{

  constructor(candidates){
    ABC_constructor(this, VotingMethod);
    this.candidates = candidates;
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

class RankingVotingMethod extends VotingMethod{
  constructor(candidates){
    super(candidates);
    ABC_constructor(this,RankingVotingMethod);
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

  best_candidate_tier_list(voter){
    let returned = this.candidates.concat([]);
    returned.sort(function (a,b){return voter.distance_to_candidate(a)-voter.distance_to_candidate(b)});
    return returned;
  }

  extra_visualize(voters){
    for (let i = 0; i < voters.length; i++){
      voters[i].color = this.votes_for(voters[i],this.elliminated_visualization).color;
    }

    extra_function = function(){
      if (typeof(clicked_selected) != 'undefined'){
        if (typeof(clicked_selected.voted_for) != 'undefined'){
          let voter = clicked_selected;
          for (let j = 0; j < voter.voted_for.length; j++){
            let candidate = voter.voted_for[j];
            let thick_amount = map(voter.voted_for.length - j, 1, voter.voted_for.length, 1, clicked_selected_stroke_weight);

            stroke(candidate.color);
            strokeWeight(thick_amount);
            line(voter.x, voter.y, candidate.x, candidate.y);
            candidate.grow_by(-candidate_size + 5 + thick_amount*10)
          }
        } else if (typeof(clicked_selected.votes) != 'undefined'){
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

class CondorcetVotingMethod extends RankingVotingMethod{
  constructor(candidates){
    super(candidates);
    ABC_constructor(this,CondorcetVotingMethod);
    this.pairs = new Counter();
  }

  prepare_for_voting(){
    super.prepare_for_voting();
    for (let i = 0; i < this.candidates.length; i++){
      candidates[i].id = i;
    }
  }

  pairviseCount(preference){
    for (let i = 0; i < preference.length; i++){
      for(let j = i; j < preference.length; j++){
        this.pairs.count([preference[i],preference[j]]);
      }
    }
  }

  get_pairs_matrix(){
    let returned = twoDMatrixWithZeros(this.candidates.length, this.candidates.length);

    for (const i of this.pairs.entries()){
      let runner = i[0][0];
      let opponent = i[0][1];
      let win_count = i[1];

      returned[runner.id][opponent.id] = win_count;
    }

    for (let i = 0; i < this.candidates.length; i++){
      let candidate_id = this.candidates[i].id
      returned[candidate_id][candidate_id] = null;
    }

    return returned;
  }

  get_max_voter_of_pairs_matrix(matrix){
    let returned;
    let max = 0;

    for (let i = 0; i < matrix.length; i++){
      let curr = sum(matrix[i]);
      if (curr > max){
        max = curr;
        returned = this.candidates[i];
      }
    }
    return returned;
  }
}
