let flock = [];
let pred = [];
let trail = 0.15;
let perception_radius;
let visionslider;
let bird_on = true;
let fish_on = false;
let boundary;
function mouseClicked(){
  if(bird_on == true){
    let bird = new Bird();
    bird.location.x = mouseX;
    bird.location.y = mouseY;
    flock.push(bird);
  }else if(fish_on == true){
    let ball = new Boid();
    ball.location.x = mouseX;
    ball.location.y = mouseY;
    flock.push(ball);
  }
}
function windowResized(){
  resizeCanvas(windowWidth-50, windowHeight-50);
}
function setup(){
  colorMode(HSB,360,100,100,1);
  canv = createCanvas(windowWidth-50,windowHeight-50);
  canv.parent("canvas");
  for(var i = 0; i < 300; i++){
        flock.push(new Bird());
    }
  for(var j = 0; j< 3; j++){
        pred.push(new BirdPred());
    }
  boundary = new Rectangle(width/2,height/2,width,height);
  visionslider = createSlider(1,360,360,1);
  visionslider.parent('visionpar');
  alignslider = createSlider(0,2,1,0.1);
  alignslider.parent('alignpar');
  alignslider.style('width', '100px');
  cohesionslider = createSlider(0,2,1,0.1);
  cohesionslider.parent('cohesionpar');
  cohesionslider.style('width', '100px');
  separationslider = createSlider(0,2,1,0.1);
  separationslider.parent('separationpar');
  separationslider.style('width', '100px');
  flockmateslider = createSlider(20,60,50,10);
  flockmateslider.parent('flockrad');
  flockmateslider.style('width', '100px');
  buttonbird = createButton("Bird");
  buttonbird.parent("birdpar");
  buttonfish = createButton("Fish");
  buttonfish.parent("fishpar");

}
function resetSketchBird(){
  bird_on = true;
  fish_on = false;
  flock = [];
  pred = [];
  for(var i = 0; i < 300; i++){
        flock.push(new Bird());
    }
  for(var j = 0; j< 3; j++){
        pred.push(new BirdPred());
    }
}
function resetSketchFish(){
  fish_on = true;
  bird_on = false;
  flock = [];
  pred = [];
  for(var i = 0; i < 300; i++){
        flock.push(new Boid());
    }
  for(var j = 0; j < 3; j++){
        pred.push(new Predator());
    }
}
function draw(){
  if(bird_on == true){
    background(0);
  }else{
      background(0,trail);
  }
  document.getElementById("vi_val").innerHTML = visionslider.value();
  document.getElementById("ali_val").innerHTML = alignslider.value();
  document.getElementById("coh_val").innerHTML = cohesionslider.value();
  document.getElementById("sep_val").innerHTML = separationslider.value();
  document.getElementById("flock_val").innerHTML = flockmateslider.value();
    perception_radius = flockmateslider.value();
    let qtree = new QuadTree(boundary, 10);
    for(let boid of flock){
      let p = new Point(boid.location.x,boid.location.y,boid);
      qtree.insert(p);
    }
    for(let preds of pred){
      let q = new Point(preds.location.x, preds.location.y, preds);
      qtree.insert(q);
    }

    for(let boid of flock){
      let range = new Circle(boid.location.x,boid.location.y,perception_radius);
      let localboids = qtree.query(range);
      boid.flock(localboids,alignslider.value(),cohesionslider.value(),separationslider.value());
      boid.edges();
      boid.update();
      boid.show();
    }
    for(let preds of pred){
      preds.edges();
      preds.update();
      preds.show();
    }
    buttonbird.mousePressed(resetSketchBird);
    buttonfish.mousePressed(resetSketchFish);
    //console.log(frameRate());
}
