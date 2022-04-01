class Voter extends Person {
  // Representation of the voters

  constructor(x, y, strategic, color, name) {
    super(x, y, color, name, voter_size);
    this.strategic = strategic;
    this.voted_for = undefined;
    this.supports = [];
  }

  distance_to_candidate(candidate) {
    let x_dist = this.x - candidate.x;
    let y_dist = this.y - candidate.y;
    return Math.sqrt(x_dist * x_dist + y_dist * y_dist);
  }

  honest_preference(cands) {
    // Returns the voter's honest preference based on an array of candidates

    let returned = cands.concat([]);
    let voter = this;
    returned.sort(function (a, b) {
      return voter.distance_to_candidate(a) - voter.distance_to_candidate(b);
    });
    return returned;
  }

  prefers(candidate1, candidate2) {
    // Returns the candidate more prefered by the voter
    if (
      this.distance_to_candidate(candidate1) >
      this.distance_to_candidate(candidate2)
    ) {
      return true;
    }
    return false;
  }

  show() {
    this.grow_to_size();

    if (this.strategic) {
      strokeWeight(strategic_voter_stroeke_weight);
      fill(this.color);
    } else {
      strokeWeight(voter_strokeWeight);
      noFill();
    }

    this.default_show();
  }

  remove_self() {
    remove_specific_voter(this);
  }

  get_honest_preference_div() {
    let returned = document.createElement("div");
    let text = document.createElement("p");
    text.innerText = "Honest preference:";

    let list = document.createElement("ol");
    let preference = this.honest_preference(candidates);

    for (let i = 0; i < preference.length; i++) {
      let li = document.createElement("li");
      li.appendChild(preference[i].get_name_p());
      list.appendChild(li);
    }
    returned.appendChild(text);
    returned.appendChild(list);
    return returned;
  }

  get_votes_div() {
    let voted_for_d = createDiv();
    voted_for_d.child(createP("Voted for:"));

    if (Array.isArray(this.voted_for)) {
      voted_for_d.child(
        this.last_voting_sytem.get_ballot_element(this.voted_for)
      );
    } else if (typeof this.voted_for === "undefined") {
      voted_for_d.child(createP("this person has not voted for anyone yet"));
    } else {
      voted_for_d.child(this.voted_for.get_name_p());
    }

    voted_for_d.elt
      .querySelector(":nth-child(2)")
      .classList.add("voter-voted-for");

    return voted_for_d;
  }

  get_extra_to_div() {
    let returned = createDiv();
    let strategic_p = createCheckbox("strategic", this.strategic);
    let supports_d = document.createElement("ul");

    strategic_p.parent_voter = this;
    strategic_p.changed(strategic_changed);

    if (this.supports.length != 0) {
      for (let i = 0; i < this.supports.length; i++) {
        let item = document.createElement("li");
        item.appendChild(
          this.supports[i].get_name_p(
            `| supporters: ${this.supports[i].supporters}`
          )
        );

        supports_d.appendChild(item);
      }
    } else {
      supports_d.appendChild(createP("this voter doesn't support anyone").elt);
    }

    returned.child(strategic_p);
    returned.child(this.get_honest_preference_div());
    returned.child(this.get_votes_div());
    returned.child(createP("Supports:"));
    returned.child(supports_d);

    if (this.strategic) {
      let tactical_div = document.createElement("div");
      let tactical_p = document.createElement("p");
      if (seems_win_candidates.length != 0) {
        tactical_p.innerText =
          "From the supporter counts of each candidate this tactical voter has concluded that these are the candidates, who are likely to win:";
        tactical_div.appendChild(tactical_p);

        let tactical_ul = document.createElement("ul");

        for (let i = 0; i < seems_win_candidates.length; i++) {
          let li = document.createElement("li");
          li.appendChild(
            seems_win_candidates[i].get_name_p(
              `| supporters: ${seems_win_candidates[i].supporters}`
            )
          );
          tactical_ul.appendChild(li);
        }

        tactical_div.appendChild(tactical_ul);
      } else {
        tactical_p.innerText =
          "From the supporter counts of each candidate this tactical voter was not able to predict which candidates are likely to win.";
        tactical_div.appendChild(tactical_p);
      }

      returned.child(tactical_div);
    }
    return returned;
  }
}

function strategic_changed() {
  // For the starategic checkbox in the selected_div

  if (!frozen_sim) {
    this.parent_voter.strategic = this.checked();
    change_in_sim = true;
  }
}

function delete_selected_voter() {
  this.parent_voter.remove();
  selected_div.child()[0].remove();
}

class Average extends Voter {
  get_extra_to_div() {
    return this.get_honest_preference_div();
  }

  remove_self() {
    return;
  }
  show() {
    this.replace();
    super.show();
  }

  replace() {
    let x_avg = 0;
    let y_avg = 0;

    for (const i of voters) {
      x_avg += i.x;
      y_avg += i.y;
    }

    x_avg = x_avg / voters.length;
    y_avg = y_avg / voters.length;

    this.x = x_avg;
    this.y = y_avg;
  }

  get_delete_button() {
    return null;
  }
}
