class Bird extends Boid{
  constructor(){
    super();
    this.maxForce = 0.1;
    this.maxSpeed = 5 ;
  }
  show(){
    let theta = this.velocity.heading() + PI/2;
    let r = 3;
    fill('white');
    noStroke();
    push();
    translate(this.location.x,this.location.y);
    rotate(theta);
    beginShape();
    vertex(0, -r*2);
    vertex(-r, r*2);
    vertex(r, r*2);
    endShape(CLOSE);
    pop();
  }
}
class BirdPred extends Bird{
  constructor(){
    super();
    this.maxForce = 0.2;
    this.maxSpeed = 3;
    this.id = 'predator';
  }
  show(){
    let theta = this.velocity.heading() + PI/2;
    let r = 5;
    fill('red');
    noStroke()
    push();
    translate(this.location.x,this.location.y);
    rotate(theta);
    beginShape();
    vertex(0, -r*2);
    vertex(-r, r*2);
    vertex(r, r*2);
    endShape(CLOSE);
    pop();
  }
}
