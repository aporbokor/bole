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

class NumberVotecountVotingMethod extends VotingMethod{
  constructor(candidates){
    super(candidates);
    ABC_constructor(this, NumberVotecountVotingMethod);
  }

  prepare_for_voting(){
    for (let i = 0; i<this.candidates.length; i++){
      this.candidates[i].votes = 0;
    }
  }

  count_votes(){
    return count_votes_for_ints(this.candidates);
  }

  extra_visualize(voters){
    for (let i = 0; i<voters.length; i++){
      voters[i].color = voters[i].voted_for.color;
    }
  }
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

  best_candidate_tier_list(voter, candidates_=this.candidates){
    let returned = candidates_.concat([]);
    returned.sort(function (a,b){return voter.distance_to_candidate(a)-voter.distance_to_candidate(b)});
    return returned;
  }

  set_extra_funct(voters){
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

  extra_visualize(voters){

    for (let i = 0; i < voters.length; i++){
      voters[i].color = voters[i].voted_for[0].color;
    }

    this.set_extra_funct(voters);
  }
}

class RunoffLike extends RankingVotingMethod{
  constructor(candidates){
    super(candidates);
    ABC_constructor(this, RunoffLike);
    this.voters = [];
    this.explaining_text = '[placeholder text]';
  }

  prepare_for_voting(){
    super.prepare_for_voting();
    this.elliminated_visualization = new Set();
  }

  registrate_honest_vote(voter){
    voter.voted_for = this.best_candidate_tier_list(voter, this.candidates);
  }

  registrate_vote(voter){
    this.registrate_honest_vote(voter);
    for (let i = 0; i < voter.voted_for.length; i++){
      voter.voted_for[i].votes[i] += 1;
    }
    this.voters.push(voter);
  }

  votes_for(voter, eliminated){
    let tier_list = voter.voted_for;
    let index = 0;
    let returned = tier_list[index];

    while (eliminated.has(returned)){
      index++;
      returned = tier_list[index];
    }
    return returned;
  }


  get_last_valid_preference(voter, elliminated){
    let tier_list = voter.voted_for;
    let index = tier_list.length-1;
    let returned = tier_list[index];

    while (elliminated.has(returned)){
      index--;
      returned = tier_list[index];
    }
    return returned;
  }

  elliminate_canidates(sub_votes, elliminated){
    throw new Error("You must implement an elliminate_canidates method to your RankingVotingMethod class");
  }

  get_reasoning_text(elliminated_candidates){
      return createP('[placeholder text]');
  }

  count_votes(){
    let result = [];
    let elliminated = new Set();

    this.sub_results = [];
    this.sub_votes_for_visualization = [];

    while (elliminated.size < this.candidates.length){
      let sub_votes = new Counter(1);

      for (let i = 0; i < this.voters.length; i++){
        sub_votes.count(this.votes_for(this.voters[i],elliminated));
      }

      this.sub_votes_for_visualization.push(sub_votes.copy());

      let sub_result = [];

      for (const x of sub_votes){
        sub_result.push(x)
      }

      this.sub_results.push(count_votes_for_ints(sub_result, function(cand){return cand[1]}));

      let new_ellimination = this.elliminate_canidates(sub_votes, elliminated);

      result.unshift(new_ellimination);

      for (let j = 0; j < new_ellimination.length; j++){
        elliminated.add(new_ellimination[j]);
      }
    }
    console.log(this.sub_votes_for_visualization);
    return result;
  }

  color_voters(){
    for (let i = 0; i < voters.length; i++){
      voters[i].color = this.votes_for(voters[i],this.elliminated_visualization).color
    }
  }

  show_stepping_box_content(){
    let voting_sytem = this.parent_box.visualized_system;
    let content = createDiv();

    if (voting_sytem.visualization_stepp == 0){
      extra_function = function(){
        for (const y of stepping_box.visualized_system.elliminated_visualization.values()){
          y.grow_by(-0.4*candidate_size);
        }
      }
    }

    content.child(createP('This is the ' + int_to_str(voting_sytem.visualization_stepp) + ' step'));

    if (voting_sytem.visualization_stepp < voting_sytem.sub_results.length -1){
      voting_sytem.color_voters();

      let explaining_p = createP(voting_sytem.explaining_text);
      content.child(explaining_p);
      explaining_p.class('explaining_p')


      let subresult = voting_sytem.sub_results[voting_sytem.visualization_stepp];

      let res = get_results_elements(subresult,
        function (cand){
          let returned = createProgress(cand[0].name + ': ',cand[1],voters.length);
          returned.label.style('color',cand[0].color);
          return returned;
        })

      let elliminated_candidates = voting_sytem.elliminate_canidates(voting_sytem.sub_votes_for_visualization[voting_sytem.visualization_stepp], voting_sytem.elliminated_visualization)
      let elliminated_div = createDivWithP('These candidate(s) were elliminated:');

      for (const x of voting_sytem.elliminated_visualization.values()){
        x.hide();
      }
      console.log(elliminated_candidates);
      for (let i = 0; i < elliminated_candidates.length; i++){
        elliminated_div.child(elliminated_candidates[i].get_small_p());
      }


      elliminated_div.child(voting_sytem.get_reasoning_text(elliminated_candidates));

      for (let i = 0; i < elliminated_candidates.length; i++){
        voting_sytem.elliminated_visualization.add(elliminated_candidates[i]);
      }

      content.child(res);
      content.child(elliminated_div);


    } else {
      content.child(createP('The winner has been chosen'));
      voting_sytem.set_final_extra_function();
      this.parent_box.hide_next();
    }

    this.parent_box.set_content(content);
    voting_sytem.visualization_stepp += 1;
  }

  stepping_box_func(steppig_box){
    this.steppig_box = steppig_box;
    steppig_box.visualized_system = this;

    this.visualization_stepp = 0;
    stepping_box.show_next();

    steppig_box.next_func(this.show_stepping_box_content);

  }

  set_final_extra_function(){
    this.elliminated_visualization.forEach(function (candidate){candidate.appear()})
    this.elliminated_visualization.clear();
    this.extra_visualize(voters);
  }

  extra_visualize(voters){
    for (let i = 0; i < voters.length; i++){
      voters[i].color = this.votes_for(voters[i],this.elliminated_visualization).color;
    }
    super.set_extra_funct(voters);
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
