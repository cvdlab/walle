"use strict";

var Ruler = function (walle) {
  this.walle = walle;
  this.paper = walle.paper;


};


/**
 * start
 */
Ruler.prototype.start = function () {

  let paper = this.paper;
  let walle = this.walle;

  let hPattern = paper.path('M0,0 L0,10, M5,5 L5,10, M0,10 L10,10')
    .attr({
      fill: "none",
      stroke: '#aaa',
      strokeWidth: 1
    })
    .pattern(0, 0, 10, 10);

  let vPattern = hPattern
    .clone()
    .attr({
      patternUnits: "userSpaceOnUse",
      patternTransform: Snap.matrix().rotate(-90)
    });

  let horizontalRuler = paper.rect(10, 0, walle.width, 10)
    .attr({fill: hPattern})
    .addClass('ruler horizontal');

  let verticalRuler = paper.rect(0, 10, 10, walle.height)
    .attr({fill: vPattern})
    .addClass('ruler horizontal');


  horizontalRuler.click(event=> {
    this.addCustomGridLine('v', event.offsetX);
    event.stopPropagation();
  });

  verticalRuler.click(event=> {
    this.addCustomGridLine('h', event.offsetY);
    event.stopPropagation();
  });
};

Ruler.prototype.addCustomGridLine = function (direction, position) {
  let walle = this.walle;

  let scene = walle.scene;
  let snapLayer = scene.snapLayer;
  let paper = walle.paper;

  let gridLine = new GridLine(paper, direction, position);
  snapLayer.addTargetElements([gridLine]);
  scene.addElement(gridLine);
};


/**
 * stop
 */
Ruler.prototype.stop = function () {

};
