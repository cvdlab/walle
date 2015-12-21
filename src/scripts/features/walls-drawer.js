"use strict";

var WallsDrawer = function (walle) {
  this.walle = walle;
  this.paper = walle.paper;

  this.drawingWall = null;

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
    click: (event, x, y, anchorPoint) => {
      if (Edge.isEdge(anchorPoint) && anchorPoint.x === x && anchorPoint.y === y) {
        this.beginDrawingWithEdge(anchorPoint);
      } else {
        this.beginDrawingWithPoint(x, y);
      }
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
  this.walle.offAbort(this.abortHandler);

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
  this.walle.offAbort(this.abortHandler);
  this.paper.removeAllListeners("click.wallsdrawer.**");
  this.walle.snapTo.remove();
};

/**
 * begin drawing
 * @param x
 * @param y
 */
WallsDrawer.prototype.beginDrawingWithPoint = function (x, y) {
  let edge = new Edge(this.paper, x, y);

  this.beginDrawingWithEdge(edge);
};

/**
 * begin drawing
 * @param edge
 */
WallsDrawer.prototype.beginDrawingWithEdge = function (edge) {
  console.log("begin drawing wall", edge.toString());

  //draw wall and edge
  let edge0 = edge;
  let edge1 = new Edge(this.paper, edge.x, edge.y);
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

  this.abortHandler = (event) => {
    this.abortDrawing();
  };
  this.walle.onAbort(this.abortHandler);


  //use snap mode
  this.walle.snapTo.remove();

  this.walle.snapTo.add({
    click: (event, x, y, anchorPoint) => {
      edge1.selected(false);
      if (Edge.isEdge(anchorPoint) && anchorPoint.x === x && anchorPoint.y === y) {
        this.endDrawingWithEdge(anchorPoint, event.shiftKey);
      } else {
        this.endDrawingWithPoint(x, y, event.shiftKey);
      }
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
  this.drawingWall.edges[0].remove(); //TODO verificare se effettivamente va eliminato
  this.drawingWall.edges[1].remove();
  this.drawingWall.remove();

  this.drawingWall = null;

  this.restart();
};

/**
 * update drawing
 * @param edge
 */
WallsDrawer.prototype.updateDrawingWithEdge = function (edge) {
  this.updateDrawingWithPoint(edge.x, edge.y);
};

/**
 * update drawing
 * @param x
 * @param y
 */
WallsDrawer.prototype.updateDrawingWithPoint = function (x, y) {
  //console.log("update drawing wall", x, y);

  //move wall endpoint
  this.drawingWall.edges[1].move(x, y);
};

/**
 * end drawing
 * @param edge
 * @param startNew
 */
WallsDrawer.prototype.endDrawingWithEdge = function (edge, startNew) {
  console.log("end drawing wall", edge.toString());

  let wall = this.drawingWall;
  let scene = this.walle.scene;

  wall.edges[1].remove();
  wall.updateEdge(1, edge);

  wall.edges[0].selected(false);
  wall.edges[1].selected(false);
  wall.selected(false);
  wall.edges[1].redraw();

  scene.addElement(wall);

  if (! scene.hasElement(wall.edges[0])) scene.addElement(wall.edges[0]);


  //restart
  this.restart();
  if (startNew) this.beginDrawingWithEdge(edge);
};

/**
 * end drawing
 * @param x
 * @param y
 * @param startNew
 */
WallsDrawer.prototype.endDrawingWithPoint = function (x, y, startNew) {
  console.log("end drawing wall", x, y);

  let scene = this.walle.scene;
  let wall = this.drawingWall;
  if (wall.edges[0].x === x && wall.edges[0].y === y)return;

  wall.edges[1].move(x, y);

  wall.edges[0].selected(false);
  wall.edges[1].selected(false);
  wall.selected(false);

  scene.addElement(wall);

  if (! scene.hasElement(wall.edges[0])) scene.addElement(wall.edges[0]);
  scene.addElement(wall.edges[1]);

  //restart
  this.restart();
  if (startNew) this.beginDrawingWithPoint(x, y);

};
