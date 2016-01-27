"use strict";

var Edge = function (paper, x, y) {

  this.paper = paper;
  this.x = x;
  this.y = y;

  this.attachedElements = new Set();

  this.events = new Events();

  let circle = this.circle = paper.circle(x, y, 8).addClass('edge');

};

Edge.prototype.move = function (x, y) {
  this.x = x;
  this.y = y;
  this.circle.attr({cx: x, cy: y});
  this.events.dispatchEvent("move", x, y);
};

Edge.prototype.selected = function (isSelected) {
  if(isSelected)
    this.circle.addClass('selected');
  else
    this.circle.removeClass('selected');
};

Edge.prototype.hovered = function (isHovered) {
  if(isHovered)
    this.circle.addClass('hover');
  else
    this.circle.removeClass('hover');
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

Edge.prototype.toString = Edge.prototype.toJson = function () {
  return {
    type: "edge",
    x: this.x,
    y: this.y
  };
};

Edge.prototype.merge = function(edge){
  //add edge listener to this
};

Edge.prototype.drag = function(onStart, onMove, onEnd){
  this.circle.drag(onMove, onStart, onEnd);
};

Edge.prototype.undrag = function(){
  this.circle.undrag();
};

Edge.prototype.onMove = function(handler){
  this.events.addEventListener('move', handler);
};

Edge.prototype.offMove = function(handler){
  this.events.removeEventListener('move', handler);
};

Edge.prototype.distanceFromPoint = function(x, y){
  return Utils.twoPointsDistance(this.x, this.y, x, y);
};

Edge.isEdge = function(edge){
  return (edge instanceof Edge);
};

Edge.prototype.addAttachedElement = function(element){
  this.attachedElements.add(element);
};

Edge.prototype.removeAttachedElement = function(element){
  this.attachedElements.delete(element);
};
