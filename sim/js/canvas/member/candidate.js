class Candidate extends Person {
  // Class representing the candidates
  constructor(x, y, color, name, id) {
    super(x, y, color, name, candidate_size);
    this.votes = undefined;
    this.supporters = 0;
    this.seems_win = null;
    this.id = id;
  }

  show() {
    this.grow_to_size();
    strokeWeight(candidate_strokeWeight);

    fill(this.color);
    this.default_show();
  }

  remove_self() {
    remove_specific_candidate(this);
  }

  get_small_p() {
    let returned;
    if (typeof this.votes === "undefined") {
      returned = createP(this.name + "|no votes yet");
    } else if (Array.isArray(this.votes)) {
      returned = createP(this.name + "| Votes: " + this.votes.join(", "));
    } else {
      returned = createP(this.name + "| Votes: " + this.votes);
    }

    returned.class("candidate_p");
    returned.style("color", this.color);

    return returned;
  }

  get_p() {
    return this.get_custom_p(...voting_machine.get_results_data(this));
  }

  get_extra_to_div() {
    let extra_to_div = createDiv();

    if (Array.isArray(this.votes)) {
      extra_to_div.child(createP("Votes:" + this.votes.toString()));
    } else if (typeof this.votes === "undefined") {
      extra_to_div.child(createP("No votes yet"));
    } else {
      extra_to_div.child(createP("Votes: " + this.votes));
    }

    if (this.supporters == 0) {
      extra_to_div.child(
        createP("Supporters: not avelable until a sim has run")
      );
    } else {
      extra_to_div.child(createP("Supporters: " + this.supporters));
    }

    if (this.seems_win) {
      extra_to_div.child(
        createP(
          "From the supporter count of this candidate, tactical voters have concluded that this candidate is likely to win. This might cause them to vote diferently than honest voters."
        )
      );
    }

    return extra_to_div;
  }
}

function count_supporters() {
  // Counts the supportes of each candidate. This data can be used by strategic voters

  supporter_population = 0;

  for (let i = 0; i < candidates.length; i++) {
    candidates[i].supporters = 0;
  }

  for (let i = 0; i < voters.length; i++) {
    let voter = voters[i];
    voter.supports = [];
    for (let j = 0; j < candidates.length; j++) {
      let candidate = candidates[j];
      let res =
        dist(candidate.x, candidate.y, voter.x, voter.y) <= support_range;

      if (res) {
        supporter_population += 1;
        candidate.supporters += 1;
        voter.supports.push(candidate);
      }
    }
  }
}

function calculate_seems_win_candidates() {
  // Decides what candidate seems likely to win and to lose. This data can be used by strategic voters
  supporter_per_candidate = supporter_population / candidates.length;
  const supporters_to_win = seems_win_percent * supporter_per_candidate;

  seems_win_candidates = [];
  seems_lose_candidates = [];

  for (let i = 0; i < candidates.length; i++) {
    let candidate = candidates[i];

    if (candidate.supporters >= supporters_to_win) {
      seems_win_candidates.push(candidate);
      candidate.seems_win = true;
      continue;
    }
    seems_lose_candidates.push(candidate);
    candidate.seems_win = false;
  }
}
