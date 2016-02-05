"use strict";

var SnapPoint = function (paper, x, y, targetElement, priority) {
  this.paper = paper;
  this.x = x;
  this.y = y;
  this.targetElement = targetElement;
  this.priority = priority || 1;

  this.paper.circle(x, y, 5).addClass('snap-element snap-point');
};

SnapPoint.prototype.distanceFromPoint = function (xp, yp) {
  return Utils.twoPointsDistance(this.x, this.y, xp, yp);
};

SnapPoint.prototype.targetPoint = function (xp, yp) {
  return {
    x: this.x,
    y: this.y
  };
};
