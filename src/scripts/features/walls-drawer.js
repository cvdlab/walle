"use strict";

var WallsDrawer = function (walle) {
  this.walle = walle;
  this.paper = walle.paper;

  this.drawingWall = null;

  walle.model.walls = walle.model.walls || [];
  walle.model.edges = walle.model.edges || [];

  this.walls = walle.model.walls;
  this.edges = walle.model.edges;
};


/**
 * start
 */
WallsDrawer.prototype.start = function () {
  console.log("start walls mode");

  //add a point everywhere
  this.paper.addListener("click.wallsdrawer.begin", event => {
    this.beginDrawingWithPoint(event.offsetX, event.offsetY);
  });

  //add a point using snap points
  this.walle.snapTo.add({
    click: (event, x, y) => {
      this.beginDrawingWithPoint(x, y);
      event.stopPropagation();
    }
  });
};


/**
 * restart
 */
WallsDrawer.prototype.restart = function () {
  console.log("restart walls mode");

  //clear drawing area
  this.walle.snapTo.remove();
  this.walle.changeCursor("auto");

  //unregister events
  this.paper.removeAllListeners("mousemove.wallsdrawer.update");
  this.paper.removeAllListeners("click.wallsdrawer.end");
  this.walle.emitter.removeAllListeners("abort.wallsdrawer");

  this.drawingWall = null;

  //start
  this.start();
};


/**
 * stop
 */
WallsDrawer.prototype.stop = function () {
  console.log("stop walls mode");

  //abort if needed
  if (this.drawingWall !== null) this.abortDrawing();

  //add a point everywhere
  this.paper.removeAllListeners("click.wallsdrawer.**");
  this.walle.snapTo.remove();
};


/**
 * beginDrawingWithPoint
 * @param x
 * @param y
 */
WallsDrawer.prototype.beginDrawingWithPoint = function (x, y) {
  console.log("begin drawing wall", x, y);

  //draw wall and edge
  let edge0 = new Edge(this.paper, x, y);
  let edge1 = new Edge(this.paper, x, y);
  let wall = new Wall(this.paper, edge0, edge1);
  edge0.redraw();
  edge1.redraw();

  edge0.selected(true);
  edge1.selected(true);
  wall.selected(true);

  this.drawingWall = wall;

  //change mouse mode
  this.walle.changeCursor("crosshair");

  //(un)register events
  this.paper.addListener("mousemove.wallsdrawer.update", event => {
    this.updateDrawingWithPoint(event.offsetX, event.offsetY);
  });
  this.paper.addListener("click.wallsdrawer.end", event => {
    this.endDrawingWithPoint(event.offsetX, event.offsetY, event.shiftKey);
  });
  this.paper.removeAllListeners("click.wallsdrawer.begin");
  this.walle.emitter.addListener("abort.wallsdrawer", event => {
    this.abortDrawing();
  });

  //use snap mode
  this.walle.snapTo.remove();

  this.walle.snapTo.add({
    click: (event, x, y) => {
      edge1.selected(false);
      this.endDrawingWithPoint(x, y, event.shiftKey);
      event.stopPropagation();
    },
    mousemove: (event, x, y) => {
      this.updateDrawingWithPoint(x, y);
      event.stopPropagation();
    }
  });

};

/**
 * abortDrawing
 */
WallsDrawer.prototype.abortDrawing = function () {
  console.log("abort drawing wall");

  //abort
  this.drawingWall.edges[0].remove();
  this.drawingWall.edges[1].remove();
  this.drawingWall.remove();

  this.drawingWall = null;

  this.restart();
};

/**
 * updateDrawingWithPoint
 * @param x
 * @param y
 */
WallsDrawer.prototype.updateDrawingWithPoint = function (x, y) {
  //console.log("update drawing wall", x, y);

  //move wall endpoint
  this.drawingWall.edges[1].move(x, y);
};

/**
 * endDrawingWithPoint
 * @param x
 * @param y
 * @param startNew
 */
WallsDrawer.prototype.endDrawingWithPoint = function (x, y, startNew) {
  console.log("end drawing wall", x, y);

  let wall = this.drawingWall;
  if (wall.edges[0].x === x && wall.edges[0].y === y)return;

  wall.edges[1].move(x, y);

  wall.edges[0].selected(false);
  wall.edges[1].selected(false);
  wall.selected(false);

  this.walls.push(wall);
  this.edges.push(wall.edges[0]);
  this.edges.push(wall.edges[1]);

  //restart
  this.restart();
  if (startNew) this.beginDrawingWithPoint(x, y);

};
