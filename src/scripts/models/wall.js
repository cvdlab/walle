"use strict";


var Wall = function (paper, edge0, edge1) {

  this.colors = {
    strokeNormal: "#8E9BA2",
    strokeSelected: "#445964"
  };

  this.paper = paper;
  this.edges = [edge0, edge1];

  let line = paper.line(edge0.x, edge0.y, edge1.x, edge1.y);
  line.attr({strokeWidth: 4, stroke: this.colors.strokeNormal});
  this.line = line;

  edge0.emitter.addListener("move", (x, y)=> {
    line.attr({x1: x, y1: y});
  });

  edge1.emitter.addListener("move", (x, y)=> {
    line.attr({x2: x, y2: y});
  });
};


Wall.prototype.remove = function () {
  this.line.remove();
};

Wall.prototype.selected = function (isSelected) {
  this.line.attr({stroke: isSelected ? this.colors.strokeSelected : this.colors.strokeNormal});
};
