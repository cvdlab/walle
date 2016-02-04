"use strict";

var Window = function (paper, wall, offset, distanceFromFloor, inverted, opposite) {

  Hole.call(this, paper, wall, offset, distanceFromFloor, inverted, opposite);

};

Window.prototype = Object.create(Hole.prototype);

Window.prototype.constructor = Window;

Window.prototype.redraw = function () {
  let paper = this.paper;
  let length = this.length;
  let group = this.group;
  let wall = this.wall;
  let tickness = wall ? wall.tickness : 4;
  let endLength = (tickness + 10) / 2;

  group.addClass('window');

  if (!this.groupSymbol) {
    let line = this.line = paper.line(0, 0, length, 0).attr({strokeWidth: tickness});

    let lineLeft = this.lineLeft = paper.line(0, - endLength, 0,  endLength);
    let lineRight = this.lineRight = paper.line(length, - endLength, length, endLength);
    let groupSymbol = this.groupSymbol = paper.group(line, lineLeft, lineRight);
    group.add(groupSymbol);
  } else {
    this.line.attr({x2: length, strokeWidth: tickness});
    this.lineLeft.attr({y1: - endLength, y2: endLength});
    this.lineRight.attr({x1: length, y1: - endLength, x2: length, y2: endLength});
  }
};


Window.prototype.toJson = function () {
  return {
    type: "window",
    wall: this.wall.id,
    offset: this.offset,
    distanceFromFloor: this.distanceFromFloor,
    inverted: this.inverted,
    opposite: this.opposite
  };
};


Window.isWindow = function (window) {
  return (window instanceof Window);
};
