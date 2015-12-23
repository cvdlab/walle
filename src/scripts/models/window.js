"use strict";

var Window = function (paper, wall, offset) {
  this.paper = paper;
  this.length = 30;

  this.opacityLevel = {
    attached: 0.9,
    detached: 0.6
  };

  let line = this.line = paper.line(0, 0, this.length, 0)
    .attr({strokeWidth: 5, stroke: "#000"});

  let lineLeft = this.lineLeft = paper.line(0, -6, 0, 6)
    .attr({strokeWidth: 1, stroke: "#000"});

  let lineRight = this.lineLeft = paper.line(this.length, -6, this.length, 6)
    .attr({strokeWidth: 1, stroke: "#000"});

  let groupSymbol = this.groupSymbol = paper.group(line, lineLeft, lineRight)

  this.group = paper.group(groupSymbol)
    .attr({opacity: this.opacityLevel.detached});

  if (wall && offset) this.attach(wall, offset);
};

/**
 * attach to a wall
 * @param wall
 * @param offset
 */
Window.prototype.attach = function (wall, offset) {
  this.wall = wall;
  this.offset = offset;

  this.group.attr({opacity: this.opacityLevel.attached});

  this.moveHandler = () => {
    this.updatePosition();
  };

  wall.onMove(this.moveHandler);
  this.updatePosition();
};

/**
 * detach from wall
 */
Window.prototype.detach = function () {

  this.group.attr({opacity: this.opacityLevel.detached});

  this.wall.offMove(this.moveHandler);
  this.offset = null;
  this.wall = null;
  this.groupSymbol.transform(Snap.matrix().translate(0, 0));

};

/**
 * update position
 */
Window.prototype.updatePosition = function () {

  let wall = this.wall;

  if (!wall) throw new Error("window is not attached");

  let x1 = wall.edges[0].x, y1 = wall.edges[0].y, x2 = wall.edges[1].x, y2 = wall.edges[1].y;

  let angle = Utils.angleBetweenTwoPoints(x1, y1, x2, y2);

  if(this.offset > wall.length - this.length) this.offset = wall.length - this.length;
  this.groupSymbol.transform(Snap.matrix().translate(this.offset, 0));

  let matrix = Snap.matrix()
    .translate(x1, y1)
    .rotate((90 - angle), 0, 0);

  this.group.transform(matrix);

};

/**
 * move
 */
Window.prototype.move = function (x, y) {

  let wall = this.wall;

  if (wall) {

    let x1 = wall.edges[0].x, y1 = wall.edges[0].y, x2 = wall.edges[1].x, y2 = wall.edges[1].y;
    let point = Utils.intersectPoint(x1, y1, x2, y2, x, y);
    let offset = Utils.twoPointsDistance(x1, y1, point.x, point.y) - this.length / 2;

    if(offset < 0) offset = 0;
    if(offset > wall.length - this.length) offset = wall.length - this.length;

    this.offset = offset;
    this.updatePosition();

  } else {

    let matrix = Snap.matrix()
      .translate(x - this.length / 2, y);

    this.group.transform(matrix);
  }

};

/**
 * remove
 */
Window.prototype.remove = function () {
  this.group.remove();
};
