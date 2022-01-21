class CopelandVoter extends CondorcetVotingMethod {

  prepare_for_voting() {
    super.prepare_for_voting();
    max_votes = this.candidates.length - 1;
  }

  calc_copeland_matrix() {
    this.copeland_matrix = twoDMatrixWithZeros(this.candidates.length, this.candidates.length);

    for (let i = 0; i < this.candidates.length; i++) {
      for (let j = 0; j < this.candidates.length; j++) {
        let curr = this.relative_strength_matrix[i][j];

        if ((curr == null) || (curr < 0)) {
          this.copeland_matrix[i][j] = 0;
        } else if (curr == 0) {
          this.copeland_matrix[i][j] = 0.5;
        } else {
          this.copeland_matrix[i][j] = 1;
        }
      }

      this.candidates[i].copeland_score = sum(this.copeland_matrix[i]);
    }
  }

  count_votes() {
    this.calc_relative_strength_matrix();
    console.log(this.outranking_matrix);
    console.log(this.relative_strength_matrix);
    this.calc_copeland_matrix();
    console.log(this.copeland_matrix);
    return count_votes_for_ints(this.candidates, function (can) {
      return can.copeland_score;
    })
  }

  get_results_data(cand) {
    return [cand.copeland_score, '|copeland score: ']
  }

  show_first() {
    let voting_sytem = this.parent_box.visualized_system;
    let content = document.createElement('div');

    let text = document.createElement('p');
    text.innerHTML = "From the relative strength matrix we can calculate a copeland score for each candidate. Every candidate's copeland score equals to the number of candidates defeated plus half of the number of candidates tied" +
      "So basicly if:<ul>" +
      "<li>R(i,j) > 0 : i's score is incremented by one</li>" +
      "<li>R(i,j) < 0 : i's score is not changed</li>" +
      "<li>R(i,j) = 0 : i's score is incremented by a half</li>" +
      "<li>R(i,i) : i's score is not changed</li></ul>" +
      "We do this for every candidate i, and in the end we get this:";

    let table = table_from_matrix(voting_sytem.copeland_matrix, voting_sytem.candidate_names, voting_sytem.candidate_names);

    let second_text = document.createElement('p');
    second_text.innerHTML = "From this, we can determent the winner with ease: just count which candidate has the most score!";

    content.appendChild(text);
    content.appendChild(table);
    content.appendChild(second_text);
    this.parent_box.set_content(content);
    this.parent_box.hide_next();
  }

  extra_visualize(voters) {
    super.extra_visualize(voters);

    for (let i = 0; i < candidates.length; i++) {
      candidates[i].text = candidates[i].copeland_score;
      candidates[i].text_label = "Copeland score"
    }
  }
}
