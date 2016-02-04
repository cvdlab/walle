"use strict";

var Door = function (paper, wall, offset, distanceFromFloor, inverted, opposite) {

  Hole.call(this, paper, wall, offset, distanceFromFloor, inverted, opposite);

};

Door.prototype = Object.create(Hole.prototype);

Door.prototype.constructor = Door;

Door.prototype.redraw = function () {
  let paper = this.paper;
  let length = this.length;
  let group = this.group;
  let wall = this.wall;
  let tickness = wall ? wall.tickness : 4;

  group.addClass('door');

  //"M0,20 C0,10 10,0 20,0 L20,20 L0,20 z"
  let path = "M0,p C0,q q,0 p,0 Lp,p"
    .replace(/p/g, length.toString())
    .replace(/q/g, (length / 2).toString());

  let matrix = Snap.matrix();
  if (this.inverted) matrix.scale(1, -1);
  if (this.opposite)
    matrix.scale(-1, 1).translate(-length, -length);
  else
    matrix.translate(0, -length);

  matrix.translate(0, -tickness / 2);

  if (!this.groupSymbol) {

    let line = this.line = paper.line(0, 0, length, 0).attr({strokeWidth: tickness});

    let figure = this.figure = paper.path(path).transform(matrix);

    let groupSymbol = this.groupSymbol = paper.group(figure, line);
    group.add(groupSymbol);

  } else {

    this.figure.attr({d: path});
    this.figure.transform(matrix);
    this.line.attr({strokeWidth: tickness, x2: length});

  }
};


Door.prototype.toJson = function () {
  return {
    type: "door",
    wall: this.wall.id,
    offset: this.offset,
    distanceFromFloor: this.distanceFromFloor,
    inverted: this.inverted,
    opposite: this.opposite
  };
};


Door.isDoor = function (door) {
  return (door instanceof Door);
};
