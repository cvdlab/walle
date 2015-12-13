"use strict";

var Edge = function (paper, x, y) {

  this.colors = {
    strokeNormal: "#8E9BA2",
    strokeSelected: "#445964",
    fillNormal: "#fff",
    fillSelected: "#00e5ff"
  };

  this.paper = paper;
  this.x = x;
  this.y = y;

  this.walls = [];

  this.emitter = new EventEmitter2();

  let circle = paper.circle(x, y, 8);
  circle.attr({strokeWidth: 4, stroke: this.colors.strokeNormal, fill: this.colors.fillNormal});
  this.circle = circle;

};

Edge.prototype.move = function (x, y) {
  this.x = x;
  this.y = y;
  this.circle.attr({cx: x, cy: y});
  this.emitter.emit("move", x, y);
};

Edge.prototype.selected = function (isSelected) {
  this.circle.attr({stroke: isSelected ? this.colors.strokeSelected : this.colors.strokeNormal});
};

Edge.prototype.hovered = function (isHovered) {
  this.circle.attr({fill: isHovered ? this.colors.fillSelected : this.colors.fillNormal});
};

Edge.prototype.redraw = function () {
  let attr = this.circle.attr();
  this.circle.remove();

  let circle = this.paper.circle();
  circle.attr(attr);
  this.circle = circle;
};

Edge.prototype.remove = function () {
  this.circle.remove();
};

