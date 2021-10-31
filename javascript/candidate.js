class Candidate{
  constructor(x, y, color, name){
    this.x = x;
    this.y = y;
    this.name = name;
    this.color = color;
    this.votes = undefined;
  }
  show(){
    fill(this.color);
    circle(this.x, this.y, candidate_size);
  }

  get_p(){
    let vote_ = 'unedfined';
    if (typeof this.votes === 'number'){
      vote_ = this.votes;
    } else if (Array.isArray(this.votes)){
      vote_ = this.votes.toString();
    }
    let returned = createP(this.name + '|votes:' + vote_);
    returned.style('color', this.color);
    return returned;
  }
}
