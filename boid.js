class Boid{
  constructor(){
    this.location = createVector(random(width),random(height));
    this.velocity = p5.Vector.random2D();
    this.velocity.setMag(random(2,5));
    this.acceleration = createVector();
    this.maxForce = 0.08;
    this.maxSpeed = 4 ;
    this.hue = random(220, 320);
    //this.hue =random(60,80);
		this.saturation = random(80, 100);
    //this.saturation = random(120,160);
    this.brightness = random(80, 100);
    //this.brightness = random(220,250);
    this.id = 'food';
  }
  edges(){
    if(this.location.x > width){
      this.location.x = 0;
    }else if(this.location.x < 0){
      this.location.x = width;
    }
    if(this.location.y > height){
      this.location.y = 0;
    }else if(this.location.y < 0){
      this.location.y = height;
    }
  }
  show(){
    strokeWeight(4);
    stroke(this.hue,this.saturation,this.brightness);
    line(this.location.x,this.location.y, this.location.x - 2*this.velocity.x,this.location.y - 2*this.velocity.y);
  }
  update(){
    this.velocity.add(this.acceleration);
    this.velocity.limit(this.maxSpeed);
    this.location.add(this.velocity);
    this.acceleration.mult(0);
  }
  applyForce(force){
    this.acceleration.add(force);
  }
  seek(target){
      let desired =  p5.Vector.sub(target, this.location);
      desired.normalize();
      desired.mult(this.maxSpeed);
      desired.sub(this.velocity);
      desired.limit(this.maxForce);
      return desired;
  }
  flock(localboids,a,c,s){
      let sep = this.separate(localboids);
      let ali = this.align(localboids);
      let coh = this.cohesion(localboids);
      let fle = this.flee(localboids);

      fle.mult(10);
      sep.mult(s);
      ali.mult(a);
      coh.mult(c);

      this.applyForce(fle);
      this.applyForce(ali);
      this.applyForce(coh);
      this.applyForce(sep);
  }
  separate(localboids){
    let separate = createVector();
    let total = 0;
    for(let boids of localboids){
      let other = boids.userData;
      if(other != this){
          let diff = p5.Vector.sub(this.location,other.location);
          diff.normalize();
          let d = diff.x*diff.x + diff.y*diff.y;
          diff.div(d);
          separate.add(diff);
          total++;
      }
    }
    if(total > 0){
      separate.div(total);
      separate.normalize();
      separate.mult(this.maxSpeed);
      separate.sub(this.velocity);
      separate.limit(this.maxForce);
    }
    return separate;
  }
  align(localboids){
    let alignment = createVector();
    let total = 0;
    for(let boids of localboids){
      let other = boids.userData;
      let v = abs(this.velocity.heading() - other.velocity.heading());
      if(other!= this && v < abs(radians(visionslider.value()))){
        alignment.add(other.velocity);
        total++;
      }
    }
    if(total > 0){
      alignment.div(total);
      alignment.normalize();
      alignment.mult(this.maxSpeed);
      alignment.sub(this.velocity);
      alignment.limit(this.maxForce);
      return alignment;
    } else {
      return createVector(0, 0);
    }

  }
  cohesion(localboids){
    let cohesion = createVector();
    let total = 0;
    for(let boids of localboids){
      let other = boids.userData;
      if(other!= this){
        cohesion.add(other.location);
        total++;
      }
    }
    if(total > 0){
      cohesion.div(total);
      return this.seek(cohesion);
    } else {
      return createVector(0, 0);
    }
  }
  flee(localboids){
    let flee = createVector();
    let total = 0;
    for(let boids of localboids){
      let other = boids.userData;
      if(other!= this && other.id == 'predator'){
        flee.add(other.location);
        total++
      }
    }
    if(total > 0){
      let des = this.seek(flee);
      des.mult(-1);
      return des;
    }else{
      return createVector(0,0);
    }
  }

}
class Predator extends Boid{
  constructor(){
    super();
    this.maxForce = 0.2;
    this.maxSpeed = 2;
    this.id = 'predator';
    this.hue = random(100,150);
    this.brightness = random(50,100);
    this.saturation = random(50,200);
  }
  show(){
    stroke(this.hue,this.saturation,this.brightness);
    //stroke('red');
    strokeWeight(8);
    line(this.location.x,this.location.y, this.location.x - 6*this.velocity.x,this.location.y - 6*this.velocity.y);
    strokeWeight(12);
    point(this.location.x,this.location.y);
  }
}
