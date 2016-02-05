"use strict";

var SnapLine = function (paper, x1, y1, x2, y2, targetElement, priority) {

  this.paper = paper;
  this.x1 = x1;
  this.y1 = y1;
  this.x2 = x2;
  this.y2 = y2;
  this.targetElement = targetElement;
  this.priority = priority || 1;

  this.paper.line(x1, y1, x2, y2).addClass('snap-element snap-line');
};

SnapLine.prototype.distanceFromPoint = function (xp, yp) {
  return Utils.linePointDistance(this.x1, this.y1, this.x2, this.y2, xp, yp)
};

SnapLine.prototype.targetPoint = function (xp, yp) {
  return Utils.intersectPoint(this.x1, this.y1, this.x2, this.y2, xp, yp);
};
