class CoombsVoting extends RunoffLike{

  constructor(candidates){
    super(candidates);
    this.explaining_text = 'Now we are going to elliminate the candidates, who the most voters have putted to last place'
  }

  elliminate_canidates(sub_votes, elliminated){
    let last_places = new Counter();
    for (let i = 0; i < this.voters.length; i++){
      last_places.count(this.get_last_valid_preference(this.voters[i],elliminated));
    }
    console.log(last_places);
    return last_places.maxs();
  }

  get_reasoning_text(elliminated_candidates){
    let votes = Array.from(elliminated_candidates.entries())[0][1].sub_votes_for_visualization[0];
    let vote = votes[votes.length-1];
    return createP(`The elliminated candidates in this votecounting had the fewest votes. In the first place. They all had ${vote}`);
  }
}
