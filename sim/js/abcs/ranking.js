class RankingVotingMethod extends VotingMethod {
  // ABC for every voting_method where the voters need to rank the candidates

  constructor(candidates) {
    super(candidates);
    ABC_constructor(this, RankingVotingMethod);
  }

  prepare_for_voting() {
    for (let i = 0; i < this.candidates.length; i++) {
      let votes = [];
      for (let j = 0; j < this.candidates.length; j++) {
        votes.push(0);
      }
      this.candidates[i].votes = votes;
    }
  }

  register_honest_vote(voter) {
    return this.best_candidate_tier_list(voter, this.candidates);
  }

  register_strategic_vote(voter) {
    return this.register_honest_vote(voter);
  }

  register_vote(voter) {
    let ballot;

    if (voter.strategic) {
      ballot = this.register_strategic_vote(voter);
    } else {
      ballot = this.register_honest_vote(voter);
    }

    this.update_votecounts(ballot);

    voter.voted_for = ballot;
  }

  best_candidate_tier_list(voter, candidates_ = this.candidates) {
    // Given a voter and a list of candidates, retuns the voter's preference list for those candidates
    return voter.honest_preference(candidates_);
  }

  update_votecounts(ballot) {
    // Updates the candidates' vote counts based on a ballot
    for (let i = 0; i < ballot.length; i++) {
      ballot[i].votes[i] += 1;
    }
  }

  set_extra_funct(voters) {
    // Sets the extra_function ehat is used in visualizations and called in every frame

    for (let i = 0; i < voters.length; i++) {
      voters[i].on_select = function () {
        if (this.arrows_from.length > 0) {
          return null;
        }

        for (let j = 0; j < this.voted_for.length; j++) {
          let cand = this.voted_for[j];
          let arr = new Arrow(
            cand.color,
            `${this.name}'s ballot arrow`,
            this,
            cand
          );

          arr.text = int_to_serial_number(j + 1);
          arr.text_label = `${cand.get_name_p().outerHTML}'s place in ${
            this.get_name_p().outerHTML
          }'s ballot`;
        }
      };
    }

    extra_function = function () {
      if (typeof clicked_selected != "undefined") {
        if (typeof clicked_selected.voted_for != "undefined") {
          // Highlight the candidates based on their place in the selected voter's preference ballot
          let voter = clicked_selected;
          for (let j = 0; j < voter.voted_for.length; j++) {
            let candidate = voter.voted_for[j];
            let thick_amount = map(
              voter.voted_for.length - j,
              1,
              voter.voted_for.length,
              1,
              clicked_selected_stroke_weight
            );

            candidate.grow_by(-candidate_size + 5 + thick_amount * 10);
          }
        } else if (typeof clicked_selected.votes != "undefined") {
          // Highlight the voters based on where did tey put the selected candidate in their ballot
          let candidate = clicked_selected;
          for (let i = 0; i < voters.length; i++) {
            let voter = voters[i];
            let place = voter.voted_for.findIndex(function (a) {
              return a === candidate;
            });
            if (place != -1) {
              voter.grow_by(
                map(
                  voter.voted_for.length - place,
                  1,
                  voter.voted_for.length,
                  -0.5 * voter_size,
                  0.5 * voter_size
                )
              );
              continue;
            }
            voter.grow_by(-voter_size + 1);
          }
        }
      }
    };
  }

  get_ballot_element(ballot) {
    let returned = document.createElement("ol");

    for (let i = 0; i < ballot.length; i++) {
      let li = document.createElement("li");
      li.appendChild(ballot[i].get_name_p());
      returned.appendChild(li);
    }
    return returned;
  }

  extra_visualize(voters) {
    // Colors the voters based on their first choice and calls set_extra_funct()
    for (let i = 0; i < voters.length; i++) {
      voters[i].set_color(voters[i].voted_for[0].color);
    }

    this.set_extra_funct(voters);
  }

  color_voters_based_on_nth_preference(n) {
    for (const voter of voters) {
      voter.set_color(voter.voted_for[n].target_color);
    }
  }
}
