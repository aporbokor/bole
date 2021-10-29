class voter{
  constructor(x, y){
    this.x = x;
    this.y = y;
  }

  distance_to_candidate(candidate){
    let x_dist = this.x - candidate.x
    let y_dist = this.y - candidate.y
    return Math.sqrt(x_dist*x_dist + ydist*y_dist)
  }
}
