"use strict";

var WallsDrawer = function (walle) {
  this.walle = walle;
  this.paper = walle.paper;

  this.drawingWall = null;
  this.walls = [];
};

/**
 * start
 */
WallsDrawer.prototype.start = function () {
  console.log("start walls mode");
  this.paper.click(this.beginDrawing, this);
};

/**
 * stop
 */
WallsDrawer.prototype.stop = function () {
  console.log("stop walls mode");
  if(this.drawingWall !== null) this.abortDrawing();
};

/**
 * beginDrawing
 * @param point
 */
WallsDrawer.prototype.beginDrawing = function (point) {
  console.log("begin drawing wall");

  let x = point.offsetX, y = point.offsetY;

  let line = this.paper.line(x, y, x, y);
  line.attr({strokeWidth: 4, stroke: "#445964"});

  let startCircle = this.paper.circle(x, y, 8);
  startCircle.attr({strokeWidth: 4, stroke: "#445964", fill: "#fff"});

  let endCircle = this.paper.circle(x, y, 8);
  endCircle.attr({strokeWidth: 4, stroke: "#445964", fill: "#fff"});

  this.drawingWall = {line, startCircle, endCircle};

  //register events
  this.paper.mousemove(this.updateDrawing, this);
  this.paper.click(this.endDrawing, this);
  this.paper.unclick(this.beginDrawing);
  this.walle.registerAbort(this.abortDrawing, this);
};

/**
 * abortDrawing
 */
WallsDrawer.prototype.abortDrawing = function () {
  console.log("abort drawing wall");

  this.drawingWall.line.remove();
  this.drawingWall.startCircle.remove();
  this.drawingWall.endCircle.remove();

  this.drawingWall = null;

  //register events
  this.paper.unmousemove(this.updateDrawing);
  this.paper.unclick(this.endDrawing);
  this.walle.unregisterAbort(this.abortDrawing);
  this.paper.click(this.beginDrawing, this);
};

/**
 * updateDrawing
 * @param point
 */
WallsDrawer.prototype.updateDrawing = function (point) {
  console.log("update drawing wall");

  let x = point.offsetX, y = point.offsetY;
  let line = this.drawingWall.line, endCircle = this.drawingWall.endCircle;

  line.attr({x2: x, y2: y});
  endCircle.attr({cx: x, cy: y});
};


/**
 * endDrawing
 * @param point
 */
WallsDrawer.prototype.endDrawing = function (point) {
  console.log("end drawing wall");
  let x = point.offsetX, y = point.offsetY;

  let wall = this.drawingWall;

  wall.line.attr({x2: x, y2: y});
  this.walls.push(wall);

  this.drawingWall = null;

  //register events
  this.paper.unmousemove(this.updateDrawing);
  this.paper.unclick(this.endDrawing);
  this.walle.unregisterAbort(this.abortDrawing);
  this.paper.click(this.beginDrawing, this);
};


