"use strict";

var SnapLine = function (paper, x1, y1, x2, y2, targetElement, priority, radius) {

  this.paper = paper;
  this.x1 = x1;
  this.y1 = y1;
  this.x2 = x2;
  this.y2 = y2;
  this.targetElement = targetElement;
  this.priority = priority || 1;
  this.radius = radius;

  this.line = this.paper.line(this.x1, this.y1, this.x2, this.y2)
    .addClass('snap-element snap-line');
};

SnapLine.prototype.distanceFromPoint = function (xp, yp) {
  return Utils.linePointDistance(this.x1, this.y1, this.x2, this.y2, xp, yp)
};

SnapLine.prototype.targetPoint = function (xp, yp) {
  return Utils.nearestPointFromLine(this.x1, this.y1, this.x2, this.y2, xp, yp);
};

SnapLine.prototype.hover = function (on) {
  on ? this.line.addClass('hover') : this.line.removeClass('hover');
};

SnapLine.prototype.visible = function (on) {
  on ? this.line.addClass('visible') : this.line.removeClass('visible');
};

SnapLine.prototype.move = function (x1, y1, x2, y2) {
  this.x1 = x1;
  this.y1 = y1;
  this.x2 = x2;
  this.y2 = y2;
};

SnapLine.prototype.remove = function () {
  this.line.remove();
};

SnapLine.isSnapLine = function (snapLine) {
  return (snapLine instanceof SnapLine);
};
