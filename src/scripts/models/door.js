"use strict";

var Door = function (paper, wall, offset) {

  Hole.call(this, paper, wall, offset);

};

Door.prototype = Object.create(Hole.prototype);

Door.prototype.constructor = Door;

Door.prototype.redraw = function () {
  let paper = this.paper;
  let length = this.length;
  let group = this.group;

  if (this.groupSymbol) this.groupSymbol.remove();

  //"M0,20 C0,10 10,0 20,0 L20,20 L0,20 z"

  let line = this.line = paper.line(0, 0, length, 0)
    .attr({strokeWidth: 5, stroke: "#000"});

  let path = "M0,p C0,q q,0 p,0 Lp,p"
    .replace(/p/g, length)
    .replace(/q/g, (length / 2).toString());

  let figure = paper.path(path)
    .attr({strokeWidth: 1, stroke: "#000", fill: "none", "stroke-dasharray": "3, 1"})
    .transform(Snap.matrix().translate(0, -length));

  let groupSymbol = this.groupSymbol = paper.group(figure, line);

  group.add(groupSymbol);
};

Door.isDoor = function (door) {
  return (door instanceof Door);
};
