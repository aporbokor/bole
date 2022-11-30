class NumberVotecountVotingMethod extends VotingMethod {
  // ABC for every voting_method where tha candidates votes can be represented by numbers
  constructor(candidates) {
    super(candidates);
    ABC_constructor(this, NumberVotecountVotingMethod);
    this.ballot_marker = "tick-marker";
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
    let returned = document.createElement("ul");

    for (let i = 0; i < ballot.length; i++) {
      let li = document.createElement("li");
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
