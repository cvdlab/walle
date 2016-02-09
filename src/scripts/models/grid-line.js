"use strict";


var GridLine = function (paper, direction, position) {
  this.paper = paper;
  this.direction = direction;
  this.position = position;
};

GridLine.prototype.setId = function (id) {
  this.id = id;
};

GridLine.prototype.toJson = function () {
  return {
    type: "grid-line",
    id: this.id,
    direction: this.direction,
    position: this.position
  };
};

GridLine.prototype.isVertical = function () {
  return this.direction.charAt(0) === 'v';
};

GridLine.prototype.isHorizontal = function () {
  return this.direction.charAt(0) === 'h';
};

GridLine.isGridLine = function (gridLine) {
  return (gridLine instanceof GridLine);
};

GridLine.prototype.distanceFromPoint = function (x, y) {
  let position = this.position;
  if (this.isVertical()) return Math.abs(position - x);
  if (this.isHorizontal()) return Math.abs(position - y);

  return Math.POSITIVE_INFINITY;
};
