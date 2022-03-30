// Abstract base-classes

class VotingMethod {
  // ABC for every votingmethod

  constructor(candidates) {
    ABC_constructor(this, VotingMethod);
    this.candidates = candidates;
    for (let i = 0; i < voters.length; i++) {
      voters[i].last_voting_sytem = this;
    }
  }

  prepare_for_voting() {
    // Called before registrating any votes
    throw new Error(
      'You must implement a prepare_for_voting method to your VotingMethod class'
    );
  }

  registrate_vote(voter) {
    // Called to registrate the vote of a Voter
    throw new Error(
      'You must implement a registrate_vote method to your VotingMethod class'
    );
  }

  count_votes() {
    /* Called to count the votes
       Must return an array of arrays,
       where every nth array contains the candidates who got nth place*/
    throw new Error(
      'You must implement a count_votes method to your VotingMethod class'
    );
  }

  get_ballot_element(ballot) {
    /* Given any ballot of candidates must return an html element from that ballot.
       This ellement is then used in the selected_div of voters*/
    throw new Error(
      'You must implement a get_ballot_element method to your VotingMethod class'
    );
  }

  get_results_data(cand) {
    // Defines what data should be displayed in the results_div
    return [cand.votes, '|votes: '];
  }

  extra_visualize(voters) {
    // An mehtod to be used for visualization. It is calles in every frame.
    return undefined;
  }

  stepping_box_func(steppig_box) {
    // This method is used for setting up a relationship between the votingmethod and the steppig_box
    stepping_box.set_content(
      createP(
        'Step by step visualization is not avalable for this votingmethod'
      )
    );
  }
}

function count_votes_for_ints(
  candidates,
  get_votes = function (cand) {
    return cand.votes;
  }
) {
  /* Given an array of candidates and their votes (represented by numbers)
     returns a ranking for these candidates in the form of VotingMethod.count_votes()*/

  let result = [];
  let used_votecounts = new Set();

  for (let i = 0; i < candidates.length; i++) {
    let append = [];
    let max_counts = -1;
    for (let j = 0; j < candidates.length; j++) {
      let votes = get_votes(candidates[j]);
      if ((votes > max_counts) & !used_votecounts.has(votes)) {
        max_counts = votes;
        append = [];
      }
      if (votes == max_counts) {
        append.push(candidates[j]);
      }
    }
    if (append.length > 0) {
      result.push(append);
      used_votecounts.add(max_counts);
    }
  }
  return result;
}

class cardinalVotingMethod extends VotingMethod {
  constructor(candidates) {
    super(candidates);
    ABC_constructor(this, cardinalVotingMethod);
    this.ballot_marker = 'tick-marker';
    this.ranges = []
  }

  prepare_for_voting() {
    for (let i = 0; i < this.candidates.length; i++) {
      this.candidates[i].votes = [];
      for (let j = 0; j < this.ranges.length; j++) {
        this.candidates[i].votes.push(0)
      } 
    }
  }

  registrate_honest_vote(voter) {
    let arr = [];
    for (let i = 0; i < this.candidates.length; i++) {
      if (voter.distance_to_candidate(this.candidates[i]) <= approval_range) {
        this.candidates[i].votes[0] += 1;
        arr.push(this.candidates[i]);
      } else {
        this.candidates[i].votes[1] += 1;
      }
    }
    voter.voted_for = arr;
  }

  registrate_strategic_vote(voter) {
    let prefs = voter.honest_preference(this.candidates);
    prefs[0].votes[0] += 1;
    voter.voted_for = [prefs[0]];
    let k = this.ranges.length;
    for (let i = 1; i < prefs.length; i++) {
      prefs[i].votes[k] += 1;
    }
  }

  registrate_vote(voter) {
    if (voter.strategic) {
      this.registrate_honest_vote(voter);
    } else {
      this.registrate_strategic_vote(voter);
    }
    if (voter.voted_for.length == 0) {
      let pref = voter.honest_preference(this.candidates);
      for (let i = 1; i < pref.length; i++) {
        pref[i].votes[1] += 1;
      }
      pref[0].votes[0] += 1;
      voter.voted_for = [pref[0]];
    }
  }

  count_votes() {
    return count_votes_for_ints(
      this.candidates,
      (this.get_votes = function (c) {
        return c.votes[0];
      })
    );
  }

  get_ballot_element(length)


}

class NumberVotecountVotingMethod extends VotingMethod {
  // ABC for every votingmethod where tha candidates votes can be represented by numbers
  constructor(candidates) {
    super(candidates);
    ABC_constructor(this, NumberVotecountVotingMethod);
    this.ballot_marker = 'tick-marker';
  }

  prepare_for_voting() {
    for (let i = 0; i < this.candidates.length; i++) {
      this.candidates[i].votes = 0;
    }
  }

  count_votes() {
    return count_votes_for_ints(this.candidates);
  }

  get_ballot_element(ballot) {
    console.log(ballot);
    let returned = document.createElement('ul');

    for (let i = 0; i < ballot.length; i++) {
      let li = document.createElement('li');
      li.classList.add(this.ballot_marker);
      li.appendChild(ballot[i].get_name_p());
      returned.appendChild(li);
    }
    return returned;
  }

  display_votes() {
    //Displays the votes of the candidates
    for (let i = 0; i < candidates.length; i++) {
      candidates[i].text = candidates[i].votes;
    }
  }

  extra_visualize(voters) {
    // Colors the voters based on who they voted for
    for (let i = 0; i < voters.length; i++) {
      voters[i].set_color(voters[i].voted_for.color);
    }

    this.display_votes();
  }
}

class RankingVotingMethod extends VotingMethod {
  // ABC for every votingmethod where the voters need to rank the candidates

  constructor(candidates) {
    super(candidates);
    ABC_constructor(this, RankingVotingMethod);
  }

  prepare_for_voting() {
    for (let i = 0; i < this.candidates.length; i++) {
      let votes = [];
      for (let j = 0; j < this.candidates.length; j++) {
        votes.push(0);
      }
      this.candidates[i].votes = votes;
    }
  }

  registrate_honest_vote(voter) {
    return this.best_candidate_tier_list(voter, this.candidates);
  }

  registrate_strategic_vote(voter) {
    return this.registrate_honest_vote(voter);
  }

  registrate_vote(voter) {
    let ballot;

    if (voter.strategic) {
      ballot = this.registrate_strategic_vote(voter);
    } else {
      ballot = this.registrate_honest_vote(voter);
    }

    this.update_votecounts(ballot);

    voter.voted_for = ballot;
  }

  best_candidate_tier_list(voter, candidates_ = this.candidates) {
    // Given a voter and a list of candidates, retuns the voter's preference list for those candidates
    return voter.honest_preference(candidates_);
  }

  update_votecounts(ballot) {
    // Updates the candidates' votecounts based on a ballot
    for (let i = 0; i < ballot.length; i++) {
      ballot[i].votes[i] += 1;
    }
  }

  set_extra_funct(voters) {
    // Sets the extra_function ehat is used in visualizations and called in every frame

    for (let i = 0; i < voters.length; i++) {
      voters[i].on_select = function () {
        if (this.arrows_from.length > 0) {
          return null;
        }

        for (let j = 0; j < this.voted_for.length; j++) {
          let cand = this.voted_for[j];
          let arr = new Arrow(
            cand.color,
            `${this.name}'s ballot arrow`,
            this,
            cand
          );

          arr.text = int_to_serial_number(j + 1);
          arr.text_label = `${cand.get_name_p().outerHTML}'s place in ${
            this.get_name_p().outerHTML
          }'s ballot`;
        }
      };
    }

    extra_function = function () {
      if (typeof clicked_selected != 'undefined') {
        if (typeof clicked_selected.voted_for != 'undefined') {
          // Highlight the candidates based on their place in the selected voter's preference ballot
          let voter = clicked_selected;
          for (let j = 0; j < voter.voted_for.length; j++) {
            let candidate = voter.voted_for[j];
            let thick_amount = map(
              voter.voted_for.length - j,
              1,
              voter.voted_for.length,
              1,
              clicked_selected_stroke_weight
            );

            candidate.grow_by(-candidate_size + 5 + thick_amount * 10);
          }
        } else if (typeof clicked_selected.votes != 'undefined') {
          // Highlight the voters based on where did tey put the selected candidate in their ballot
          let candidate = clicked_selected;
          for (let i = 0; i < voters.length; i++) {
            let voter = voters[i];
            let place = voter.voted_for.findIndex(function (a) {
              return a === candidate;
            });
            if (place != -1) {
              voter.grow_by(
                map(
                  voter.voted_for.length - place,
                  1,
                  voter.voted_for.length,
                  -0.5 * voter_size,
                  0.5 * voter_size
                )
              );
              continue;
            }
            voter.grow_by(-voter_size + 1);
          }
        }
      }
    };
  }

  get_ballot_element(ballot) {
    let returned = document.createElement('ol');

    for (let i = 0; i < ballot.length; i++) {
      let li = document.createElement('li');
      li.appendChild(ballot[i].get_name_p());
      returned.appendChild(li);
    }
    return returned;
  }

  extra_visualize(voters) {
    // Colors the voters based on their first choice and calls set_extra_funct()
    for (let i = 0; i < voters.length; i++) {
      voters[i].set_color(voters[i].voted_for[0].color);
    }

    this.set_extra_funct(voters);
  }
}

class RunoffLike extends RankingVotingMethod {
  constructor(candidates) {
    super(candidates);
    ABC_constructor(this, RunoffLike);
    this.explaining_text = '[placeholder text]';
  }

  prepare_for_voting() {
    super.prepare_for_voting();
    this.elliminated_visualization = new Set();
    for (let i = 0; i < this.candidates.length; i++) {
      this.candidates[i].sub_votes_for_visualization = [];
    }
  }

  winner_by_majority(sub_votes) {
    // console.log(sub_votes.max_count);
    return sub_votes.max_count() > voters.length / 2;
  }

  get_majority_losers(sub_votes) {
    if (this.winner_by_majority(sub_votes) & (sub_votes.size > 1)) {
      const winner_votes = sub_votes.max_count();
      let losers = Array.from(sub_votes).filter(function (a) {
        return a[1] != winner_votes;
      });

      let returned = [];
      for (let i = 0; i < losers.length; i++) {
        returned.push(losers[i][0]);
      }

      // this.won_by_majority = true;
      return returned;
    }
    return [];
  }

  votes_for(voter, eliminated) {
    let tier_list = voter.voted_for.concat([]);
    let index = 0;
    let returned = tier_list[index];

    while (eliminated.has(returned)) {
      index++;
      returned = tier_list[index];
    }

    return returned;
  }

  get_last_valid_preference(voter, elliminated) {
    let tier_list = voter.voted_for.concat([]);
    let index = tier_list.length - 1;
    let returned = tier_list[index];

    while (elliminated.has(returned)) {
      index--;
      returned = tier_list[index];
    }
    return returned;
  }

  best_valid_candidate_tier_list(voter, elliminated) {
    let tier_list = voter.voted_for.concat([]);
    for (let i = tier_list.length - 1; i >= 0; i--) {
      let item = tier_list[i];
      if (elliminated.has(item)) {
        tier_list.splice(i, 1);
      }
    }
    return tier_list;
  }

  set_candidate_votes(elliminated) {
    for (let i = 0; i < this.candidates.length; i++) {
      let pushed = [];
      for (let j = 0; j < this.candidates.length - elliminated.size; j++) {
        pushed.push(0);
      }

      this.candidates[i].sub_votes_for_visualization.push(pushed);
    }

    for (let i = 0; i < voters.length; i++) {
      let tier_list = this.best_valid_candidate_tier_list(
        voters[i],
        elliminated
      );

      for (let j = 0; j < tier_list.length; j++) {
        let candidate = tier_list[j];
        candidate.sub_votes_for_visualization[
          candidate.sub_votes_for_visualization.length - 1
        ][j] += 1;
      }
    }
  }

  stepp_in_visualization() {
    for (let i = 0; i < this.candidates.length; i++) {
      this.candidates[i].sub_votes_for_visualization.shift();
    }
  }

  elliminate_canidates(sub_votes, elliminated) {
    throw new Error(
      'You must implement an elliminate_canidates method to your RankingVotingMethod class'
    );
  }

  get_reasoning_text(elliminated_candidates) {
    return createP('[placeholder text]');
  }

  count_votes() {
    let result = [];
    let elliminated = new Set();

    this.sub_results = [];
    this.sub_votes_for_visualization = [];

    while (elliminated.size < this.candidates.length) {
      let not_elliminated = this.candidates.filter(c => {
        return !elliminated.has(c);
      });

      let sub_votes = Counter.from_array(not_elliminated);
      console.log(elliminated, not_elliminated);

      for (let i = 0; i < voters.length; i++) {
        let vote = this.votes_for(voters[i], elliminated);
        if (vote != undefined) {
          sub_votes.count(vote);
        }
      }

      this.set_candidate_votes(elliminated);

      this.sub_votes_for_visualization.push(sub_votes.copy());

      let sub_result = [];

      for (const x of sub_votes.entries()) {
        sub_result.push(x);
      }
      console.log({ sub_result, sub_votes });

      this.sub_results.push(
        count_votes_for_ints(sub_result, function (cand) {
          return cand[1];
        })
      );

      let new_ellimination = this.elliminate_canidates(sub_votes, elliminated);

      result.unshift(new_ellimination);

      for (let j = 0; j < new_ellimination.length; j++) {
        elliminated.add(new_ellimination[j]);
      }
    }
    console.log(this.sub_votes_for_visualization);
    return result;
  }

  color_voters() {
    for (let i = 0; i < voters.length; i++) {
      let chosen_candidate = this.votes_for(
        voters[i],
        this.elliminated_visualization
      );
      if (chosen_candidate === undefined) {
        voters[i].set_color(honest_voter_color);
        continue;
      }

      voters[i].set_color(chosen_candidate.color);
    }
  }

  visualize_for_stepping_box(subresult) {
    for (let i = 0; i < subresult.length; i++) {
      for (let j = 0; j < subresult[i].length; j++) {
        subresult[i][j][0].text = subresult[i][j][1];
      }
    }

    let res = get_results_elements(subresult, function (cand) {
      let candidate = cand[0];
      // let returned = createProgress(cand[0].name + ': ',cand[1],voters.length);
      // returned.label.style('color',cand[0].color);
      return candidate.get_custom_p(candidate.sub_votes_for_visualization[0]);
    });

    return res;
  }

  show_stepping_box_content() {
    let voting_sytem = this.parent_box.visualized_system;
    let content = createDiv();

    if (voting_sytem.visualization_stepp == 0) {
      extra_function = function () {
        for (const y of stepping_box.visualized_system.elliminated_visualization.values()) {
          y.grow_by(-0.4 * candidate_size);
        }
      };
    }

    content.child(
      createP(
        'This is the ' +
          int_to_serial_number(voting_sytem.visualization_stepp) +
          ' step'
      )
    );

    if (
      voting_sytem.visualization_stepp <
      voting_sytem.sub_results.length - 1
    ) {
      voting_sytem.color_voters();

      let explaining_p = createP(voting_sytem.explaining_text);
      content.child(explaining_p);
      explaining_p.class('explaining_p');

      let subresult =
        voting_sytem.sub_results[voting_sytem.visualization_stepp];

      let res = voting_sytem.visualize_for_stepping_box(subresult);

      let elliminated_candidates = voting_sytem.elliminate_canidates(
        voting_sytem.sub_votes_for_visualization[
          voting_sytem.visualization_stepp
        ],
        voting_sytem.elliminated_visualization
      );
      let elliminated_div = createDivWithP(
        'These candidate(s) were elliminated:'
      );

      for (const x of voting_sytem.elliminated_visualization.values()) {
        x.hide();
      }

      for (let i = 0; i < elliminated_candidates.length; i++) {
        elliminated_div.child(
          elliminated_candidates[i].get_custom_p(
            elliminated_candidates[i].sub_votes_for_visualization[0]
          )
        );
      }

      elliminated_div.child(
        voting_sytem.get_reasoning_text(elliminated_candidates)
      );

      for (let i = 0; i < elliminated_candidates.length; i++) {
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

  stepping_box_func(steppig_box) {
    this.steppig_box = steppig_box;
    steppig_box.visualized_system = this;

    this.visualization_stepp = 0;
    stepping_box.show_next();

    steppig_box.next_func(this.show_stepping_box_content);
  }

  set_final_extra_function() {
    this.elliminated_visualization.forEach(function (candidate) {
      candidate.appear();
    });
    this.elliminated_visualization.clear();
    this.extra_visualize(voters);
  }

  extra_visualize(voters) {
    for (let i = 0; i < candidates.length; i++) {
      candidates[i].text = null;
    }

    for (let i = 0; i < voters.length; i++) {
      voters[i].set_color(
        this.votes_for(voters[i], this.elliminated_visualization).color
      );
    }
    super.set_extra_funct(voters);
  }
}

class CondorcetVotingMethod extends RankingVotingMethod {
  // ABC for condorcet_methods

  constructor(candidates) {
    super(candidates);
    ABC_constructor(this, CondorcetVotingMethod);
  }

  prepare_for_voting() {
    super.prepare_for_voting();

    //Give every candidate an id, what contains their index in the matrixes
    for (let i = 0; i < this.candidates.length; i++) {
      candidates[i].id = i;
    }

    // Create outranking_matrix, with null-s in the main diagnal
    this.outranking_matrix = twoDMatrixWithZeros(
      this.candidates.length,
      this.candidates.length
    );
    set_diagnal(this.outranking_matrix, null);

    this.candidate_names = [];

    for (let i = 0; i < this.candidates.length; i++) {
      this.candidate_names.push(this.candidates[i].name);
    }
  }

  registrate_vote(voter) {
    // Refreshing the outranking matrix based on the voter's ballot
    let tier_list = this.best_candidate_tier_list(voter);

    for (let i = 0; i < tier_list.length; i++) {
      let runner = tier_list[i].id;
      for (let j = i + 1; j < tier_list.length; j++) {
        let opponent = tier_list[j].id;
        this.outranking_matrix[runner][opponent] += 1;
      }
      tier_list[i].votes[i] += 1;
    }

    voter.voted_for = tier_list;
  }

  get_outranking_matrix_from_ballot(ballot) {
    // Transform a ballot to an outranking matrix. Currently only used in visualization
    let returned = twoDMatrixWithZeros(
      this.candidates.length,
      this.candidates.length
    );
    set_diagnal(this.relative_strength_matrix, null);

    for (let i = 0; i < ballot.length; i++) {
      let runner = ballot[i].id;
      for (let j = i + 1; j < ballot.length; j++) {
        let opponent = ballot[j].id;
        returned[runner][opponent] += 1;
      }
    }
    return returned;
  }

  calc_relative_strength_matrix() {
    // Creates a relative_strength_matrix based of the outranking_matrix
    this.relative_strength_matrix = twoDMatrixWithZeros(
      this.candidates.length,
      this.candidates.length
    );
    set_diagnal(this.relative_strength_matrix, null);

    for (let i = 0; i < this.candidates.length; i++) {
      for (let j = 0; j < this.candidates.length; j++) {
        if (i === j) {
          continue;
        }
        this.relative_strength_matrix[i][j] =
          this.outranking_matrix[i][j] - this.outranking_matrix[j][i];
      }
    }
  }

  get_condorcet_winner() {
    /* Gets the condorcet winner from the relative_strength_matrix.
       The voter_table_matrix must be calculated before calling this method.
       If a condorcet winner doesn't exists returns null.*/

    for (let i = 0; i < this.candidates.length; i++) {
      let winner = this.relative_strength_matrix[i].every(function (curr) {
        if (curr == null) {
          return true;
        }

        return curr >= 0;
      });

      if (winner) {
        return this.candidates[i];
      }
    }
    return null;
  }

  //The folowing 3 methods are untested, and I'm not sure if they work or not
  get_candidates_beaten_by(candidate) {
    /*
    Returns the candidates who are beaten by the selected candidate.
    Have to call calc_relative_strength_matrix() first
    */

    let returned = [];
    for (let i = 0; i < this.relative_strength_matrix.length; i++) {
      let cand = this.candidates[i];
      let score = this.relative_strength_matrix[candidate.id][i];

      if (score > 0) {
        returned.push(cand);
      }
    }
    return returned;
  }

  get_candidates_won_against(candidate) {
    /*
    Returns the candidates who have won against the selected candidate.
    Have to call calc_relative_strength_matrix() first
    */

    let returned = [];
    for (let i = 0; i < this.relative_strength_matrix.length; i++) {
      let cand = this.candidates[i];
      let score = this.relative_strength_matrix[candidate.id][i];

      if (score < 0) {
        returned.push(cand);
      }
    }
    return returned;
  }

  get_candidates_tied_by(candidate) {
    /*
    Returns the candidates who are tied by the selected candidate.
    Have to call calc_relative_strength_matrix() first
    */

    let returned = [];
    for (let i = 0; i < this.relative_strength_matrix.length; i++) {
      let cand = this.candidates[i];
      let score = this.relative_strength_matrix[candidate.id][i];

      if (score == 0) {
        returned.push(cand);
      }
    }
    return returned;
  }

  //Visualization stuff below

  show_outranking_matrix() {
    // First stepp in step_by_stepp visualization

    let voting_sytem = this.parent_box.visualized_system;

    delete_arrows();
    this.random_voter = random(voters);
    clicked_selected = this.random_voter;
    this.random_voter.set_color(honest_voter_color);
    clicked_selected.on_select();
    load_clicked_selected();

    let voter_res = this.random_voter.voted_for;

    let voter_p = this.random_voter.get_simple_name_p().outerHTML;

    let voter_table_matrix =
      voting_sytem.get_outranking_matrix_from_ballot(voter_res);
    let voter_table = table_from_matrix(
      voter_table_matrix,
      voting_sytem.candidate_names,
      voting_sytem.candidate_names
    );

    let first_text = document.createElement('p');
    first_text.innerHTML = `After we have recived every voters ballot, now we can get to work. For each voter's ballot we are going to count how many times has been each candidate placed before each candidate. For example let's see what does the ballot of the voter named ${voter_p} (marked with the default voter color) looks like`;

    let voter_res_list = voting_sytem.get_ballot_element(voter_res);

    let second_text = document.createElement('p');

    let first_choice = voter_res[0].get_simple_name_p().outerHTML;
    let second_choice = voter_res[1].get_simple_name_p().outerHTML;
    let last_choice =
      voter_res[voter_res.length - 1].get_simple_name_p().outerHTML;

    second_text.innerHTML = `${first_choice} defeated every candidate all the way to the last placed ${last_choice}.<br>${second_choice} also defeated every candidate below them. But this candidate didn't beat ${first_choice}. We can do this kind of calculation to every candidate in the ballot to get the following matrix:`;

    let third_text = document.createElement('p');
    third_text.innerHTML = `This table is the outranking matrix. This shows the preferences of ${voter_p}. As you can see, if we look at the row of ${first_choice} and the column of ${second_choice} we can see a one. This means that ${first_choice} is <strong>prefered</strong> over ${second_choice} by exactly one voter. If we do this for every voter's ballot, than we will know that how many times has candidate X been placed before candidate Y. We can place these findings in a table like so: `;
    let table = table_from_matrix(
      voting_sytem.outranking_matrix,
      voting_sytem.candidate_names,
      voting_sytem.candidate_names
    );

    const preference =
      voting_sytem.outranking_matrix[voter_res[0].id][voter_res[1].id];
    const preference2 =
      voting_sytem.outranking_matrix[voter_res[1].id][voter_res[0].id];

    let last_text = document.createElement('p');
    last_text.innerHTML = `This is the outranking matrix (O) of every voter. We can strore our <strong>preferences</strong> here. For example, we can see that ${first_choice} has been prefered over ${second_choice} by exactly ${preference} voters, and ${second_choice} has been prefered over ${first_choice} by exactly ${preference2} voters. This information (as we will see) is really useful for us.`;

    let content = document.createElement('div');
    content.appendChild(first_text);
    content.appendChild(voter_res_list);
    content.appendChild(second_text);
    content.appendChild(voter_table);
    content.appendChild(third_text);
    content.appendChild(table);
    content.appendChild(last_text);
    this.parent_box.set_content(content);

    this.parent_box.next_func(voting_sytem.show_relative_strength_matrix);
  }

  arrows_between_candidates() {
    // Draws the arrows between the candidates in the second visualization stepp

    for (const cands of combinations(this.candidates, 2)) {
      let [cand1, cand2] = cands;

      const strength = this.relative_strength_matrix[cand1.id][cand2.id];
      let winner;
      let loser;

      let arr;

      if (strength > 0) {
        winner = cand1;
        loser = cand2;
      } else {
        winner = cand2;
        loser = cand1;
      }

      arr = new Arrow(
        winner.color,
        `${winner.name} beats ${loser.name}`,
        winner,
        loser
      );

      arr.text = abs(strength);
      arr.text_label =
        `This many voters prefer ${winner.get_name_p().outerHTML} over ${
          loser.get_name_p().outerHTML
        }` +
        ` than ${loser.get_name_p().outerHTML} over ${
          winner.get_name_p().outerHTML
        }`;

      arr.start_person_data = `This candidate is prefered over ${
        loser.get_name_p().outerHTML
      } by ${this.outranking_matrix[winner.id][loser.id]} voters.`;
      arr.end_person_data = `This candidate is prefered over ${
        winner.get_name_p().outerHTML
      } by ${this.outranking_matrix[loser.id][winner.id]} voters.`;

      if (strength == 0) {
        let endStyle = new HalfTriArrowHead(20, 20);
        arr.set_end_styles(endStyle, endStyle);
        arr.name = `${winner.name} and ${loser.name} are equaly prefered`;
      }
    }
  }

  show_relative_strength_matrix() {
    // Second stepp in step_by_stepp visualization
    let voting_sytem = this.parent_box.visualized_system;
    delete_arrows();

    voters.forEach(v => {
      v.hide();
    });

    voting_sytem.arrows_between_candidates();
    this.random_voter.set_color(this.random_voter.voted_for[0].color);
    let content = document.createElement('div');

    let text = document.createElement('p');
    text.innerHTML =
      'From the outranking matrix we can create a relative strength matrix (R). Basicly every R(i,j) equals O(i,j) - O(j,i). This kind of matrix shows us, that how by how many times did each candidate i beat candidate j. If this number is negative than j has beaten i more times.';

    let table = table_from_matrix(
      voting_sytem.relative_strength_matrix,
      voting_sytem.candidate_names,
      voting_sytem.candidate_names
    );

    content.appendChild(text);
    content.appendChild(table);

    this.parent_box.set_content(content);
    this.parent_box.next_func(voting_sytem.show_first);
  }

  show_first() {
    // The first step_by_stepp visualization step which every class needs to define which inherits from CondorcetVotingMethod
    throw new Error(
      'You must define a show_first method to your CondorcetVotingMethod class'
    );
  }

  stepping_box_func(steppig_box) {
    // Sets up stepping_box

    this.stepping_box = steppig_box;
    steppig_box.visualized_system = this;

    stepping_box.show_next();

    steppig_box.next_func(this.show_outranking_matrix);
  }
}
