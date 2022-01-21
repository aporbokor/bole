class Voter extends Person{
  // Representation of the voters

  constructor(x, y, strategic, color, name){
    super(x, y, color, name, voter_size);
    this.strategic = strategic;
    this.voted_for = undefined;
    this.supports = [];
  }

  distance_to_candidate(candidate){
    let x_dist = this.x - candidate.x;
    let y_dist = this.y - candidate.y;
    return Math.sqrt(x_dist*x_dist + y_dist*y_dist);
  }

  honest_preference(cands){
    // Returns the voter's honest preference based on an array of candidates

    let returned = cands.concat([]);
    let voter = this;
    returned.sort(function (a,b){return voter.distance_to_candidate(a)-voter.distance_to_candidate(b)});
    return returned;
  }

  prefers(candidate1, candidate2){
    // Returns the candidate more prefered by the voter
    if (this.distance_to_candidate(candidate1) > this.distance_to_candidate(candidate2)){
      return true;
    }
    return false;
  }

  show(){
    this.grow_to_size();

    if (this.strategic){
      strokeWeight(strategic_voter_stroeke_weight)
      fill(this.color);
    }else{
      strokeWeight(voter_strokeWeight);
      noFill();
    }

    this.default_show();
  }

  remove_self(){
    remove_specific_voter(this);
  }

  get_honest_preference_div(){
    let returned = document.createElement('div');
    let text = document.createElement('p');
    text.innerText = "Honest preference:";

    let list = document.createElement('ol');
    let preference = this.honest_preference(candidates);

    for (let i = 0; i < preference.length; i++){
      let li = document.createElement("li")
      li.appendChild(preference[i].get_name_p())
      list.appendChild(li);
    }
    returned.appendChild(text);
    returned.appendChild(list);
    return returned;
  }

  get_extra_to_div(){
    let returned = createDiv();
    let strategic_p = createCheckbox('strategic', this.strategic);
    let supports_d = createDiv('Supports:');

    strategic_p.parent_voter = this;
    strategic_p.changed(strategic_changed);

    let voted_for_d = createDiv('Voted for:');
    if (Array.isArray(this.voted_for)){
      voted_for_d.child(this.last_voting_sytem.get_ballot_element(this.voted_for));

    }else if (typeof this.voted_for === 'undefined'){
      voted_for_d.child(createP('this person has not voted for anyone yet'));
    }else{
      voted_for_d.child(this.voted_for.get_p());
    }

    if (this.supports.length != 0){
      for (let i = 0; i<this.supports.length; i++){
          supports_d.child(this.supports[i].get_small_p());
      }

    } else {
      supports_d.child(createP('this voter doesn\'t support anyone'));
    }

    returned.child(strategic_p);
    returned.child(voted_for_d);
    returned.child(supports_d);
    returned.child(this.get_honest_preference_div());
    return returned;
  }
}

function strategic_changed(){
  // For the starategic checkbox in the selected_div
  this.parent_voter.strategic = this.checked();
}

function delete_selected_voter(){
  this.parent_voter.remove();
  selected_div.child()[0].remove();
}
