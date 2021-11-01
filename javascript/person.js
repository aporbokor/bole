class Person{
  constructor(){
    if (this.constructor == Person){
      throw new Error("Abstract baseclass can't be initialized");
    }
  }

  show(){
    throw new Error("You must implement a show method to your Person class");
  }

  get_div(){
    throw new Error("You must implement a get_div method to your Person class");
  }

  grow_to_size(){
    let dif = Math.abs(this.size - this.target_size);

    if (dif <= grow_speed){
      this.size = this.target_size;
      return;

    }
    if (this.size < this.target_size){
      this.size += grow_speed;
      return;
    }
    this.size -= grow_speed;
  }
}
