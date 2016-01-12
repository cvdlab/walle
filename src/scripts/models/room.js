"use strict";

var Room = function (paper, walls) {

  this.paper = paper;
  this.events = new Events();

  this.walls = walls;

  let pathString = Room.edgesToPath(walls.map(function(wall){
    return wall.edges[0];
  }));

  let color = Utils.randomColor(50, Utils.randomIntInclusive(0, 50));
  this.path = paper.path(pathString).attr({fill: color, opacity: 0.3});

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

