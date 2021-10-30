class Candidate{
  constructor(x, y, name){
    this.x = x;
    this.y = y;
    this.name = name;
    this.votes = undefined;
  }
  show(){
    fill(this.name);
    circle(this.x, this.y, candidate_size);
  }
}
