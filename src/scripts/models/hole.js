"use strict";

var Hole = function (paper, wall, offset) {
  this.paper = paper;
  this.length = 30;

  this.group = paper.group().addClass('hole');


  this.redraw();

  if (wall && offset) this.attach(wall, offset);
};

/**
 * attach to a wall
 * @param wall
 * @param offset
 */
Hole.prototype.attach = function (wall, offset) {
  this.wall = wall;
  this.offset = offset;

  this.group.addClass('attached');

  this.moveHandler = () => {
    this.updatePosition();
  };

  wall.addAttachedElement(this);
  wall.onMove(this.moveHandler);

  this.updatePosition();
};

/**
 * detach from wall
 */
Hole.prototype.detach = function () {

  this.group.removeClass('attached');

  this.wall.removeAttachedElement(this);
  this.wall.offMove(this.moveHandler);
  this.offset = null;
  this.wall = null;
  this.groupSymbol.transform(Snap.matrix().translate(0, 0));

};

/**
 * update position
 */
Hole.prototype.updatePosition = function () {

  let wall = this.wall;

  if (!wall) throw new Error("hole is not attached");

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
Hole.prototype.move = function (x, y) {

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
Hole.prototype.remove = function () {
  this.group.remove();
};

Hole.prototype.toJson = function () {
  return {
    type: "hole",
    wall: this.wall.toJson(),
    offset: this.offset
  };
};


Hole.isHole = function(hole){
  return (hole instanceof Hole);
};

Hole.prototype.redraw = function () {

};

