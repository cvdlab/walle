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


/**
 * stop
 */
EasterEgg.prototype.stop = function () {

  this.bigCircle.remove();

};
