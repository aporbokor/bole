class Person{
  constructor(){
    if (this.constructor == Person){
      throw new Error("Abstract baseclass can't be initialized");
    }
    this.to_delete = false;
  }

  show(){
    throw new Error("You must implement a show method to your Person class");
  }

  get_div(){
    throw new Error("You must implement a get_div method to your Person class");
  }

  remove_self(){
    throw new Error("You must implement a remove_self method to your Person class");
  }

  remove(){
    this.to_delete = true;
  }

  grow_to_size(){
    let dif = Math.abs(this.size - this.target_size);

    if (dif <= grow_speed){
      this.size = this.target_size;

    } else if (this.size < this.target_size){
      this.size += grow_speed;

    } else {
      this.size -= grow_speed;
    }
    if (this.to_delete){
      this.target_size = 0;
      if (this.size == 0){
        this.remove_self()
      }
      return;
    }
    this.target_size = this.default_size;
  }

  grow_by(value){
    if (! this.to_delete){
      this.target_size += value;
    }
  }
}
