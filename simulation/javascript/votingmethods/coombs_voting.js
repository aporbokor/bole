class CoombsVoting extends RunoffLike {
  constructor(candidates) {
    super(candidates);
    this.explaining_text =
      "Now we are going to eliminate the candidates, who the most voters have putted to last place.";
  }

  votes_for(voter, eliminated) {
    let tier_list = voter.voted_for.concat([]);
    let index = voter.voted_for.length - 1;
    let returned = tier_list[index];

    while (eliminated.has(returned)) {
      index--;
      returned = tier_list[index];
    }

    return returned;
  }

  eliminate_canidates(sub_votes, eliminated) {
    let last_places = new Counter();
    for (let i = 0; i < voters.length; i++) {
      last_places.count(this.get_last_valid_preference(voters[i], eliminated));
    }
    console.log(last_places);
    return last_places.maxs();
  }

  sub_votes_visualization_data(sub) {
    return [sub[0][sub[0].length - 1], "| sub-results: "];
  }

  visualize_for_stepping_box(subresult) {
    for (let i = 0; i < subresult.length; i++) {
      for (let j = 0; j < subresult[i].length; j++) {
        let votes = subresult[i][j][0].sub_votes_for_visualization[0];
        subresult[i][j][0].text = votes[votes.length - 1];
        subresult[i][j][1] = votes[votes.length - 1];
      }
    }

    subresult.sort(function (a, b) {
      return a[0][1] - b[0][1];
    });

    let res = get_results_elements(subresult, function (cand) {
      let candidate = cand[0];
      // let returned = createProgress(cand[0].name + ': ', cand[1], voters.length);
      // returned.label.style('color', cand[0].color);
      return candidate.get_custom_p(
        ...voter_maschine.sub_votes_visualization_data(
          candidate.sub_votes_for_visualization
        )
      );
    });

    return res;
  }

  get_reasoning_text(eliminated_candidates) {
    let votes = Array.from(eliminated_candidates.entries())[0][1]
      .sub_votes_for_visualization[0];
    let vote = votes[votes.length - 1];
    return createP(
      `The eliminated candidates in this vote counting had the most votes in the last place. They all had ${vote}.`
    );
  }
}
