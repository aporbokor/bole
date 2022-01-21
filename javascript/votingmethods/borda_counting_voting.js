class BordaCounting extends RankingVotingMethod {

  prepare_for_voting() {
    super.prepare_for_voting();

    for (let i = 0; i < this.candidates.length; i++) {
      this.candidates[i].borda_count = 0;
    }

    max_votes = sum_of_natural_numbers(0, this.candidates.length) * voter_population * 1.8;
  }

  get_results_data(cand) {
    return [cand.borda_count, '| borda score: '];
  }

  registrate_honest_vote(voter) {
    return this.best_candidate_tier_list(voter);
  }

  registrate_strategic_vote(voter) {
    if (seems_win_candidates.length == 0) {
      return this.registrate_honest_vote(voter);
    }
    let winner_tier_list = this.best_candidate_tier_list(voter, seems_win_candidates);
    let top = winner_tier_list[0];
    let bottom = winner_tier_list.slice(1);

    let loser_tier_list = this.best_candidate_tier_list(voter, seems_lose_candidates);

    let returned = loser_tier_list.concat(bottom);
    returned.unshift(top);

    return returned;
  }

  registrate_vote(voter) {
    let tier_list;

    if (voter.strategic) {
      tier_list = this.registrate_strategic_vote(voter);
    } else {
      tier_list = this.registrate_honest_vote(voter);
    }

    for (let i = 0; i < tier_list.length; i++) {
      tier_list[i].borda_count += (tier_list.length - i);
    }

    this.update_votecounts(tier_list);
    voter.voted_for = tier_list;
  }

  count_votes() {
    return count_votes_for_ints(this.candidates, function (cand) { return cand.borda_count });
  }

  extra_visualize(voters) {
    super.extra_visualize(voters);

    for (let i = 0; i < candidates.length; i++) {
      candidates[i].text = candidates[i].borda_count;
      candidates[i].text_label = "Borda score"
    }
  }
}
