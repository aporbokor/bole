class Bucklin extends RankingVotingMethod {
  prepare_for_voting() {
    super.prepare_for_voting();
  }

  set_max(candidates) {
    for (let i = 0; i < this.candidates.length; i++) {
      candidates[i].final = 0;
      candidates[i].vote_count_for_visualization = [];
    }
  }

  count_votes() {
    this.set_max(candidates);
    let done = false;
    for (let i = 0; i < this.candidates.length; i++) {
      for (let j = 0; j < this.candidates.length; j++) {
        this.candidates[j].final += this.candidates[j].votes[i];
        this.candidates[j].vote_count_for_visualization.push(
          this.candidates[j].final
        );
        if (this.candidates[j].final > max_votes / 2) {
          done = true;
        }
      }
      if (done) {
        return count_votes_for_ints(
          candidates,
          (this.get_votes = function (cand) {
            return cand.final;
          })
        );
      }
    }
  }

  get_results_data(cand) {
    return [cand.final, "| final vote count: "];
  }

  extra_visualize(voters) {
    super.extra_visualize(voters);
    for (const cand of this.candidates) {
      cand.text = cand.final;
      cand.text_label = "final vote count";
    }
  }

  describe_process() {
    let description = document.createElement("div");
    description.innerText =
      "As the first step, we collect the voters preferences.";
    this.parent_box.set_content(description);
    this.parent_box.next_func(voting_machine.visualize_step);
  }

  visualize_step() {
    let step_div = document.createElement("div");
    let first_text = document.createElement("p");
    let second_text = document.createElement("p");
    let last_text = document.createElement("div");
    const step = voting_machine.step + 1;

    voting_machine.color_voters_based_on_nth_preference(step - 1);

    first_text.innerText = `As the ${int_to_serial_number(
      step
    )} step, we count each voter's ${int_to_serial_number(step)} preferences.`;

    if (step > 1) {
      second_text.innerText =
        "We will add these to the previous vote counts, to get the following result:";
    }

    let res = count_votes_for_ints(candidates, (cand) => {
      return cand.vote_count_for_visualization[step - 1];
    });

    console.log(res);

    let result_element = get_results_elements(res, (cand) => {
      return cand.get_custom_p(cand.vote_count_for_visualization[step - 1]);
    });

    if (step == candidates[0].vote_count_for_visualization.length) {
      this.parent_box.hide_next();
      let last_first_p = document.createElement("p");
      last_first_p.innerText =
        "In this round, at least one candidate had a majority, which means that this was the last round. We just need to count the final votes, to determent the winners:";

      let cands = document.createElement("div");
      for (const candidate of voting_results[0]) {
        cands.appendChild(candidate.get_p().elt);
      }
      let last_last_p = document.createElement("p");
      last_last_p.innerText =
        "So they will be the winner of this election, because they have the highest final  vote count.";

      last_text.appendChild(last_first_p);
      last_text.appendChild(cands);
      last_text.appendChild(last_last_p);
    } else {
      last_text.innerText = `In this round nobody had a majority (> ${ceil(
        max_votes / 2
      )} voters) so this process continues.`;
    }

    step_div.appendChild(first_text);
    step_div.appendChild(second_text);
    step_div.appendChild(result_element);
    step_div.appendChild(last_text);

    this.parent_box.set_content(step_div);

    voting_machine.step += 1;
  }

  steping_box_func(stepig_box) {
    this.steping_box = stepig_box;
    stepig_box.visualized_system = this;

    steping_box.show_next();

    this.step = 0;
    stepig_box.next_func(this.describe_process);
  }
}
