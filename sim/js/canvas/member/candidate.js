const candidate_colors = [
  "#FEFCFB",
  "#ED3907",
  "#7247FF",
  "#162CD9",
  "#2BB7DE",
  "#BF1160",
  "#0FFA42",
];

const candidate_names = [
  "Alice",
  "Bob",
  "Charlie",
  "David",
  "Emily",
  "Fiona",
  "George"
];

const candidate_size = 40;
const candidate_strokeWeight = 5;
let to_remove_candidates = [];
let to_add_candidates = [];
const min_candidates = 2;
const max_candidates = 7;


class Candidate extends Person {
  // Class representing the candidates
  constructor(x, y, color, name, id) {
    super(x, y, color, name, candidate_size);
    this.votes = undefined;
    this.supporters = 0;
    this.seems_win = null;
    this.id = id;
    this.hidden_size = 10;
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
        createP("Supporters: not available until a sim has run")
      );
    } else {
      extra_to_div.child(createP("Supporters: " + this.supporters));
    }

    if (this.seems_win) {
      extra_to_div.child(
        createP(
          "From the supporter count of this candidate, tactical voters have concluded that this candidate is likely to win. This might cause them to vote differently than honest voters."
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

function random_candidate(i) {
  return new Candidate(
    round(random(width)),
    round(random(height)),
    rewrapp_index(candidate_colors, i),
    rewrapp_index(candidate_names, i),
    i
  );
}

function add_candidate() {
  if ((candidates.length != max_candidates) & !frozen_sim) {
    candidates.push(to_add_candidates.shift());
    update_candidate_poupulation();
    change_in_sim = true;
  }
}

function remove_candidate() {
  if ((candidates.length != min_candidates) & !frozen_sim) {
    candidates[candidates.length - 1].remove();
    update_candidate_poupulation();
  }
}

function remove_specific_candidate(candidate) {
  // candidates = candidates.filter(function(curval){return curval != candidate})
  if (
    (candidates.length - to_remove_candidates != min_candidates) &
    !frozen_sim
  ) {
    to_remove_candidates.push(candidate);
    to_add_candidates.unshift(candidate);
  }
}

function make_candidates(db) {
  // Add candidates to the sim
  if (!frozen_sim) {
    candidates = [];
    for (let i = 0; i < db; i++) {
      candidates.push(random_candidate(i));
    }
    for (let i = db; i < max_candidates; i++) {
      to_add_candidates.push(random_candidate(i));
    }
  }
}

function get_shown_candidates(cands = candidates) {
  return cands.filter((cand) => cand.to_show);
}

function get_hidden_candidates(cands = candidates) {
  return cands.filter((cand) => !cand.to_show);
}
