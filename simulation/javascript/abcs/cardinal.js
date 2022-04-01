class cardinalVotingMethod extends VotingMethod {
  constructor(candidates) {
    super(candidates);
    ABC_constructor(this, cardinalVotingMethod);
    this.ranges = [];
  }

  prepare_for_voting() {
    for (let i = 0; i < this.candidates.length; i++) {
      this.candidates[i].votes = [];
      this.candidates[i].score = 0;
      for (let j = 0; j < this.ranges.length; j++) {
        this.candidates[i].votes[j] = 0;
      }
    }
  }

  registrate_honest_vote(voter) {
    let arr = [];
    for (let k = 0; k < this.ranges.length; k++) {
      arr[k] = [];
    }
    for (let i = 0; i < this.candidates.length; i++) {
      for (let j = 0; j < this.ranges.length; j++) {
        if (j == 0) {
          if (
            voter.distance_to_candidate(this.candidates[i]) <= this.ranges[j]
          ) {
            this.candidates[i].votes[j] += 1;
            arr[j].push(this.candidates[i]);
          }
        } else {
          let dist = voter.distance_to_candidate(this.candidates[i]);
          if (dist <= this.ranges[j] && dist > this.ranges[j - 1]) {
            this.candidates[i].votes[j] += 1;
            arr[j].push(this.candidates[i]);
          }
        }
      }
    }
    voter.voted_for = arr;
  }

  registrate_strategic_vote(voter) {
    let arr = [];
    for (let k = 0; k < this.ranges.length; k++) {
      arr[k] = [];
    }

    let prefs = voter.honest_preference(this.candidates);
    prefs[0].votes[0] += 1;
    arr[0].push(prefs[0]);

    let k = this.ranges.length;
    for (let i = 1; i < prefs.length; i++) {
      prefs[i].votes[k - 1] += 1;
      arr[k - 1].push(prefs[i]);
    }
    voter.voted_for = arr;
  }

  registrate_vote(voter) {
    if (voter.strategic) {
      this.registrate_strategic_vote(voter);
    } else {
      this.registrate_honest_vote(voter);
    }
    if (voter.voted_for.length == 0) {
      let pref = voter.honest_preference(this.candidates);
      for (let i = 1; i < pref.length; i++) {
        pref[i].votes[1] += 1;
      }
      pref[0].votes[0] += 1;
      voter.voted_for = [pref[0]];
    }
  }

  vote_to_text(vote) {}

  get_ballot_element(vf) {
    console.log(vf);
    let returned = document.createElement('ul');

    for (let i = 0; i < vf.length; i++) {
      let sub_ul = document.createElement('ul');
      let sub_li = document.createElement('li');
      let sub_text = document.createElement('li');
      sub_text.innerText = this.vote_to_text(i);
      returned.appendChild(sub_text);
      sub_li.appendChild(sub_ul);

      for (let j = 0; j < vf[i].length; j++) {
        let li = document.createElement('li');
        li.appendChild(vf[i][j].get_name_p());
        sub_ul.appendChild(li);
      }
      returned.appendChild(sub_li);
    }
    return returned;
  }

  draw_circles_around_candidate(candidate) {
    noFill();
    let acc = 0;
    for (let i = 0; i < this.ranges.length - 1; i++) {
      stroke(lerpColor(color(candidate.color), color('black'), acc));
      circle(candidate.x, candidate.y, this.ranges[i] * 2);
      acc += 1 / this.ranges.length;
    }
    stroke(default_stroke);
  }

  resize_voters(candidate) {
    for (let i = 0; i < voters.length; i++) {
      let place = voter_maschine.place_in_voted_for(voters[i], candidate);
      voters[i].target_size += lerp(
        selected_size_adder * 2,
        -selected_size_adder * 2,
        place / voters[i].voted_for.length
      );
    }
  }

  place_in_voted_for(voter, candidate) {
    for (let i = 0; i < voter.voted_for.length; i++) {
      if (voter.voted_for[i].includes(candidate)) {
        return i;
      }
    }
  }

  paint_voters() {
    for (let i = 0; i < voters.length; i++) {
      for (let j = 0; j < this.ranges.length - 1; j++) {
        if (voters[i].voted_for[j].length != 0) {
          voters[i].set_color(voters[i].voted_for[j][0].color);
          break;
        }
      }
    }
  }
}
