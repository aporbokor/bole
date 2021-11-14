class CoombsVoting extends RunoffLike{
  elliminate_canidates(sub_votes, elliminated){
    let last_places = new Counter();
    for (let i = 0; i < this.voters.length; i++){
      last_places.count(this.get_last_valid_preference(this.voters[i],elliminated));
    }
    console.log(last_places);
    return last_places.maxs();
  }
}
