// Must calculate relative_strength_matrix in order for it to work
class Pair {
  constructor(c1, c2, m) {
    if (m[c1][c2] > 0) {
      this.winner = c1;
      this.diff = m[c1][c2];
      this.loser = c2;
    } else if (m[c1][c2] < 0) {
      this.winner = c2;
      this.diff = m[c1][c2];
      this.loser = c1;
    }
  }
}
class CondorcetVotingMethod extends RankingVotingMethod {
  // ABC for condorcet_methods

  constructor(candidates) {
    super(candidates);
    ABC_constructor(this, CondorcetVotingMethod);
    this.pairs = [];
    this.locked = tdBooleanArray(
      this.candidates.length,
      this.candidates.length
    );
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

  add_pairs() {
    for (let i = 0; i < this.candidates.length; i++) {
      for (let j = 0; j < this.candidates.length; j++) {
        let res = new Pair(i, j, this.relative_strength_matrix);
        if (res.winner != null) {
          this.pairs.push(res);
        }
      }
    }
  }

  sort_pairs() {
    this.pairs = this.pairs.sort((a, b) => {
      return b.diff - a.diff;
    });
  }

  invalid_edge(pair) {
    let l = pair.loser;
    while (true) {
      for (let i = 0; i < this.candidates.length; i++) {
        if (i == l) {
          continue;
        } else if (this.locked[l][i] == true) {
          if (i == pair.winner) {
            return true;
          }
          l = i;
        } else {
          return false;
        }
      }
    }
  }
  create_graph() {
    for (const pair of this.pairs) {
      if (!this.invalid_edge(pair)) {
        this.locked[pair.winner][pair.loser] = true;
      }
    }
    console.log(this.locked);
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
