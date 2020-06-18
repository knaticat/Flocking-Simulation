//implemented using "The Coding Train" video on QuadTree
//Daniel Shiffman
class Point {
  constructor(x,y, user){
    this.x = x;
    this.y = y;
    this.userData = user;
  }
}
class Rectangle {
  constructor(x,y,w,h){
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
  }
  contains(point){
    return(
      point.x >= this.x - this.w &&
      point.x <= this.x + this.w &&
      point.y >= this.y - this.h &&
      point.y <= this.y + this.h
    );
  }
  intersects(range) {
    return !(
      range.x - range.w > this.x + this.w ||
      range.x + range.w < this.x - this.w ||
      range.y - range.h > this.y + this.h ||
      range.y + range.h < this.y - this.h
    );
  }
}
class Circle {
  constructor(x,y,r){
    this.x = x;
    this.y = y;
    this.r = r;
    this.rSq = this.r*this.r;
  }
  contains(point){
    let d = Math.pow(point.x - this.x,2) + Math.pow(point.y - this.y,2);
    return d <= this.rSq;
  }
  intersects(range){
    var xDist = Math.abs(range.x - this.x);
    var yDist = Math.abs(range.y - this.y);

    var r = this.r;

    var w = range.w;
    var h = range.h;

    var edges = Math.pow(xDist - w,2) + Math.pow(yDist - h,2);
    if (xDist > r + w || yDist > r + h) return false;
    if (xDist <= w || yDist <= h) return true;
    return edges <= this.rSq;
  }
}
class QuadTree {
  constructor(boundary, capacity){
    this.boundary = boundary;
    this.capacity = capacity;
    this.points = [];
    this.divided = false;
  }
  subdivide(){
    let x = this.boundary.x;
    let y = this.boundary.y;
    let w = this.boundary.w / 2;
    let h = this.boundary.h / 2;

    let ne = new Rectangle(x + w, y - h, w, h);
    this.northeast = new QuadTree(ne, this.capacity);
    let nw = new Rectangle(x - w, y - h, w, h);
    this.northwest = new QuadTree(nw, this.capacity);
    let se = new Rectangle(x + w, y + h, w, h);
    this.southeast = new QuadTree(se, this.capacity);
    let sw = new Rectangle(x - w, y + h, w, h);
    this.southwest = new QuadTree(sw, this.capacity);

    this.divided = true;
  }
  insert(point){
    if (!this.boundary.contains(point)) {
     return false;
    }
    if (this.points.length < this.capacity) {
      this.points.push(point);
      return true;
    }
    if (!this.divided) {
      this.subdivide();
    }
    if (
     this.northeast.insert(point) ||
     this.northwest.insert(point) ||
     this.southeast.insert(point) ||
     this.southwest.insert(point)
    ) {
      return true;
    }
  }
  query(range, found){
    if (!found) {
      found = [];
    }
    if (!range.intersects(this.boundary)) {
      return found;
    }
    for (let p of this.points) {
      if (range.contains(p)) {
        found.push(p);
      }
    }
    if (this.divided) {
      this.northwest.query(range, found);
      this.northeast.query(range, found);
      this.southwest.query(range, found);
      this.southeast.query(range, found);
    }
    return found;
  }
  // use for debugging
  display(){
    if(this.divided){
      this.northwest.display();
      this.northeast.display();
      this.southwest.display();
      this.southeast.display();
    }
    else{
      rectMode(CENTER);
      noFill();
      strokeWeight(0.5);
      stroke(255, 100);
      rect(this.boundary.x,this.boundary.y,this.boundary.w*2,this.boundary.h*2);
    }
  }
}
