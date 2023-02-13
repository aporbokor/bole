class Evaluative extends cardinalVotingMethod {
  constructor(candidates) {
    super(candidates);

    this.ranges = [
      (approval_range * 2) / 3,
      (approval_range * 4) / 3,
      max_range,
    ];
  }

  count_votes() {
    for (const cand of candidates) {
      cand.score = cand.votes[0] - cand.votes[2];
    }

    return count_votes_for_ints(
      this.candidates,
      (this.get_votes = function (c) {
        return c.score;
      })
    );
  }

  vote_to_text(vote) {
    if (vote == 0) {
      return "for";
    }
    if (vote == 1) {
      return "abstain";
    }
    return "against";
  }

  get_results_data(cand) {
    return [cand.score, "| Score: "];
  }

  extra_visualize(voters) {
    this.paint_voters();
    this.set_up_voter_arrows();

    for (const cand of candidates) {
      cand.text = cand.score;
      cand.text_label = "score";
    }

    extra_function = function () {
      for (let i = 0; i < candidates.length; i++) {
        voting_machine.draw_circles_around_candidate(candidates[i]);
      }
      if (candidates.some(isin)) {
        voting_machine.resize_voters(clicked_selected);
      }
    };
  }
  stepping_box_func(stepping_box) {
    let content = document.createElement("div");

    let description = document.createElement("p");
    description.innerText =
      "Evaluative voting works like the following: every voter votes ranks every candidate using 3 scores: for (1), abstain (0) and against (-1). In the end we evaluate the scores for each candidate and the candidate with the most points wins.";

    const example_cand = random(candidates);

    let text1 = document.createElement("p");
    text1.innerHTML = `For example ${
      example_cand.get_simple_name_p().outerHTML
    } has ${example_cand.votes[0]} votes for <strong>for</strong> him/her and ${
      example_cand.votes[2]
    } <strong>against</strong> him/her. This means that ${
      example_cand.get_simple_name_p().outerHTML
    } will gain ${example_cand.votes[0]} points and lose ${
      example_cand.votes[2]
    } points leaving us with the total of ${example_cand.score} points.`;

    content.appendChild(description);
    content.appendChild(text1);
    content.appendChild(this.get_scores_div_cand_list());

    stepping_box.set_content(content);
  }
}
