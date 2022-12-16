class Borda_count extends RankingVotingMethod {
  prepare_for_voting() {
    super.prepare_for_voting();

    for (let i = 0; i < this.candidates.length; i++) {
      this.candidates[i].borda_count = 0;
    }

    max_votes =
      sum_of_natural_numbers(0, this.candidates.length) *
      voter_population *
      1.8;
  }

  get_results_data(cand) {
    return [cand.borda_count, "| Borda Score: "];
  }

  register_honest_vote(voter) {
    return this.candidate_tier_list(voter);
  }

  register_strategic_vote(voter) {
    if (seems_win_candidates.length <= 1) {
      return this.register_honest_vote(voter);
    }
    let winner_tier_list = this.candidate_tier_list(
      voter,
      seems_win_candidates
    );
    let top = winner_tier_list[0];
    let bottom = winner_tier_list.slice(1);

    let loser_tier_list = this.candidate_tier_list(
      voter,
      seems_lose_candidates
    );

    let returned = loser_tier_list.concat(bottom);
    returned.unshift(top);

    return returned;
  }

  register_vote(voter) {
    let tier_list;

    if (voter.strategic) {
      tier_list = this.register_strategic_vote(voter);
    } else {
      tier_list = this.register_honest_vote(voter);
    }

    for (let i = 0; i < tier_list.length; i++) {
      tier_list[i].borda_count += tier_list.length - i;
    }

    this.update_votecounts(tier_list);
    voter.voted_for = tier_list;
  }

  count_votes() {
    return count_votes_for_ints(this.candidates, function (cand) {
      return cand.borda_count;
    });
  }

  extra_visualize(voters) {
    super.extra_visualize(voters);

    for (let i = 0; i < candidates.length; i++) {
      candidates[i].text = candidates[i].borda_count;
      candidates[i].text_label = "Borda score";
    }
  }

  describe_process() {
    let step_div = document.createElement("div");
    let start_text = document.createElement("p");
    start_text.innerHTML =
      "Let's assume that the total number of candidates is n. For every k-th candidate in every voters' ballot, we are going to increment the k-th candidate's borda score by <strong>(n-k+1)</strong>. In this case, this looks like the following:";

    let random_voter = random(voters);
    random_voter.set_color(honest_voter_color);
    clicked_selected = random_voter;
    clicked_selected.on_select();
    load_clicked_selected();

    const preference = random_voter.voted_for;
    const preference_ellement =
      random_voter.last_voting_system.get_ballot_element(preference);

    let second_text = document.createElement("p");
    second_text.innerHTML = `${
      random_voter.get_simple_name_p().outerHTML
    }'s ballot looks like this:`;

    let third_text = document.createElement("p");
    third_text.innerHTML = `The total number of candidates (n) is ${
      candidates.length
    }. ${preference[0].get_simple_name_p().outerHTML} is the first choice of ${
      random_voter.get_simple_name_p().outerHTML
    }. So ${
      preference[0].get_simple_name_p().outerHTML
    }'s <strong>k</strong> is 1.`;
    let forth_text = document.createElement("p");
    forth_text.innerHTML = `So according to our little formula <strong>(n-k+1)</strong> we should increment ${
      preference[0].get_simple_name_p().outerHTML
    }'s borda score by (${candidates.length} - 1 + 1) which is <strong>${
      candidates.length
    }</strong>.`;

    let fifth_text = document.createElement("p");
    fifth_text.innerHTML = `Thus, every candidate after the first choice will have 1 less score increment. All the way to the last place (in this case ${
      preference[candidates.length - 1].get_simple_name_p().outerHTML
    }). The last place will get 1 score increment.`;

    let names = [];
    let matrix = [];

    for (let i = 0; i < preference.length; i++) {
      names.push(preference[i].name);
      let place = [int_to_serial_number(i + 1), candidates.length - i];
      matrix.push(place);
    }

    let table = table_from_matrix(
      matrix,
      ["place in voter's div", "borda score increment"],
      names
    );

    let last_text = document.createElement("p");
    last_text.innerText =
      "We do this to each voter, so in the end, we get how much borda score each candidate has. The candidate with the highest borda score wins.";

    step_div.appendChild(start_text);
    step_div.appendChild(second_text);
    step_div.appendChild(preference_ellement);
    step_div.appendChild(third_text);
    step_div.appendChild(forth_text);
    step_div.appendChild(fifth_text);
    step_div.appendChild(table);
    step_div.appendChild(last_text);

    this.parent_box.set_content(step_div);
    this.parent_box.hide_next();
  }

  stepping_box_func(stepping_box) {
    this.stepping_box = stepping_box;
    stepping_box.visualized_system = this;

    let content = document.createElement("div");
    let starter = document.createElement("p");
    starter.innerText =
      "In borda counting, every voter ranks every candidate in order of preference. Then we assign scores to each candidate based on these preferences.";

    content.appendChild(starter);
    content.appendChild(
      this.get_scores_div_cand_list(
        this.candidates,
        "'s place on voters' ballots: "
      )
    );
    stepping_box.set_content(content);
    stepping_box.show_next();
    stepping_box.next_func(this.describe_process);
  }
}
