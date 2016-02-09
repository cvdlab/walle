"use strict";

var Hole = function (paper, wall, offset, distanceFromFloor, inverted, opposite) {
  this.paper = paper;
  this.length = 30;
  this.height = 10;
  this.distanceFromFloor = distanceFromFloor || 0;
  this.inverted = inverted || false;
  this.opposite = opposite || false;

  this.group = paper.group().addClass('hole');
  paper.select('#holes').append(this.group);

  this.redraw();

  if (wall && offset) this.attach(wall, offset);
};

Hole.prototype.setId = function(id){
  this.id = id;
  this.group.attr({id: this.id});
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

  this.redrawHandler = () => {
    this.redraw();
  };

  wall.addAttachedElement(this);
  wall.onMove(this.moveHandler);
  wall.onRedraw(this.redrawHandler);

  this.updatePosition();
  this.redraw();
};

/**
 * detach from wall
 */
Hole.prototype.detach = function () {

  this.group.removeClass('attached');

  this.wall.removeAttachedElement(this);
  this.wall.offMove(this.moveHandler);
  this.wall.offRedraw(this.redrawHandler);
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

  let x1 = wall.vertices[0].x, y1 = wall.vertices[0].y, x2 = wall.vertices[1].x, y2 = wall.vertices[1].y;

  let angle = Utils.angleBetweenTwoPoints(x1, y1, x2, y2);

  this.groupSymbol.transform(Snap.matrix().translate(this.offset * wall.length, 0));

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

    let x1 = wall.vertices[0].x, y1 = wall.vertices[0].y, x2 = wall.vertices[1].x, y2 = wall.vertices[1].y;
    let point = Utils.nearestPointFromLine(x1, y1, x2, y2, x, y);
    let offsetLength = Utils.twoPointsDistance(x1, y1, point.x, point.y) - this.length / 2;

    if(offsetLength < 0) offsetLength = 0;
    if(offsetLength > wall.length - this.length) offsetLength = wall.length - this.length;

    this.offset = offsetLength / wall.length;

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

Hole.prototype.selected = function (isSelected) {
  if(isSelected)
    this.group.addClass('selected');
  else
    this.group.removeClass('selected');
};
