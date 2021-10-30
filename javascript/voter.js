class Voter{
  constructor(x, y, strategic){
    this.x = x;
    this.y = y;
    this.staregic = strategic;
    this.voted_for = undefined;
  }

  distance_to_candidate(candidate){
    let x_dist = this.x - candidate.x;
    let y_dist = this.y - candidate.y;
    return Math.sqrt(x_dist*x_dist + y_dist*y_dist);
  }

  show(){
    fill(voter_color);
    circle(this.x, this.y, voter_size);
  }
}
