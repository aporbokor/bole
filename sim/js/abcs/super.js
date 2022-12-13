// Abstract base-classes

class VotingMethod {
  // ABC for every voting_method

  constructor(candidates) {
    ABC_constructor(this, VotingMethod);
    this.candidates = candidates;
    for (let i = 0; i < voters.length; i++) {
      voters[i].last_voting_system = this;
    }
    this.wiki_link = "https://apple.com";
  }

  prepare_for_voting() {
    // Called before registrating any votes
    throw new Error(
      "You must implement a prepare_for_voting method to your VotingMethod class"
    );
  }

  register_vote(voter) {
    // Called to register the vote of a Voter
    throw new Error(
      "You must implement a register_vote method to your VotingMethod class"
    );
  }

  count_votes() {
    /* Called to count the votes
       Must return an array of arrays, 
       where every nth array contains the candidates who got nth place*/
    throw new Error(
      "You must implement a count_votes method to your VotingMethod class"
    );
  }

  get_ballot_element(ballot) {
    /* Given any ballot of candidates must return an html element from that ballot.
       This ellement is then used in the selected_div of voters*/
    throw new Error(
      "You must implement a get_ballot_element method to your VotingMethod class"
    );
  }

  get_results_data(cand) {
    // Defines what data should be displayed in the results_div
    return [cand.votes, "| Votes: "];
  }

  extra_visualize(voters) {
    // An mehtod to be used for visualization. It is calles in every frame.
    return undefined;
  }

  steping_box_func(stepig_box) {
    // This method is used for setting up a relationship between the voting_method and the stepig_box
    steping_box.set_content(
      createP(
        "Step by step visualization is not avalable for this voting_method"
      )
    );
  }
}

function count_votes_for_ints(
  candidates,
  get_votes = function (cand) {
    return cand.votes;
  }
) {
  /* Given an array of candidates and their votes (represented by numbers)
     returns a ranking for these candidates in the form of VotingMethod.count_votes()*/

  let result = [];
  let used_votecounts = new Set();

  for (let i = 0; i < candidates.length; i++) {
    let append = [];
    let max_counts = -Infinity;
    for (let j = 0; j < candidates.length; j++) {
      let votes = get_votes(candidates[j]);
      if ((votes > max_counts) & !used_votecounts.has(votes)) {
        max_counts = votes;
        append = [];
      }
      if (votes == max_counts) {
        append.push(candidates[j]);
      }
    }
    if (append.length > 0) {
      result.push(append);
      used_votecounts.add(max_counts);
    }
  }
  return result;
}
