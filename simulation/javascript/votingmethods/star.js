class starVoter extends cardinalVotingMethod {
  constructor(candidates) {
    super(candidates);
    this.ranges = [
      approval_range / 2 / 2,
      approval_range / 2,
      (approval_range * 2) / 2,
      (approval_range * 4) / 2,
      max_range,
    ];
  }

  find_top(candidates) {
    let max = candidates[0];
    for (let i = 1; i < candidates.length; i++) {
      if (candidates[i].score > max.score) {
        max = candidates[i];
      }
    }
    return max;
  }

  prefers(vf, c1, c2) {
    for (const v in vf) {
      if (v.includes(c1)) {
        return 'one';
      } else if (v.includes(c2)) {
        return 'two';
      }
    }
  }

  count_votes() {
    for (const c of candidates) {
      let s = this.ranges.length;
      for (let i = 0; i < s; i++) {
        c.score += c.votes[i] * s;
        s -= 1;
      }
    }
    let tops = [];
    let f = this.find_top(candidates);
    tops.push(f);
    let cands = this.candidates.filter(c => c != top);
    let s = this.find_top(cands);
    tops.push(s);
    tops[0].final = 0;
    tops[1].final = 0;
    for (let i = 0; i < voters.length; i++) {
      let pref = this.prefers(voters[i].voted_for, tops[0], tops[1]);
      if (pref == 'one') {
        tops[0].final += 1;
      } else if (pref == 'two') {
        tops[1].final += 1;
      }
    }

    return count_votes_for_ints(
      this.candidates,
      (this.get_votes = function (c) {
        return c.final;
      })
    );
  }
}
