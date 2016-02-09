"use strict";

var SnapPoint = function (paper, x, y, targetElement, priority, radius) {
  this.paper = paper;
  this.x = x;
  this.y = y;
  this.targetElement = targetElement;
  this.priority = priority || 1;
  this.radius = radius;
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

SnapPoint.prototype.hover = function (on) {
  if (on) {
    if (this.overlay) return;
    let rect = this.paper.rect(0, 0, "100%", "100%").attr({fill: "white"});
    let circle = this.paper.circle(this.x, this.y, this.radius);
    let mask = this.paper.mask().append(rect).append(circle);

    let maskRect = this.paper
      .rect(0, 0, 99999, 99999)
      .addClass('snap-overlay')
      .attr({opacity: 0, mask: mask})
      .animate({opacity: 0.5}, 100);

    this.overlay = {
      rect, circle, mask, maskRect
    };
  } else {
    if (!this.overlay) return;
    this.overlay.rect.remove();
    this.overlay.circle.remove();
    this.overlay.mask.remove();
    this.overlay.maskRect.remove();
    this.overlay = null;

  }
};

SnapPoint.prototype.move = function (x, y) {
  this.x = x;
  this.y = y;
};

SnapPoint.prototype.remove = function () {};

SnapPoint.isSnapPoint = function (snapPoint) {
  return (snapPoint instanceof SnapPoint);
};
