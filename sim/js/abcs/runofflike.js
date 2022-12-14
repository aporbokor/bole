class RunoffLike extends RankingVotingMethod {
  constructor(candidates) {
    super(candidates);
    ABC_constructor(this, RunoffLike);
    this.explaining_text = "[placeholder text]";
  }

  prepare_for_voting() {
    super.prepare_for_voting();
    this.eliminated_visualization = new Set();
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

  get_last_valid_preference(voter, eliminated) {
    let tier_list = voter.voted_for.concat([]);
    let index = tier_list.length - 1;
    let returned = tier_list[index];

    while (eliminated.has(returned)) {
      index--;
      returned = tier_list[index];
    }
    return returned;
  }

  best_valid_candidate_tier_list(voter, eliminated) {
    let tier_list = voter.voted_for.concat([]);
    for (let i = tier_list.length - 1; i >= 0; i--) {
      let item = tier_list[i];
      if (eliminated.has(item)) {
        tier_list.splice(i, 1);
      }
    }
    return tier_list;
  }

  set_candidate_votes(eliminated) {
    for (let i = 0; i < this.candidates.length; i++) {
      let pushed = [];
      for (let j = 0; j < this.candidates.length - eliminated.size; j++) {
        pushed.push(0);
      }

      this.candidates[i].sub_votes_for_visualization.push(pushed);
    }

    for (let i = 0; i < voters.length; i++) {
      let tier_list = this.best_valid_candidate_tier_list(
        voters[i],
        eliminated
      );

      for (let j = 0; j < tier_list.length; j++) {
        let candidate = tier_list[j];
        candidate.sub_votes_for_visualization[
          candidate.sub_votes_for_visualization.length - 1
        ][j] += 1;
      }
    }
  }

  step_in_visualization() {
    for (let i = 0; i < this.candidates.length; i++) {
      this.candidates[i].sub_votes_for_visualization.shift();
    }
  }

  eliminate_canidates(sub_votes, eliminated) {
    throw new Error(
      "You must implement an eliminate_canidates method to your RankingVotingMethod class"
    );
  }

  get_reasoning_text(eliminated_candidates) {
    return createP("[placeholder text]");
  }

  count_votes() {
    let result = [];
    let eliminated = new Set();

    this.sub_results = [];
    this.sub_votes_for_visualization = [];

    while (eliminated.size < this.candidates.length) {
      let not_eliminated = this.candidates.filter((c) => {
        return !eliminated.has(c);
      });

      let sub_votes = Counter.from_array(not_eliminated);
      console.log(eliminated, not_eliminated);

      for (let i = 0; i < voters.length; i++) {
        let vote = this.votes_for(voters[i], eliminated);
        if (vote != undefined) {
          sub_votes.count(vote);
        }
      }

      this.set_candidate_votes(eliminated);

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

      let new_ellimination = this.eliminate_canidates(sub_votes, eliminated);

      result.unshift(new_ellimination);

      for (let j = 0; j < new_ellimination.length; j++) {
        eliminated.add(new_ellimination[j]);
      }
    }
    console.log(this.sub_votes_for_visualization);
    return result;
  }

  color_voters() {
    for (let i = 0; i < voters.length; i++) {
      let chosen_candidate = this.votes_for(
        voters[i],
        this.eliminated_visualization
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

  visualize_for_steping_box(subresult) {
    for (let i = 0; i < subresult.length; i++) {
      for (let j = 0; j < subresult[i].length; j++) {
        subresult[i][j][0].text = subresult[i][j][1];
      }
    }

    let res = get_results_elements(subresult, function (cand) {
      let candidate = cand[0];
      // let returned = createProgress(cand[0].name + ': ', cand[1], voters.length);
      // returned.label.style('color', cand[0].color);
      return candidate.get_custom_p(
        ...voting_machine.sub_votes_visualization_data(
          candidate.sub_votes_for_visualization
        )
      );
    });

    return res;
  }

  show_steping_box_content() {
    let voting_system = this.parent_box.visualized_system;
    let content = createDiv();

    if (voting_system.visualization_step == 0) {
      extra_function = function () {
        for (const y of steping_box.visualized_system.eliminated_visualization.values()) {
          y.grow_by(-0.4 * candidate_size);
        }
      };
    }

    content.child(
      createP(
        "This is the " +
          int_to_serial_number(voting_system.visualization_step) +
          " step"
      )
    );

    if (
      voting_system.visualization_step <
      voting_system.sub_results.length - 1
    ) {
      voting_system.color_voters();

      let explaining_p = createP(voting_system.explaining_text);
      content.child(explaining_p);
      explaining_p.class("explaining_p");

      let subresult =
        voting_system.sub_results[voting_system.visualization_step];

      let res = voting_system.visualize_for_steping_box(subresult);

      let eliminated_candidates = voting_system.eliminate_canidates(
        voting_system.sub_votes_for_visualization[
          voting_system.visualization_step
        ],
        voting_system.eliminated_visualization
      );
      let eliminated_div = createDivWithP(
        "These candidate(s) were eliminated:"
      );

      for (const x of voting_system.eliminated_visualization.values()) {
        x.hide();
      }

      for (let i = 0; i < eliminated_candidates.length; i++) {
        eliminated_div.child(
          eliminated_candidates[i].get_custom_p(
            eliminated_candidates[i].sub_votes_for_visualization[0]
          )
        );
      }

      eliminated_div.child(
        voting_system.get_reasoning_text(eliminated_candidates)
      );

      for (let i = 0; i < eliminated_candidates.length; i++) {
        voting_system.eliminated_visualization.add(eliminated_candidates[i]);
      }

      content.child(res);
      content.child(eliminated_div);

      voting_system.step_in_visualization();
    } else {
      content.child(createP("The winner has been chosen"));
      voting_system.set_final_extra_function();
      this.parent_box.hide_next();
    }

    this.parent_box.set_content(content);
    voting_system.visualization_step += 1;
  }

  steping_box_func(stepig_box) {
    this.stepig_box = stepig_box;
    stepig_box.visualized_system = this;

    this.visualization_step = 0;
    steping_box.show_next();

    stepig_box.next_func(this.show_steping_box_content);
  }

  set_final_extra_function() {
    this.eliminated_visualization.forEach(function (candidate) {
      candidate.appear();
    });
    this.eliminated_visualization.clear();
    this.extra_visualize(voters);
  }

  extra_visualize(voters) {
    for (let i = 0; i < candidates.length; i++) {
      candidates[i].text = null;
    }

    for (let i = 0; i < voters.length; i++) {
      const eliminated = union(
        this.eliminated_visualization,
        get_hidden_candidates()
      );

      let color_to_set = honest_voter_color;
      if (eliminated.size < candidates.length) {
        color_to_set = this.votes_for(voters[i], eliminated).color;
      }
      voters[i].set_color(color_to_set);
    }
    super.set_extra_funct(voters);
  }
}
