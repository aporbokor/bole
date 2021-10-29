// Abstract base-classes

class VotingMethod{

  constructor(){
    if (this.constructor == VotingMethod){
      throw new Error("Abstract baseclass can't be initialized");
    }
  }

  registrate_honest_vote(voter){
      throw new Error("You must implement a registrate_honest_vote method to your VotingMethod class");
  }

  registrate_strategic_vote(voter){
      throw new Error("You must implement a registrate_strategic_vote method to your VotingMethod class");
  }

  registrate_vote(voter){
      throw new Error("You must implement a registrate_vote method to your VotingMethod class");
  }

  count_votes(){
      throw new Error("You must implement a count_votes method to your VotingMethod class");
  }
}
