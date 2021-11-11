class PlurarityVoter extends VotingMethod{

  prepare_for_voting(){
    for (let i = 0; i<this.candidates.length; i++){
      this.candidates[i].votes = 0;
    }
  }

  registrate_honest_vote(voter){
    let min_tav = Infinity;
    let min_candidate = this.candidates[0];

    for (let i = 0; i<this.candidates.length; i++){
      let curr_cand = this.candidates[i];
      let tav = voter.distance_to_candidate(curr_cand);
      if (tav < min_tav){
        min_tav = tav;
        min_candidate = curr_cand;
      }
    }
    min_candidate.votes += 1;
    voter.voted_for = min_candidate;

  }

  registrate_vote(voter){
    this.registrate_honest_vote(voter)
  }

  count_votes(){
    return count_votes_for_ints(this.candidates);
  }

  extra_visualize(voters){
    for (let i = 0; i<voters.length; i++){
      voters[i].color = voters[i].voted_for.color;
    }
  }
}


// Testing stuff
// let voters = [new Voter(0,0,false), new Voter(1,1,false), new Voter(0.5,0.5,false), new Voter(0.1,0.1,false)];
//
// let candidates = [new Candidate(0,0,undefined), new Candidate(0.5,0.5,undefined), new Candidate(1,1,undefined)];
//
// let votings = new PlurarityVoter(candidates);
// votings.prepare_for_voting()
//
// console.log(votings);
//
// for (let i = 0; i< voters.length; i++){
//   votings.registrate_vote(voters[i]);
// }
//
// console.log(candidates);
// console.log(voters);
// console.log(votings.count_votes());
