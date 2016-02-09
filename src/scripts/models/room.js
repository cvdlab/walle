"use strict";

var Room = function (paper, vertices, color, angle) {

  this.paper = paper;
  this.events = new Events();

  this.vertices = vertices;

  let pattern = this.pattern = paper
    .rect(0, 0, 10, 3)
    .attr({
      fill: "none",
      stroke: color,
      strokeWidth: 5
    })
    .pattern(0, 0, 10, 10)
    .attr({
      patternUnits: "userSpaceOnUse",
      patternTransform: Snap.matrix().rotate(angle)
    });

  let pathString = Room.verticesToPath(vertices);

  this.path = paper.path(pathString)
    .attr({fill: pattern})
    .addClass('room');

  paper.select('#rooms').append(this.path);

  this.moveVertexHandler = (event) => {
    this.redraw();
  };

  vertices.forEach((vertex)=> {
    vertex.onMove(this.moveVertexHandler);
  });

};

Room.prototype.setId = function (id) {
  this.id = id;
  this.path.attr({id: id});
};

Room.prototype.remove = function () {
  this.path.remove();
};

Room.prototype.toJson = function () {
  return {
    type: "room",
    id: this.id,
    vertices: this.vertices.map((vertex)  => vertex.id)
  };
};

Room.prototype.redraw = function () {
  let pathString = Room.verticesToPath(this.vertices);
  this.path.attr({d: pathString});
};


Room.verticesToPath = function (vertices) {
  let path = "";
  let first = true;

  vertices.forEach(function (vertex) {
    let command = first ? 'M' : 'L';
    first = false;
    path += command + vertex.x + ' ' + vertex.y + ' ';
  });
  path += ' z';
  return path;
};

Room.isRoom = function (room) {
  return (room instanceof Room);
};

