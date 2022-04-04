class RunoffLike extends RankingVotingMethod {
  constructor(candidates) {
    super(candidates);
    ABC_constructor(this, RunoffLike);
    this.explaining_text = "[placeholder text]";
  }

  prepare_for_voting() {
    super.prepare_for_voting();
    this.elliminated_visualization = new Set();
    for (let i = 0; i < this.candidates.length; i++) {
      this.candidates[i].sub_votes_for_visualization = [];
    }
  }

  winner_by_majority(sub_votes) {
    // console.log(sub_votes.max_count);
    return sub_votes.max_count() > voters.length / 2;
  }

  get_majority_losers(sub_votes) {
    if (this.winner_by_majority(sub_votes) & (sub_votes.size > 1)) {
      const winner_votes = sub_votes.max_count();
      let losers = Array.from(sub_votes).filter(function (a) {
        return a[1] != winner_votes;
      });

      let returned = [];
      for (let i = 0; i < losers.length; i++) {
        returned.push(losers[i][0]);
      }

      // this.won_by_majority = true;
      return returned;
    }
    return [];
  }

  votes_for(voter, eliminated) {
    let tier_list = voter.voted_for.concat([]);
    let index = 0;
    let returned = tier_list[index];

    while (eliminated.has(returned)) {
      index++;
      returned = tier_list[index];
    }

    return returned;
  }

  get_last_valid_preference(voter, elliminated) {
    let tier_list = voter.voted_for.concat([]);
    let index = tier_list.length - 1;
    let returned = tier_list[index];

    while (elliminated.has(returned)) {
      index--;
      returned = tier_list[index];
    }
    return returned;
  }

  best_valid_candidate_tier_list(voter, elliminated) {
    let tier_list = voter.voted_for.concat([]);
    for (let i = tier_list.length - 1; i >= 0; i--) {
      let item = tier_list[i];
      if (elliminated.has(item)) {
        tier_list.splice(i, 1);
      }
    }
    return tier_list;
  }

  set_candidate_votes(elliminated) {
    for (let i = 0; i < this.candidates.length; i++) {
      let pushed = [];
      for (let j = 0; j < this.candidates.length - elliminated.size; j++) {
        pushed.push(0);
      }

      this.candidates[i].sub_votes_for_visualization.push(pushed);
    }

    for (let i = 0; i < voters.length; i++) {
      let tier_list = this.best_valid_candidate_tier_list(
        voters[i],
        elliminated
      );

      for (let j = 0; j < tier_list.length; j++) {
        let candidate = tier_list[j];
        candidate.sub_votes_for_visualization[
          candidate.sub_votes_for_visualization.length - 1
        ][j] += 1;
      }
    }
  }

  stepp_in_visualization() {
    for (let i = 0; i < this.candidates.length; i++) {
      this.candidates[i].sub_votes_for_visualization.shift();
    }
  }

  elliminate_canidates(sub_votes, elliminated) {
    throw new Error(
      "You must implement an elliminate_canidates method to your RankingVotingMethod class"
    );
  }

  get_reasoning_text(elliminated_candidates) {
    return createP("[placeholder text]");
  }

  count_votes() {
    let result = [];
    let elliminated = new Set();

    this.sub_results = [];
    this.sub_votes_for_visualization = [];

    while (elliminated.size < this.candidates.length) {
      let not_elliminated = this.candidates.filter((c) => {
        return !elliminated.has(c);
      });

      let sub_votes = Counter.from_array(not_elliminated);
      console.log(elliminated, not_elliminated);

      for (let i = 0; i < voters.length; i++) {
        let vote = this.votes_for(voters[i], elliminated);
        if (vote != undefined) {
          sub_votes.count(vote);
        }
      }

      this.set_candidate_votes(elliminated);

      this.sub_votes_for_visualization.push(sub_votes.copy());

      let sub_result = [];

      for (const x of sub_votes.entries()) {
        sub_result.push(x);
      }
      console.log({ sub_result, sub_votes });

      this.sub_results.push(
        count_votes_for_ints(sub_result, function (cand) {
          return cand[1];
        })
      );

      let new_ellimination = this.elliminate_canidates(sub_votes, elliminated);

      result.unshift(new_ellimination);

      for (let j = 0; j < new_ellimination.length; j++) {
        elliminated.add(new_ellimination[j]);
      }
    }
    console.log(this.sub_votes_for_visualization);
    return result;
  }

  color_voters() {
    for (let i = 0; i < voters.length; i++) {
      let chosen_candidate = this.votes_for(
        voters[i],
        this.elliminated_visualization
      );
      if (chosen_candidate === undefined) {
        voters[i].set_color(honest_voter_color);
        continue;
      }

      voters[i].set_color(chosen_candidate.color);
    }
  }

  sub_votes_visualization_data(sub) {
    return [sub[0][0], "| sub-results: "];
  }

  visualize_for_stepping_box(subresult) {
    for (let i = 0; i < subresult.length; i++) {
      for (let j = 0; j < subresult[i].length; j++) {
        subresult[i][j][0].text = subresult[i][j][1];
      }
    }

    let res = get_results_elements(subresult, function (cand) {
      let candidate = cand[0];
      // let returned = createProgress(cand[0].name + ': ',cand[1],voters.length);
      // returned.label.style('color',cand[0].color);
      return candidate.get_custom_p(
        ...voter_maschine.sub_votes_visualization_data(
          candidate.sub_votes_for_visualization
        )
      );
    });

    return res;
  }

  show_stepping_box_content() {
    let voting_sytem = this.parent_box.visualized_system;
    let content = createDiv();

    if (voting_sytem.visualization_stepp == 0) {
      extra_function = function () {
        for (const y of stepping_box.visualized_system.elliminated_visualization.values()) {
          y.grow_by(-0.4 * candidate_size);
        }
      };
    }

    content.child(
      createP(
        "This is the " +
          int_to_serial_number(voting_sytem.visualization_stepp) +
          " step"
      )
    );

    if (
      voting_sytem.visualization_stepp <
      voting_sytem.sub_results.length - 1
    ) {
      voting_sytem.color_voters();

      let explaining_p = createP(voting_sytem.explaining_text);
      content.child(explaining_p);
      explaining_p.class("explaining_p");

      let subresult =
        voting_sytem.sub_results[voting_sytem.visualization_stepp];

      let res = voting_sytem.visualize_for_stepping_box(subresult);

      let elliminated_candidates = voting_sytem.elliminate_canidates(
        voting_sytem.sub_votes_for_visualization[
          voting_sytem.visualization_stepp
        ],
        voting_sytem.elliminated_visualization
      );
      let elliminated_div = createDivWithP(
        "These candidate(s) were elliminated:"
      );

      for (const x of voting_sytem.elliminated_visualization.values()) {
        x.hide();
      }

      for (let i = 0; i < elliminated_candidates.length; i++) {
        elliminated_div.child(
          elliminated_candidates[i].get_custom_p(
            elliminated_candidates[i].sub_votes_for_visualization[0]
          )
        );
      }

      elliminated_div.child(
        voting_sytem.get_reasoning_text(elliminated_candidates)
      );

      for (let i = 0; i < elliminated_candidates.length; i++) {
        voting_sytem.elliminated_visualization.add(elliminated_candidates[i]);
      }

      content.child(res);
      content.child(elliminated_div);

      voting_sytem.stepp_in_visualization();
    } else {
      content.child(createP("The winner has been chosen"));
      voting_sytem.set_final_extra_function();
      this.parent_box.hide_next();
    }

    this.parent_box.set_content(content);
    voting_sytem.visualization_stepp += 1;
  }

  stepping_box_func(steppig_box) {
    this.steppig_box = steppig_box;
    steppig_box.visualized_system = this;

    this.visualization_stepp = 0;
    stepping_box.show_next();

    steppig_box.next_func(this.show_stepping_box_content);
  }

  set_final_extra_function() {
    this.elliminated_visualization.forEach(function (candidate) {
      candidate.appear();
    });
    this.elliminated_visualization.clear();
    this.extra_visualize(voters);
  }

  extra_visualize(voters) {
    for (let i = 0; i < candidates.length; i++) {
      candidates[i].text = null;
    }

    for (let i = 0; i < voters.length; i++) {
      voters[i].set_color(
        this.votes_for(voters[i], this.elliminated_visualization).color
      );
    }
    super.set_extra_funct(voters);
  }
}
