class PerfectVoter extends VotingMethod{

  constructor(candidates){
    super(candidates);
    this.sum_x = 0;
    this.sum_y = 0;
    this.voted_persons = 0;
  }

  prepare_for_voting(){
    for (let i = 0; i<this.candidates.length; i++){
      this.candidates[i].votes = 0;
    }
  }

  registrate_honest_vote(voter){
    this.sum_x += voter.x;
    this.sum_y += voter.y;
    this.voted_persons += 1;

  }

  registrate_vote(voter){
    this.registrate_honest_vote(voter)
  }

  distance_to_average_point(candidate){
    let x_dist = this.average_x - candidate.x;
    let y_dist = this.average_y - candidate.y;
    return Math.sqrt(x_dist*x_dist + y_dist*y_dist);
  }

  count_votes(){
    this.average_x = this.sum_x / this.voted_persons;
    this.average_y = this.sum_y / this.voted_persons;

    for (let i=0; i<this.candidates.length;i++){
      let candidate = this.candidates[i];
      candidate.votes = this.distance_to_average_point(candidate);
    }
    return count_votes_for_ints(this.candidates).reverse();

  }

  extra_visualize(voters){
    extra_varible = this
    extra_function = function(){
      fill(0)
      circle(extra_varible.average_x, extra_varible.average_y, voter_size)
    }
  }
}

// Testing stuff
// let voters = [new Voter(0,0,false), new Voter(1,1,false), new Voter(0.5,0.5,false), new Voter(0.5,0.5,false)];
//
// let candidates = [new Candidate(0,0,undefined), new Candidate(0.5,0.5,undefined), new Candidate(1,1,undefined)];
//
// let votings = new PerfectVoter(candidates);
// votings.prepare_for_voting()
//
// for (let i = 0; i< voters.length; i++){
//   votings.registrate_vote(voters[i]);
// }
//
//
// console.log(votings);
// console.log(candidates);
// console.log(voters);
// console.log(votings.count_votes());
