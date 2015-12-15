"use strict";

var EasterEgg = function (walle) {
  this.walle = walle;
  this.paper = walle.paper;

  this.bigCircle = null;

};


/**
 * start
 */
EasterEgg.prototype.start = function () {

  //this._startCircle();
  this._startClock();

};


/**
 * stop
 */
EasterEgg.prototype.stop = function () {

  //this.bigCircle.remove();
  this.clock.remove();

};



EasterEgg.prototype._startCircle = function () {

  let bigCircle = this.paper.circle(150, 150, 100);
  bigCircle.attr({
    fill: "#bada55",
    stroke: "#000",
    strokeWidth: 5
  });

  this.paper.click(function (d) {
    bigCircle.animate({
      cx: d.x,
      cy: d.y,
      r: (Math.random() * 100) + 50
    }, 1000, mina.bounce);
  });
  this.bigCircle = bigCircle;

};


EasterEgg.prototype._startClock = function () {
  let snap = this.walle.snap;

  let arrowAlfa = 5 / 4 * Math.PI;

  //linea
  let linea = this.paper.line(0, 0, 40, 0);
  linea.attr({stroke: "black", strokeWidth: 2});


  //punta freccia 1
  let m1 = Snap.matrix(1, 0, 0, 1, 40, 0); //sposta origine
  m1.add(Snap.matrix(Math.cos(arrowAlfa), Math.sin(arrowAlfa), -1 * Math.sin(arrowAlfa), Math.cos(arrowAlfa), 0, 0)); //cambia angolo

  let puntaFreccia1 = this.paper.line(0, 0, 10, 0).attr({stroke: "black", strokeWidth: 2});
  puntaFreccia1.transform(m1);


  //punta freccia 2
  let m2 = Snap.matrix(1, 0, 0, 1, 40, 0); //sposta origine
  m2.add(Snap.matrix(1, 0, 0, -1, 0, 0)); //ribalta
  m2.add(Snap.matrix(Math.cos(arrowAlfa), Math.sin(arrowAlfa), -1 * Math.sin(arrowAlfa), Math.cos(arrowAlfa), 0, 0)); //cambia angolo

  let puntaFreccia2 = this.paper.line(0, 0, 10, 0).attr({stroke: "black", strokeWidth: 2});
  puntaFreccia2.transform(m2);


  //crea gruppo
  let group = this.paper.group(
    linea,
    puntaFreccia1,
    puntaFreccia2
  );

  let gm = Snap.matrix(1, 0, 0, 1, 160, 160); //trasla
  gm.add(Snap.matrix(2, 0, 0, 2, 0, 0));  //scala
  let alfaInit = 3/2 * Math.PI;
  gm.add(Snap.matrix(Math.cos(alfaInit), Math.sin(alfaInit), -1 * Math.sin(alfaInit), Math.cos(alfaInit), 0, 0));
  group.transform(gm);

  let deltaAlfa = 1/20 * Math.PI;
  let deltaMatrix = Snap.matrix(Math.cos(deltaAlfa), Math.sin(deltaAlfa), -1 * Math.sin(deltaAlfa), Math.cos(deltaAlfa), 0, 0);


  setInterval(function(){
    gm.add(deltaMatrix);
    group.transform(gm);
  }, 1000);

  this.clock = group;

};
