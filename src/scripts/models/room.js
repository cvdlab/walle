"use strict";

var Room = function (paper, edges, color) {

  this.paper = paper;
  this.events = new Events();

  this.walls = edges;

  let pathString = Room.edgesToPath(edges);

  this.path = paper.path(pathString)
    .attr({fill: color})
    .addClass('room');
  paper.prepend(this.path);
};

Room.prototype.remove = function(){
  this.path.remove();
};

Room.prototype.toJson = function(){
  return {
    type: "room",
    walls: this.walls.map(function(wall){return wall.toJson()})
  };
};

Room.edgesToPath = function (edges) {
  let path = "";
  let first = true;

  edges.forEach(function (edge) {
    let command = first ? 'M' : 'L';
    first = false;
    path += command + edge.x + ' ' + edge.y + ' ';
  });
  path += ' z';
  return path;
};

Room.isRoom = function (room) {
  return (room instanceof Room);
};

