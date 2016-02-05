"use strict";

var SnapPoint = function (paper, x, y, targetElement) {

  this.paper = paper;
  this.x = x;
  this.y = y;
  this.targetElement = targetElement;
  this.priority = 2;

  this.paper.circle(x, y, 10).addClass('snap-element snap-point');
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
