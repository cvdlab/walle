"use strict";

var Window = function (paper, wall, offset) {

  Hole.call(this, paper, wall, offset);

};

Window.prototype = Object.create(Hole.prototype);

Window.prototype.constructor = Window;

Window.prototype.redraw = function(){
  let paper = this.paper;
  let length = this.length;
  let group = this.group;

  group.addClass('window');

  if(!this.groupSymbol) {
    let line = this.line = paper.line(0, 0, length, 0).attr({strokeWidth: 5});

    let lineLeft = this.lineLeft = paper.line(0, -6, 0, 6);
    let lineRight = this.lineRight = paper.line(length, -6, length, 6);
    let groupSymbol = this.groupSymbol = paper.group(line, lineLeft, lineRight);
    group.add(groupSymbol);
  }else{
    this.line.attr({x2: length});
    this.lineRight.attr({x1: length, x2: length});
  }
};


Window.prototype.toJson = function () {
  return {
    type: "window",
    wall: this.wall.toJson(),
    offset: this.offset
  };
};


Window.isWindow = function (window) {
  return (window instanceof Window);
};
