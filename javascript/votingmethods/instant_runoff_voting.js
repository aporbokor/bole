class InstantRunOffVoter extends VotingMethod{

  constructor(candidates){
    super();
    this.candidates = candidates;
    this.voters = [];
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

  count_votes(){
    let result = [];
    let elliminated = new Set();

    this.sub_results = [];

    while (elliminated.size < this.candidates.length){
      let sub_votes = new Counter(1);

      for (let i = 0; i < this.voters.length; i++){
        sub_votes.count(this.votes_for(this.voters[i],elliminated));
      }
      let sub_result = [];

      for (const x of sub_votes){
        sub_result.push(x)
      }

      this.sub_results.push(count_votes_for_ints(sub_result, function(cand){return cand[1]}));

      let mins = sub_votes.mins();
      result.unshift(mins);

      for (let j = 0; j < mins.length; j++){
        elliminated.add(mins[j]);
      }
    }
    return result;
  }

  color_voters(){
    for (let i = 0; i < this.voters.length; i++){
      this.voters[i].color = this.votes_for(this.voters[i],this.elliminated_visualization).color
    }
  }

  show_stepping_box_content(){
    let voting_sytem = this.parent_box.visualized_system;
    let content = createDiv();

    content.child(createP('This is the ' + int_to_str(voting_sytem.visualization_stepp) + ' step'));

    if (voting_sytem.visualization_stepp < voting_sytem.sub_results.length){
      content.child(createP('Now we are going to run the election counting the best-ranked not-elliminated candidates of each voters preference-list'));

      let subresult = voting_sytem.sub_results[voting_sytem.visualization_stepp];

      let res = get_results_elements(subresult,
        function (cand){
          let returned = createProgress(cand[0].name + ': ',cand[1],voters.length);
          returned.label.style('color',cand[0].color);
          return returned;
        })

      let elliminated_candidates = subresult[subresult.length-1];
      let elliminated_div = createDivWithP('These candidate(s) were elliminated:');

      for (let i = 0; i < elliminated_candidates.length; i++){
        elliminated_div.child(elliminated_candidates[i][0].get_small_p());
        voting_sytem.elliminated_visualization.add(elliminated_candidates[i]);
      }

      elliminated_div.child(createP('The elliminated candidates in this votecounting had ' + elliminated_candidates[0][1] + ' votes'))

      content.child(res);
      content.child(elliminated_div);
      console.log(voting_sytem.elliminated_visualization);
      voting_sytem.color_voters();


    } else {
      content.child(createP('The winner has been chosen'));
      this.hide();
    }

    this.parent_box.set_content(content);
    voting_sytem.visualization_stepp += 1;
  }

  stepping_box_func(steppig_box){
    this.steppig_box = steppig_box;
    steppig_box.visualized_system = this;

    this.elliminated_visualization = new Set();
    this.visualization_stepp = 0;
    stepping_box.show_next();

    steppig_box.next_func(this.show_stepping_box_content);
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
