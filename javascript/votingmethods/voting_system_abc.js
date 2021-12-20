// Abstract base-classes

class VotingMethod{
  // ABC for every votingmethod

  constructor(candidates){
    ABC_constructor(this, VotingMethod);
    this.candidates = candidates;
    for (let i = 0; i<voters.length; i++){
      voters[i].last_voting_sytem = this;
    }
  }

  prepare_for_voting(){
    // Called before registrating any votes
    throw new Error("You must implement a prepare_for_voting method to your VotingMethod class");
  }

  registrate_vote(voter){
    // Called to registrate the vote of a Voter
    throw new Error("You must implement a registrate_vote method to your VotingMethod class");
  }

  count_votes(){
    /* Called to count the votes
       Must return an array of arrays,
       where every nth array contains the candidates who got nth place*/
    throw new Error("You must implement a count_votes method to your VotingMethod class");
  }

  get_ballot_element(ballot){
    /* Given any ballot of candidates must return an html element from that ballot.
       This ellement is then used in the selected_div of voters*/
    throw new Error("You must implement a get_ballot_element method to your VotingMethod class");
  }

  extra_visualize(voters){
    // An mehtod to be used for visualization. It is calles in every frame.
    return undefined;
  }

  stepping_box_func(steppig_box){
    // This method is used for setting up a relationship between the votingmethod and the steppig_box
    stepping_box.set_content(createP('Step by step visualization is not avalable for this votingmethod'));
  }
}

function count_votes_for_ints(candidates, get_votes=function (cand){return cand.votes}){
  /* Given an array of candidates and their votes (represented by numbers)
     returns a ranking for these candidates in the form of VotingMethod.count_votes()*/

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

  // ABC for every votingmethod where tha candidates votes can be represented by numbers
  constructor(candidates){
    super(candidates);
    ABC_constructor(this, NumberVotecountVotingMethod);
    this.ballot_marker = 'tick-marker';
  }

  prepare_for_voting(){
    for (let i = 0; i<this.candidates.length; i++){
      this.candidates[i].votes = 0;
    }
  }

  count_votes(){
    return count_votes_for_ints(this.candidates);
  }

  get_ballot_element(ballot){
    let returned = document.createElement("ul");

    for (let i = 0; i<ballot.length; i++){
      let li = document.createElement("li");
      li.classList.add(this.ballot_marker);
      li.appendChild(ballot[i].get_small_p().elt);
      returned.appendChild(li);
    }
    return returned;
  }

  extra_visualize(voters){
    // Colors the voters based on who they voted for
    for (let i = 0; i<voters.length; i++){
      voters[i].color = voters[i].voted_for.color;
    }
  }
}

class RankingVotingMethod extends VotingMethod{
  // ABC for every votingmethod where the voters need to rank the candidates

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
    // Given a voter and a list of candidates, retuns the voter's preference list for those candidates
    let returned = candidates_.concat([]);
    returned.sort(function (a,b){return voter.distance_to_candidate(a)-voter.distance_to_candidate(b)});
    return returned;
  }

  set_extra_funct(voters){
    // Sets the extra_function ehat is used in visualizations and called in every frame

    extra_function = function(){
      if (typeof(clicked_selected) != 'undefined'){
        if (typeof(clicked_selected.voted_for) != 'undefined'){
          // Highlight the candidates based on their place in the selected voter's preference ballot
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
          // Highlight the voters based on where did tey put the selected candidate in their ballot
          let candidate = clicked_selected;
          for (let i = 0; i < voters.length; i++){
            let voter = voters[i];
            let place = voter.voted_for.findIndex(function (a){return a === candidate});
            if (place != -1){
              voter.grow_by(map(voter.voted_for.length-place,1,voter.voted_for.length,-0.5*voter_size, 0.5*voter_size));
              continue;
            }
            voter.grow_by(-voter_size + 1);
          }
        }
      }
    }
  }

  get_ballot_element(ballot){
    let returned = document.createElement("ol");

    for (let i = 0; i<ballot.length; i++){
      let li = document.createElement("li");
      li.appendChild(ballot[i].get_small_p().elt);
      returned.appendChild(li);
    }
    return returned;
  }

  extra_visualize(voters){
    // Colors the voters based on their first choice and calls set_extra_funct()
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
    for (let i = 0; i < this.candidates.length; i++){
      this.candidates[i].sub_votes_for_visualization = [];
    }
  }

  registrate_honest_vote(voter){
    return this.best_candidate_tier_list(voter, this.candidates);
  }

  registrate_strategic_vote(voter){
    return this.registrate_honest_vote(voter);
  }

  registrate_vote(voter){
    let vote;

    if (voter.strategic){
      vote = this.registrate_strategic_vote(voter);
    }else{
      vote = this.registrate_honest_vote(voter);
    }

    for (let i = 0; i < vote.length; i++){
      vote[i].votes[i] += 1;
    }

    this.voters.push(voter);
    voter.voted_for = vote;
  }

  winner_by_majority(sub_votes){
    // console.log(sub_votes.max_count);
    return (sub_votes.max_count() > (voters.length / 2));
  }
  get_majority_losers(sub_votes){
    if ((this.winner_by_majority(sub_votes)) & (sub_votes.size > 1)){
      const winner_votes = sub_votes.max_count();
      let losers = Array.from(sub_votes).filter(function (a){
        return a[1] != winner_votes;
      });

      let returned = [];
      for (let i = 0; i < losers.length; i++){
        returned.push(losers[i][0]);
      }

      // this.won_by_majority = true;
      return returned;
    }
    return [];
  }

  votes_for(voter, eliminated){
    let tier_list = voter.voted_for.concat([]);
    let index = 0;
    let returned = tier_list[index];

    while (eliminated.has(returned)){
      index++;
      returned = tier_list[index];
    }

    return returned;
  }


  get_last_valid_preference(voter, elliminated){
    let tier_list = voter.voted_for.concat([]);
    let index = tier_list.length-1;
    let returned = tier_list[index];

    while (elliminated.has(returned)){
      index--;
      returned = tier_list[index];
    }
    return returned;
  }

  best_valid_candidate_tier_list(voter, elliminated){
    let tier_list = voter.voted_for.concat([]);
    for (let i = tier_list.length-1; i >= 0; i--){
      let item = tier_list[i];
      if (elliminated.has(item)){
        tier_list.splice(i,1);
      }
    }
    return tier_list;
  }

  set_candidate_votes(elliminated){
    for (let i = 0; i < this.candidates.length; i++){
      let pushed = []
      for(let j = 0; j < this.candidates.length - elliminated.size; j++){
        pushed.push(0);
      }

      this.candidates[i].sub_votes_for_visualization.push(pushed);
    }

    for(let i = 0; i < voters.length; i++){
      let tier_list = this.best_valid_candidate_tier_list(voters[i], elliminated);

      for (let j = 0; j < tier_list.length; j++){
        let candidate = tier_list[j]
        candidate.sub_votes_for_visualization[candidate.sub_votes_for_visualization.length - 1][j] += 1
      }
    }
  }

  stepp_in_visualization(){
    for (let i = 0; i < this.candidates.length; i++){
      this.candidates[i].sub_votes_for_visualization.shift()
    }
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
        let vote = this.votes_for(this.voters[i],elliminated);
        if (vote != undefined){
          sub_votes.count(vote);
        }
      }

      this.set_candidate_votes(elliminated);

      this.sub_votes_for_visualization.push(sub_votes.copy());

      let sub_result = [];

      for (const x of sub_votes.entries()){
        sub_result.push(x);
      }
      console.log(sub_result);

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
      let chosen_candidate = this.votes_for(voters[i],this.elliminated_visualization);
      if (chosen_candidate === undefined){
        voters[i].color = honest_voter_color;
        continue;
      }

      voters[i].color = chosen_candidate.color;
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
          let candidate = cand[0];
          // let returned = createProgress(cand[0].name + ': ',cand[1],voters.length);
          // returned.label.style('color',cand[0].color);
          console.log(candidate.sub_votes_for_visualization);
          return candidate.get_custom_p(candidate.sub_votes_for_visualization[0]);
        })

      let elliminated_candidates = voting_sytem.elliminate_canidates(voting_sytem.sub_votes_for_visualization[voting_sytem.visualization_stepp], voting_sytem.elliminated_visualization)
      let elliminated_div = createDivWithP('These candidate(s) were elliminated:');

      for (const x of voting_sytem.elliminated_visualization.values()){
        x.hide();
      }
      console.log(elliminated_candidates);
      for (let i = 0; i < elliminated_candidates.length; i++){
        elliminated_div.child(elliminated_candidates[i].get_custom_p(elliminated_candidates[i].sub_votes_for_visualization[0]));
      }

      elliminated_div.child(voting_sytem.get_reasoning_text(elliminated_candidates));

      for (let i = 0; i < elliminated_candidates.length; i++){
        voting_sytem.elliminated_visualization.add(elliminated_candidates[i]);
      }

      content.child(res);
      content.child(elliminated_div);

      voting_sytem.stepp_in_visualization();


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
  // ABC for condorcet_methods

  constructor(candidates){
    super(candidates);
    ABC_constructor(this, CondorcetVotingMethod);
  }

  prepare_for_voting(){
    super.prepare_for_voting();
    for (let i = 0; i < this.candidates.length; i++){
      candidates[i].id = i;
    }

    // Create outranking_matrix, with null-s in the main diagnal
    this.outranking_matrix = twoDMatrixWithZeros(this.candidates.length, this.candidates.length);
    set_diagnal(this.outranking_matrix, null);

    this.candidate_names = [];

    for (let i = 0; i < this.candidates.length; i++){
      this.candidate_names.push(this.candidates[i].name);
    }
  }

  registrate_vote(voter){
    // Refreshing the outranking matrix based on the voter's ballot
    let tier_list = this.best_candidate_tier_list(voter);

    for (let i = 0; i < tier_list.length; i++){
      let runner = tier_list[i].id;
      for (let j = i+1; j < tier_list.length; j++){
        let opponent = tier_list[j].id;
        this.outranking_matrix[runner][opponent] += 1;
      }
      tier_list[i].votes[i] += 1;
    }

    voter.voted_for = tier_list;
  }

  get_outranking_matrix_from_ballot(ballot){
    // Transform a ballot to an outranking matrix. Currently only used in visualization
    let returned = twoDMatrixWithZeros(this.candidates.length, this.candidates.length);
    set_diagnal(this.relative_strength_matrix, null);

    for (let i = 0; i<ballot.length; i++){
      let runner = ballot[i].id;
      for (let j = i+1; j<ballot.length; j++){
        let opponent = ballot[j].id;
        returned[runner][opponent] += 1;
      }
    }
    return returned;
  }

  calc_relative_strength_matrix(){
    // Creates a relative_strength_matrix based of the outranking_matrix
    this.relative_strength_matrix = twoDMatrixWithZeros(this.candidates.length, this.candidates.length);
    set_diagnal(this.relative_strength_matrix, null);

    for (let i = 0; i < this.candidates.length; i++){
      for (let j = 0; j < this.candidates.length; j++){
        if (i === j){
          continue;
        }
        this.relative_strength_matrix[i][j] = this.outranking_matrix[i][j] - this.outranking_matrix[j][i];
      }
    }
  }

  get_condorcet_winner(){
    /* Gets the condorcet winner from the relative_strength_matrix.
       The voter_table_matrix must be calculated before calling this method.
       If a condorcet winner doesn't exists returns null.*/

    for (let i = 0; i < this.candidates.length; i++){
        let winner = this.relative_strength_matrix[i].every(
          function(curr){
            if (curr == null){
              return true;
            }

            return curr >= 0;
          })

        if (winner){
          return this.candidates[i];
      }
    }
    return null;
  }

  show_outranking_matrix(){
    // First stepp in step_by_stepp visualization

    let voting_sytem = this.parent_box.visualized_system;
    this.random_voter = random(voters);
    clicked_selected = this.random_voter;
    let voter_res = this.random_voter.voted_for;
    this.random_voter.color = honest_voter_color;

    let voter_table_matrix = voting_sytem.get_outranking_matrix_from_ballot(voter_res);
    let voter_table = table_from_matrix(voter_table_matrix, voting_sytem.candidate_names, voting_sytem.candidate_names);

    let first_text = document.createElement("p");
    first_text.innerHTML = `After we have recived every voters ballot, now we can get to work. Fot each voter's ballot we are going to count how many times has been each candidate placed before each candidate. For example let's see what does the ballot of the voter named ${this.random_voter.get_simple_name_p().outerHTML} (marked with the default voter color) looks like`

    let voter_res_list = voting_sytem.get_ballot_element(voter_res);

    let second_text = document.createElement("p");

    second_text.innerHTML = `${voter_res[0].get_simple_name_p().outerText} defeated every candidate all the way to the last placed ${voter_res[voter_res.length-1].get_simple_name_p().outerText}.<br>${voter_res[1].get_simple_name_p().outerHTML} also defeated every candidate below them. But this candidate didn't beat ${voter_res[0].get_simple_name_p().outerText}. We can do this kind of calculation to every candidate in the ballot to get the following matrix:`

    let third_text = document.createElement("p");
    third_text.innerHTML = "If we do this for every voter's ballot, than we will know that how many times has candidate X been placed before candidate Y. "+
    "We can place these findings in a table like so: ";
    let table = table_from_matrix(voting_sytem.outranking_matrix,voting_sytem.candidate_names,voting_sytem.candidate_names);

    let content = document.createElement("div");
    content.appendChild(first_text);
    content.appendChild(voter_res_list);
    content.appendChild(second_text);
    content.appendChild(voter_table);
    content.appendChild(third_text);
    content.appendChild(table);
    content.appendChild(createP("We call this kind of table an outranking matrix.(O)").elt);
    this.parent_box.set_content(content);

    this.parent_box.next_func(voting_sytem.show_relative_strength_matrix);
  }

  show_relative_strength_matrix(){
    // Second stepp in step_by_stepp visualization

    this.random_voter.color = this.random_voter.voted_for[0].color;
    let voting_sytem = this.parent_box.visualized_system;
    let content = document.createElement("div");

    let text = document.createElement("p");
    text.innerHTML = "From the outranking matrix we can create a relative strength matrix (R). Basicly every R(i,j) equals O(i,j) - O(j,i). This kind of matrix shows us, that how by how many times did each candidate i beat candidate j. If this number is negative than j has beaten i more times.";

    let table = table_from_matrix(voting_sytem.relative_strength_matrix, voting_sytem.candidate_names, voting_sytem.candidate_names);

    content.appendChild(text);
    content.appendChild(table);

    this.parent_box.set_content(content);
    this.parent_box.next_func(voting_sytem.show_first);
  }

  show_first(){
    // The first step_by_stepp visualization step which every class needs to define which inherits from CondorcetVotingMethod
    throw new Error("You must define a show_first method to your CondorcetVotingMethod class");
  }

  stepping_box_func(steppig_box){
    // Sets up stepping_box

    this.stepping_box = steppig_box;
    steppig_box.visualized_system = this;

    stepping_box.show_next();

    steppig_box.next_func(this.show_outranking_matrix);

  }
}
