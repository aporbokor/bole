class InstantRunOffVoter extends RunoffLike{

  constructor(candidates){
    super(candidates);
    this.explaining_text = 'Now we are going to run the election counting the best-ranked not-elliminated candidates of each voters preference-list.';
  }

  elliminate_canidates(sub_votes, elliminated){
    const losers = this.get_majority_losers(sub_votes);
    if (losers.length > 0){
      this.won_by_majority = true;
      return losers;
    }
    this.won_by_majority = false;

    let mins = sub_votes.mins();
    return mins;
  }

  get_reasoning_text(elliminated_candidates){
    if (this.won_by_majority){
      return createP("In this votecount the first place had the absolute majority of votes (more than half of the voters voted for them).")
    }
    let votes = Array.from(elliminated_candidates.entries())[0][1].sub_votes_for_visualization[0][0];
    return createP(`The elliminated candidates in this votecounting had the fewest votes. In the first place. They all had ${votes}`);
  }
}
