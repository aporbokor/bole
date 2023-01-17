class IRV extends RunoffLike {
  constructor(candidates) {
    super(candidates);
    this.explaining_text =
      "Now we are going to run the election, counting the best-ranked not eliminated candidates of each voter's preference-list.";
  }

  eliminate_candidates(sub_votes, eliminated) {
    const losers = this.get_majority_losers(sub_votes);
    if (losers.length > 0) {
      this.won_by_majority = true;
      return losers;
    }
    this.won_by_majority = false;

    let mins = sub_votes.mins();
    //console.log(mins);
    return mins;
  }

  get_reasoning_text(eliminated_candidates) {
    if (this.won_by_majority) {
      return createP(
        "In this  vote count the first place had the absolute majority of votes (more than half of the voters voted for them)."
      );
    }
    let votes = Array.from(eliminated_candidates.entries())[0][1]
      .sub_votes_for_visualization[0][0];
    return createP(
      `The eliminated candidates in this vote counting had the fewest votes. In the first place. They all had ${votes}.`
    );
  }
}
