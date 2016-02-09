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
  let scene = walle.scene;

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

  paper.select('#rulers').append(horizontalRuler).append(verticalRuler);

  let findNearGridLine = (direction, position) => {
    let gridLines = scene.getElements('grid-line');
    for (let i = gridLines.length - 1; i >= 0; i--) {
      let gridLine = gridLines[i];
      if (gridLine.direction === direction && Math.abs(gridLine.position - position) < 5)
        return gridLine;
    }
    return null;
  };

  let handler = (direction) => {
    return event=> {
      let position = direction === 'h' ? event.offsetY : event.offsetX;
      let nearGridLine = findNearGridLine(direction, position);
      if (nearGridLine)
        this.removeCustomGridLine(nearGridLine);
      else
        this.addCustomGridLine(direction, position);

      event.stopPropagation();
    };
  };

  horizontalRuler.click(handler('v'));
  verticalRuler.click(handler('h'));
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

Ruler.prototype.removeCustomGridLine = function (gridLine) {
  this.walle.scene.removeElement(gridLine);
};

/**
 * stop
 */
Ruler.prototype.stop = function () {

};
