class SuplementaryLike extends RunoffLike {
  constructor(candidates, len) {
    super(candidates);
    this.tier_list_len = len;
    this.first_round = true;
    this.explaining_text = "In this round we are going to count the votes using voter's top choices. After that we are going to elliminate everyone except for the top 2 candidates."
    this.second_explaining_text = "These are the candidates with the fewest votes."
  }


  prepare_for_voting() {
    super.prepare_for_voting();
    for (let i = 0; i < this.candidates.length; i++) {
      this.candidates[i].votes = this.candidates[i].votes.slice(0, this.tier_list_len);
    }
  }

  registrate_strategic_vote(voter) {
    let most_liked_seems_likely = this.best_candidate_tier_list(voter, seems_win_candidates)[0];
    let honest_vote = this.registrate_honest_vote(voter);

    if ((!honest_vote.includes(most_liked_seems_likely)) & (seems_win_candidates.length > 1)) {
      honest_vote[this.tier_list_len - 1] = most_liked_seems_likely;
    }

    return honest_vote;
  }

  registrate_honest_vote(voter) {
    return super.registrate_honest_vote(voter).slice(0, this.tier_list_len);
  }

  elliminate_canidates(sub_votes, elliminated) {
    if (sub_votes.size <= 2) {
      return sub_votes.mins();
    }

    const losers = this.get_majority_losers(sub_votes);
    if (losers.length > 0) {
      this.won_by_majority = true;
      return losers;
    }
    let returned = sub_votes.sorted_array().slice(2);
    return returned;
  }

  get_reasoning_text(elliminated_candidates) {
    if (this.won_by_majority) {
      return createP("In this case a candidate already has a majority so it automatically wins.")
    }

    let returned = createP(this.second_explaining_text);
    if (this.first_round) {
      this.explaining_text = "Now we are going to re-run the election counting the each voter's highest ranked not elliminated candidate. The winner of this run will be the winner of the election.";
    }
    return returned;
  }

  extra_visualize(voters) {
    for (let i = 0; i < this.candidates.length; i++) {
      this.candidates[i].sub_votes_for_visualization[0] = this.candidates[i].sub_votes_for_visualization[0].slice(0, this.tier_list_len);
    }
    super.extra_visualize(voters);
  }
}


class SupplementaryVoter extends SuplementaryLike {
  constructor(candidates) {
    super(candidates, 2);
  }

}

class ContingentVoter extends SuplementaryLike {
  constructor(candidates) {
    super(candidates, candidates.length);
  }
}

class SriLankanContingentVoter extends SuplementaryLike {
  constructor(candidates) {
    let len = 2;
    if (candidates.length >= 3) {
      len = 3;
    }
    super(candidates, len);
  }
}
