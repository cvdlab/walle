"use strict";


var Wall = function (paper, vertex0, vertex1, tickness) {

  this.paper = paper;
  this.events = new Events();
  this.vertices = [vertex0, vertex1];
  this.length = Utils.twoPointsDistance(vertex0.x, vertex0.y, vertex1.x, vertex1.y);
  this.attachedElements = new Set();
  this.tickness = tickness || 10;

  this.line = null;
  this.redraw();

  vertex0.addAttachedElement(this);
  vertex0.onMove((x, y)=> {
    this.redraw();
    this.updateDistanceLabel();
    this.events.dispatchEvent("move");
  });

  vertex1.addAttachedElement(this);
  vertex1.onMove((x, y)=> {
    this.redraw();
    this.updateDistanceLabel();
    this.events.dispatchEvent("move");
  });

  this.distanceText = this.paper.text(0, 0, "")
    .attr({y: -this.tickness + (this.tickness / 4)})
    .addClass('wall-distance');
  this.distanceGroup = this.paper.g(this.distanceText);
  this.updateDistanceLabel();

};

Wall.prototype.setId = function (id) {

  this.id = id;
  this.line.attr({id: this.id});

};

Wall.prototype.remove = function () {
  this.distanceText.remove();
  this.distanceGroup.remove();
  this.line.remove();
};

Wall.prototype.selected = function (isSelected) {
  if (isSelected)
    this.line.addClass('selected');
  else
    this.line.removeClass('selected');
};

Wall.prototype.toJson = function () {
  return {
    type: "wall",
    id: this.id,
    vertex0: this.vertices[0].id,
    vertex1: this.vertices[1].id,
    tickness: this.tickness
  };
};


Wall.prototype.updateDistanceLabel = function () {

  let x1 = this.vertices[0].x;
  let y1 = this.vertices[0].y;
  let x2 = this.vertices[1].x;
  let y2 = this.vertices[1].y;

  let group = this.distanceGroup;
  let text = this.distanceText;


  let distance = Utils.twoPointsDistance(x1, y1, x2, y2);
  let angle = Utils.angleBetweenTwoPoints(x1, y1, x2, y2);
  let westside = 180 < angle && angle < 360;

  this.length = distance;

  let matrix = Snap.matrix()
    .translate(x1, y1)
    .rotate(90, 0, 0)
    .rotate(-angle, 0, 0);

  let unit = 60;

  group.transform(matrix);
  text.attr({text: (distance / unit).toFixed(2) + "m"});

  if (westside) {
    text.attr({x: -distance / 2}); //align center
    text.transform(Snap.matrix().rotate(180));
  } else {
    text.attr({x: distance / 2}); //align center
    text.transform("");
  }


};

Wall.isWall = function (wall) {
  return (wall instanceof Wall);
};

Wall.prototype.updateVertex = function (vertexId, newVertex) {

  this.vertices[vertexId].removeAttachedElement(this);
  this.vertices[vertexId] = newVertex;
  this.vertices[vertexId].addAttachedElement(this);
  this.redraw();

  newVertex.onMove((x, y)=> {
    this.redraw();
    this.updateDistanceLabel();
    this.events.dispatchEvent("move");
  });

  this.updateDistanceLabel();
};

Wall.prototype.redraw = function () {
  let paper = this.paper;
  let vertex0 = this.vertices[0], vertex1 = this.vertices[1];
  let actualTickness = this.tickness / 2;
  let x1 = vertex0.x, y1 = vertex0.y, x2 = vertex1.x, y2 = vertex1.y;

  let xa, ya, xb, yb;

  xa = x1;
  ya = y1;
  xb = x2;
  yb = y2;

  let alpha = - (Math.atan2(xb - xa, yb - ya) + Math.PI / 2);
  let cosAlpha = Math.cos(alpha), sinAlpha = Math.sin(alpha);

  let delta_xr = actualTickness * sinAlpha;
  let delta_yr = actualTickness * -cosAlpha;

  let delta_xl = actualTickness * -sinAlpha;
  let delta_yl = actualTickness * cosAlpha;

  let xar = xa + delta_xr;
  let yar = ya + delta_yr;
  let xal = xa + delta_xl;
  let yal = ya + delta_yl;

  let xbr = xb + delta_xr;
  let ybr = yb + delta_yr;
  let xbl = xb + delta_xl;
  let ybl = yb + delta_yl;

  let pathStr = `M${xar} ${yar}L ${xbr} ${ybr}L ${xbl} ${ybl}L ${xal} ${yal}z`;

  if (!this.line) {
    this.line = paper.path(pathStr).addClass('wall');
  } else {
    this.line.attr({d: pathStr});
  }

  this.events.dispatchEvent('redraw');

};

Wall.prototype.distanceFromPoint = function (x, y) {
  return Utils.segmentPointDistance(this.vertices[0].x, this.vertices[0].y, this.vertices[1].x, this.vertices[1].y, x, y);
};

Wall.prototype.onMove = function (handler) {
  this.events.addEventListener('move', handler);
};

Wall.prototype.offMove = function (handler) {
  this.events.removeEventListener('move', handler);
};

Wall.prototype.onRedraw = function (handler) {
  this.events.addEventListener('redraw', handler);
};

Wall.prototype.offRedraw = function (handler) {
  this.events.removeEventListener('redraw', handler);
};

Wall.prototype.addAttachedElement = function (element) {
  this.attachedElements.add(element);
};

Wall.prototype.removeAttachedElement = function (element) {
  this.attachedElements.delete(element);
};

Wall.prototype.move = function (x, y) {

  let vertex0 = this.vertices[0], vertex1 = this.vertices[1];
  let ox1 = vertex0.x, oy1 = vertex0.y, ox2 = vertex1.x, oy2 = vertex1.y;

  let center = Utils.centerPoint(vertex0.x, vertex0.y, vertex1.x, vertex1.y);

  let translationVector = Utils.translationVector(ox1, oy1, ox2, oy2, x, y);
  let vx = translationVector.vx, vy = translationVector.vy;

  vertex0.move(ox1 + vx, oy1 + vy);
  vertex1.move(ox2 + vx, oy2 + vy);
};

Wall.prototype.split = function (x, y) {

  let paper = this.paper;
  let wall = this;
  let x1 = wall.vertices[0].x, y1 = wall.vertices[0].y, x2 = wall.vertices[1].x, y2 = wall.vertices[1].y;
  let point = Utils.nearestPointFromLine(x1, y1, x2, y2, x, y);

  let newVertex = new Vertex(paper, point.x, point.y);
  let newWall0 = new Wall(paper, wall.vertices[0], newVertex, wall.tickness);
  let newWall1 = new Wall(paper, newVertex, wall.vertices[1], wall.tickness);

  wall.remove();

  return {
    vertex: newVertex,
    wall0: newWall0,
    wall1: newWall1
  };

};

Wall.prototype.centerPoint = function () {
  let vertex0 = wall.wall.vertices[0], vertex1 = wall.wall.vertices[1];
  return Utils.centerPoint(vertex0.x, vertex0.y, vertex1.x, vertex1.y);
};
