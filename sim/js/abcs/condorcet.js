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

function smith_set() {
  let n = candidates.length;
  let copeland = run_vote_noreset_vm(Copeland);
  let s = copeland.count_votes();
  let r = copeland.copeland_matrix;
  let row, col, lhs, rhs;
  for (rhs = 1, lhs = 0; lhs < rhs; lhs = rhs, rhs = row + 1) {
    for (; rhs < n && s[rhs] == s[rhs - 1]; rhs++); /* this line optional */
    for (col = rhs, row = n; col == rhs && row >= rhs; row--)
      for (col = lhs; col < rhs && r[row - 1][col] == 0; col++);
  }
  return lhs;
}

class CondorcetVotingMethod extends RankingVotingMethod {
  // ABC for condorcet_methods

  constructor(candidates) {
    super(candidates);
    ABC_constructor(this, CondorcetVotingMethod);
    this.pairs = [];
  }

  prepare_for_voting() {
    super.prepare_for_voting();

    //Give every candidate an id, what contains their index in the matrixes
    for (let i = 0; i < this.candidates.length; i++) {
      candidates[i].id = i;
    }

    // Create outranking_matrix, with null-s in the main diagonal
    this.outranking_matrix = twoDMatrixWithZeros(
      this.candidates.length,
      this.candidates.length
    );
    set_diagonal(this.outranking_matrix, null);

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

  register_vote(voter) {
    // Refreshing the outranking matrix based on the voter's ballot
    let tier_list = this.candidate_tier_list(voter);

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
    // Transform a ballot to an outranking matrix.
    let returned = twoDMatrixWithZeros(
      this.candidates.length,
      this.candidates.length
    );
    set_diagonal(this.relative_strength_matrix, null);

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
    set_diagonal(this.relative_strength_matrix, null);

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
    // First step in step_by_step visualization

    let voting_system = this.parent_box.visualized_system;

    delete_arrows();
    this.random_voter = random(voters);
    clicked_selected = this.random_voter;
    this.random_voter.set_color(honest_voter_color);
    clicked_selected.on_select();
    load_clicked_selected();

    let voter_res = this.random_voter.voted_for;

    let voter_p = this.random_voter.get_simple_name_p().outerHTML;

    let voter_table_matrix =
      voting_system.get_outranking_matrix_from_ballot(voter_res);
    let voter_table = table_from_matrix(
      voter_table_matrix,
      voting_system.candidate_names,
      voting_system.candidate_names
    );

    let first_text = document.createElement("p");
    first_text.innerHTML = `After we have received every voter's ballot, now we can get to work. For each voter's ballot, we are going to count how many times has been each candidate placed before each candidate. For example, let's see how the ballot of the voter named ${voter_p} (marked with the default voter color) looks like:`;

    let voter_res_list = voting_system.get_ballot_element(voter_res);

    let second_text = document.createElement("p");

    let first_choice = voter_res[0].get_simple_name_p().outerHTML;
    let second_choice = voter_res[1].get_simple_name_p().outerHTML;
    let last_choice =
      voter_res[voter_res.length - 1].get_simple_name_p().outerHTML;

    second_text.innerHTML = `${first_choice} defeated every candidate all the way to the last placed ${last_choice}.<br>${second_choice} also defeated every candidate below them. But this candidate didn't beat ${first_choice}. We can do this kind of calculation to every candidate in the ballot to get the following matrix:`;

    let third_text = document.createElement("p");
    third_text.innerHTML = `This table is the outranking matrix. This shows the preferences of ${voter_p}. As you can see, if we look at the row of ${first_choice} and the column of ${second_choice} we can see a one. This means that ${first_choice} is <strong>preferred</strong> over ${second_choice} by exactly one voter. If we do this for every voter's ballot, then we will know that how many times has candidate X been placed before candidate Y. We can place these findings in a table like so: `;
    let table = table_from_matrix(
      voting_system.outranking_matrix,
      voting_system.candidate_names,
      voting_system.candidate_names
    );

    const preference =
      voting_system.outranking_matrix[voter_res[0].id][voter_res[1].id];
    const preference2 =
      voting_system.outranking_matrix[voter_res[1].id][voter_res[0].id];

    let last_text = document.createElement("p");
    last_text.innerHTML = `This is the outranking matrix (O) of every voter. We can store our <strong>preferences</strong> here. For example, we can see that ${first_choice} has been preferred over ${second_choice} by exactly ${preference} voters, and ${second_choice} has been preferred over ${first_choice} by exactly ${preference2} voters. This information (as we will see) is really useful to us.`;

    let content = document.createElement("div");
    content.appendChild(first_text);
    content.appendChild(voter_res_list);
    content.appendChild(second_text);
    content.appendChild(voter_table);
    content.appendChild(third_text);
    content.appendChild(table);
    content.appendChild(last_text);
    this.parent_box.set_content(content);

    this.parent_box.next_func(voting_system.show_relative_strength_matrix);
  }

  arrow_between_2_candidates(cand1, cand2) {
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

    arr.start_person_data = `This candidate is preferred over ${
      loser.get_name_p().outerHTML
    } by ${this.outranking_matrix[winner.id][loser.id]} voters.`;
    arr.end_person_data = `This candidate is preferred over ${
      winner.get_name_p().outerHTML
    } by ${this.outranking_matrix[loser.id][winner.id]} voters.`;

    if (strength == 0) {
      let endStyle = new HalfTriArrowHead(20, 20);
      arr.set_end_styles(endStyle, endStyle);
      arr.name = `${winner.name} and ${loser.name} are equaly preferred`;
    }
    return arr;
  }

  arrows_between_candidates() {
    // Draws the arrows between the candidates in the second visualization step

    for (const cands of combinations(this.candidates, 2)) {
      let [cand1, cand2] = cands;
      this.arrow_between_2_candidates(cand1, cand2);
    }
  }

  show_relative_strength_matrix() {
    // Second step in step_by_step visualization
    let voting_system = this.parent_box.visualized_system;

    for (const cand of candidates) {
      cand.appear();
    }

    voting_system.extra_visualize(voters);
    delete_arrows();

    voters.forEach((v) => {
      v.hide();
    });

    clicked_selected = undefined;

    voting_system.arrows_between_candidates();
    this.random_voter.set_color(this.random_voter.voted_for[0].color);
    let content = document.createElement("div");

    let text = document.createElement("p");
    text.innerHTML =
      "From the outranking matrix we can create a relative strength matrix (R). Basically every R(i, j) equals O(i, j) - O(j, i). This kind of matrix shows us, that by how many times did each candidate i beat candidate j. If this number is negative, then j has beaten i more times.";

    let table = table_from_matrix(
      voting_system.relative_strength_matrix,
      voting_system.candidate_names,
      voting_system.candidate_names
    );

    let pair_visualize_button = document.createElement("button");
    pair_visualize_button.addEventListener("click", (ev) => {
      voting_system.start_showing_candidate_pairs(this.parent_box);
    });
    pair_visualize_button.innerText = "Visualize for each pair of candidates";

    let last_p = document.createElement("p");
    last_p.innerText =
      "If this was a lot for you to take in at once, then you should press the 'Visualize for each pair of candidates' button. That way you will see how the outranking matrix and the relative strength matrix are constructed cell by cell.";

    content.appendChild(text);
    content.appendChild(table);
    content.appendChild(pair_visualize_button);
    content.appendChild(last_p);

    this.parent_box.set_content(content);
    this.parent_box.next_func(voting_system.specific_step);
  }

  visualize_candidate_pair(cand1, cand2) {
    // Visualizes the candidate pair on canvas

    if (this.pair_arrow_for_vis != undefined) {
      this.pair_arrow_for_vis.remove();
    }

    this.pair_arrow_for_vis = this.arrow_between_2_candidates(cand1, cand2);

    for (const cand of candidates) {
      if (cand == cand1 || cand == cand2) {
        cand.appear();
      } else {
        cand.hide();
      }
    }

    for (const voter of voters) {
      let cand_to_set = cand2;

      if (voter.prefers(cand2, cand1)) {
        cand_to_set = cand1;
      }
      voter.set_color(cand_to_set.target_color);
    }
  }

  show_next_candidate_pair() {
    let voting_system = this.parent_box.visualized_system;

    let { value, done } = voting_system.visualizaton_pairs_generator.next();

    if (done) {
      voting_system.specific_step.bind(this)();

      delete_arrows();
      voting_system.arrows_between_candidates();

      for (const cand of candidates) {
        cand.appear();
      }
      for (const voter of voters) {
        voter.appear();
      }
      return;
    }
    let [cand1, cand2] = value;

    voting_system.visualize_candidate_pair(cand1, cand2);

    let winner_cand = voting_system.pair_arrow_for_vis.start_person;
    let loser_cand = voting_system.pair_arrow_for_vis.end_person;

    let cand1_over_2 = voting_system.outranking_matrix[cand1.id][cand2.id];
    let cand2_over_1 = voting_system.outranking_matrix[cand2.id][cand1.id];

    cand1.text = cand1_over_2;
    cand2.text = cand2_over_1;

    let cand1_over_2_relative =
      voting_system.relative_strength_matrix[cand1.id][cand2.id];
    let cand2_over_1_relative =
      voting_system.relative_strength_matrix[cand2.id][cand1.id];

    voting_system.empty_outranking_matrix[cand1.id][cand2.id] = cand1_over_2;
    voting_system.empty_outranking_matrix[cand2.id][cand1.id] = cand2_over_1;

    voting_system.empty_relative_strength_matrix[cand1.id][cand2.id] =
      cand1_over_2_relative;
    voting_system.empty_relative_strength_matrix[cand2.id][cand1.id] =
      cand2_over_1_relative;

    let content = document.createElement("div");
    let results_p = document.createElement("p");

    let can1_p = cand1.get_simple_name_p().outerHTML;
    let can2_p = cand2.get_simple_name_p().outerHTML;
    let winner_cand_p = winner_cand.get_simple_name_p().outerHTML;

    let explainer_p = document.createElement("p");
    explainer_p.innerHTML =
      "In order to construct the Outranking Matrix we would need to know the following: if there were only two candidates, then which one would win in a plurality election? And we would need ro know that for every possible pair of candidates! Take the current pair for example: ";

    results_p.innerHTML = `As we can see ${cand1_over_2} voters prefer ${can1_p} over ${can2_p} and ${cand2_over_1} voters prefer ${can2_p} over ${can1_p}. We know that, because we can read this data out from the voters' ballots. We can put these numbers into the corresponding cells in the Outranking matrix as follows:`;

    let table1 = table_from_matrix(
      voting_system.empty_outranking_matrix,
      voting_system.candidate_names,
      voting_system.candidate_names
    );

    let last_p = document.createElement("p");
    last_p.innerHTML = `We have also drawn an arrow between the 2 candidates. This arrow indicates, that ${winner_cand_p} has won by ${
      voting_system.relative_strength_matrix[winner_cand.id][loser_cand.id]
    } votes. We will write this value to the Relative strength matrix as follows:`;

    let table2 = table_from_matrix(
      voting_system.empty_relative_strength_matrix,
      voting_system.candidate_names,
      voting_system.candidate_names
    );

    content.appendChild(explainer_p);
    content.appendChild(results_p);
    content.appendChild(table1);
    content.appendChild(last_p);
    content.appendChild(table2);

    this.parent_box.set_content(content);
    this.parent_box.next_func(voting_system.show_next_candidate_pair);
  }

  start_showing_candidate_pairs(stepping_box) {
    this.visualizaton_pairs_generator = combinations(candidates, 2);
    delete_arrows();
    clicked_selected = undefined;

    this.empty_outranking_matrix = filledTwoDMatrix(
      candidates.length,
      candidates.length,
      null
    );
    this.empty_relative_strength_matrix = filledTwoDMatrix(
      candidates.length,
      candidates.length,
      null
    );

    for (const voter of voters) {
      voter.appear();
    }

    this.show_next_candidate_pair.bind(stepping_box.next_button)();
  }

  specific_step() {
    // The first step_by_step visualization step which every class needs to define which inherits from CondorcetVotingMethod
    throw new Error(
      "You must define a specific_step method to your CondorcetVotingMethod class"
    );
  }

  stepping_box_func(stepping_box) {
    // Sets up stepping_box

    this.stepping_box = stepping_box;
    stepping_box.visualized_system = this;

    stepping_box.show_next();

    stepping_box.next_func(this.show_outranking_matrix);
  }
}
