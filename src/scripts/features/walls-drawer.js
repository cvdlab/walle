"use strict";

var WallsDrawer = function (walle) {
  this.walle = walle;
  this.paper = walle.paper;

  this.drawingWall = null;

  this.feedbackElementsList = ['wall', 'vertex'];

};

/** costants */
WallsDrawer.statusWaiting = 0;
WallsDrawer.statusWorking = 1;
WallsDrawer.statusDirty = 2;

/**
 * start
 */
WallsDrawer.prototype.start = function () {
  console.log('start');

  let snapLayer = this.walle.scene.snapLayer;

  this.clickHandler = (event, element) => {

    if (this.status === WallsDrawer.statusWaiting) {

      if (Wall.isWall(element))
        this.beginDrawingWithWall(element, event.offsetX, event.offsetY);
      else if (Vertex.isVertex(element))
        this.beginDrawingWithVertex(element);
      else
        this.beginDrawingWithPoint(event.offsetX, event.offsetY);

      event.stopImmediatePropagation();
      return;
    }

    if (this.status === WallsDrawer.statusWorking) {

      if (Wall.isWall(element))
        this.endDrawingWithWall(element, event.offsetX, event.offsetY, event.shiftKey);
      else if (Vertex.isVertex(element))
        this.endDrawingWithVertex(element, event.shiftKey);
      else
        this.endDrawingWithPoint(event.offsetX, event.offsetY, event.shiftKey);

      event.stopImmediatePropagation();
    }

  };

  this.snapClickHandler = (event, x, y, targetElement, snapElement) => {

    if (this.status === WallsDrawer.statusWaiting) {
      snapLayer.resetHover();

      if (Vertex.isVertex(targetElement) && SnapPoint.isSnapPoint(snapElement)) {
        this.beginDrawingWithVertex(targetElement);
        event.stopImmediatePropagation();
        return;
      }

      this.beginDrawingWithPoint(x, y);
      event.stopImmediatePropagation();
      return;
    }

    if (this.status === WallsDrawer.statusWorking) {
      snapLayer.resetHover();

      if (Vertex.isVertex(targetElement) && SnapPoint.isSnapPoint(snapElement)) {
        this.endDrawingWithVertex(targetElement, event.shiftKey);
        event.stopImmediatePropagation();
        return;
      }

      this.endDrawingWithPoint(x, y);
      event.stopImmediatePropagation();

    }
  };

  this.snapMouseMoveHandler = (event, x, y, targetElement) => {
    if (this.status === WallsDrawer.statusWorking) {
      this.updateDrawingWithPoint(x, y);
      event.stopImmediatePropagation();
    }
  };

  this.mouseMoveHandler = event => {

    if (this.status === WallsDrawer.statusWorking) {
      this.updateDrawingWithPoint(event.offsetX, event.offsetY);
      event.stopPropagation();
    }

  };

  this.abortHandler = event => {
    if (this.status === WallsDrawer.statusWorking) {
      this.abortDrawing();
      event.stopPropagation();
    }
  };

  this.walle.addElementsFeedback(this.feedbackElementsList);

  this.paper.mousemove(this.mouseMoveHandler);
  this.walle.onAbort(this.abortHandler);
  this.walle.scene.onClick(this.clickHandler);
  this.walle.scene.snapLayer.onClick(this.snapClickHandler);
  this.walle.scene.snapLayer.onMouseMove(this.snapMouseMoveHandler);

  this.restart();
};


/**
 * restart
 */
WallsDrawer.prototype.restart = function () {
  console.log('restart');

  this.walle.changeCursor("auto");

  this.drawingWall = null;

  //start
  this.status = WallsDrawer.statusWaiting;
};


/**
 * stop
 */
WallsDrawer.prototype.stop = function () {
  console.log('stop');

  //abort if needed
  if (this.drawingWall !== null) this.abortDrawing();

  this.status = WallsDrawer.statusDirty;
  this.walle.scene.offClick(this.clickHandler);
  this.paper.unmousemove(this.mouseMoveHandler);
  this.walle.offAbort(this.abortHandler);
  this.walle.scene.snapLayer.offClick(this.snapClickHandler);
  this.walle.scene.snapLayer.offMouseMove(this.snapMouseMoveHandler);
};

/**
 * begin drawing
 * @param x
 * @param y
 */
WallsDrawer.prototype.beginDrawingWithPoint = function (x, y) {
  console.log('beginDrawingWithPoint');
  let vertex = new Vertex(this.paper, x, y);
  this.beginDrawingWithVertex(vertex);
};

/**
 * begin drawing
 * @param wall
 * @param x
 * @param y
 */
WallsDrawer.prototype.beginDrawingWithWall = function (wall, x, y) {
  console.log('beginDrawingWithWall', wall, x, y);

  let scene = this.walle.scene;

  let splittedWall = wall.split(x, y);
  scene.removeElement(wall);
  scene.addElements([splittedWall.vertex, splittedWall.wall0, splittedWall.wall1]);

  this.beginDrawingWithVertex(splittedWall.vertex);
};

/**
 * begin drawing
 * @param vertex
 */
WallsDrawer.prototype.beginDrawingWithVertex = function (vertex) {
  console.log('beginDrawingWithVertex', vertex);

  let scene = this.walle.scene;
  scene.addElement(vertex);

  //draw wall and vertex
  let vertex0 = vertex;
  let vertex1 = new Vertex(this.paper, vertex.x, vertex.y);
  let wall = new Wall(this.paper, vertex0, vertex1);
  vertex0.redraw();
  vertex1.redraw();

  vertex0.selected(true);
  vertex1.selected(true);
  wall.selected(true);

  this.drawingWall = wall;

  //change mouse mode
  this.walle.changeCursor("crosshair");

  this.status = WallsDrawer.statusWorking;

};

/**
 * abortDrawing
 */
WallsDrawer.prototype.abortDrawing = function () {
  console.log('abortDrawing');

  let scene = this.walle.scene;
  let vertex0 = this.drawingWall.vertices[0], vertex1 = this.drawingWall.vertices[1];
  let wall = this.drawingWall;

  //remove vertex 0 if needed
  vertex0.removeAttachedElement(wall);
  if (vertex0.attachedElements.size === 0) {
    scene.removeElement(vertex0);
    vertex0.remove();
  } else {
    vertex0.selected(false);
  }


  vertex1.remove();
  this.drawingWall.remove();

  this.drawingWall = null;

  this.status = WallsDrawer.statusDirty;

  this.restart();
};

/**
 * update drawing
 * @param vertex
 */
WallsDrawer.prototype.updateDrawingWithVertex = function (vertex) {
  this.updateDrawingWithPoint(vertex.x, vertex.y);
};

/**
 * update drawing
 * @param x
 * @param y
 */
WallsDrawer.prototype.updateDrawingWithPoint = function (x, y) {
  //move wall endpoint
  this.drawingWall.vertices[1].move(x, y);
};

/**
 * end drawing
 * @param vertex
 * @param startNew
 */
WallsDrawer.prototype.endDrawingWithVertex = function (vertex, startNew) {
  console.log('endDrawingWithVertex', vertex, startNew);

  let wall = this.drawingWall;
  let scene = this.walle.scene;
  if (wall.vertices[0].x === vertex.x && wall.vertices[0].y === vertex.y)return;

  wall.vertices[1].remove();
  wall.updateVertex(1, vertex);

  wall.vertices[0].selected(false);
  wall.vertices[1].selected(false);
  wall.selected(false);
  wall.vertices[1].redraw();
  wall.redraw();

  scene.addElements([wall, wall.vertices[0]]);

  this.status = WallsDrawer.statusDirty;

  //restart
  this.restart();
  if (startNew) this.beginDrawingWithVertex(vertex);
};

/**
 * end drawing
 * @param x
 * @param y
 * @param startNew
 */
WallsDrawer.prototype.endDrawingWithPoint = function (x, y, startNew) {
  console.log('endDrawingWithPoint', x, y, startNew);

  let scene = this.walle.scene;
  let wall = this.drawingWall;
  if (wall.vertices[0].x === x && wall.vertices[0].y === y)return;
  if (scene.nearestElement(x, y, 1, 'vertex') !== null) return;

  wall.vertices[1].move(x, y);

  wall.vertices[0].selected(false);
  wall.vertices[1].selected(false);
  wall.selected(false);

  scene.addElements([wall, wall.vertices[0], wall.vertices[1]]);

  this.status = WallsDrawer.statusDirty;

  //restart
  this.restart();
  this.beginDrawingWithVertex(wall.vertices[1]);

};

/**
 * end drawing
 * @param wall
 * @param x
 * @param y
 * @param startNew
 */
WallsDrawer.prototype.endDrawingWithWall = function (wall, x, y, startNew) {
  console.log('endDrawingWithWall', wall, startNew);

  let scene = this.walle.scene;

  let splittedWall = wall.split(x, y);
  scene.removeElement(wall);
  scene.addElements([splittedWall.vertex, splittedWall.wall0, splittedWall.wall1]);

  this.endDrawingWithVertex(splittedWall.vertex, startNew);
};
