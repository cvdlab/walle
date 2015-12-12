"use strict";

var WallsDrawer = function (walle) {
  this.walle = walle;
  this.paper = walle.paper;

  this.drawingWall = null;
  this.walls = [];
  this.snapPoints = [];
};


/**
 * start
 */
WallsDrawer.prototype.start = function () {
  console.log("start walls mode");

  //add a point everywhere
  this.paper.addListener("click.wallsdrawer.begin", event => {
    this.beginDrawing(event.offsetX, event.offsetY);
  });

  //add a point using snap points
  this.useSnapPoints({
    click: (event, x, y) => {
      this.beginDrawing(x, y);
      event.stopPropagation();
    },
    mouseover: (event, x, y, endpoint) => {
      endpoint.attr({fill: "#00e5ff"});
    },
    mouseout: (event, x, y, endpoint) => {
      endpoint.attr({fill: "#fff"});
    }
  });
};


/**
 * restart
 * @param point
 */
WallsDrawer.prototype.restart = function () {
  console.log("restart walls mode");

  //clear drawing area
  this.destroySnapPoints();
  this.walle.changeCursor("auto");

  //unregister events
  this.paper.removeAllListeners("mousemove.wallsdrawer.update");
  this.paper.removeAllListeners("click.wallsdrawer.end");
  this.walle.emitter.removeAllListeners("abort.wallsdrawer");

  console.info("walls report", this.walls);

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
};


/**
 * beginDrawing
 * @param point
 */
WallsDrawer.prototype.beginDrawing = function (x, y) {
  console.log("begin drawing wall", x, y);

  //draw wall and endpoints
  let line = this.paper.line(x, y, x, y);
  line.attr({strokeWidth: 4, stroke: "#445964"});

  let startCircle = this.paper.circle(x, y, 8);
  startCircle.attr({strokeWidth: 4, stroke: "#445964", fill: "#fff"});

  let endCircle = this.paper.circle(x, y, 8);
  endCircle.attr({strokeWidth: 4, stroke: "#445964", fill: "#fff"});

  //init structure
  this.drawingWall = {line, startCircle, endCircle, data: {x1: x, y1: y}};

  //change mouse mode
  this.walle.changeCursor("crosshair");

  //(un)register events
  this.paper.addListener("mousemove.wallsdrawer.update", event => {
    this.updateDrawing(event.offsetX, event.offsetY);
  });
  this.paper.addListener("click.wallsdrawer.end", event => {
    this.endDrawing(event.offsetX, event.offsetY);
  });
  this.paper.removeAllListeners("click.wallsdrawer.begin");
  this.walle.emitter.addListener("abort.wallsdrawer", event => {
    this.abortDrawing();
  });

  //use snap mode
  this.useSnapPoints({
    mouseover: event => {
      endCircle.attr({fill: "#00e5ff"});
    },
    mouseout: event => {
      endCircle.attr({fill: "#fff"});
    },
    mousemove: (event, x, y) => {
      this.updateDrawing(x, y);
      event.stopPropagation();
    },
    click: (event, x, y) => {
      endCircle.attr({fill: "#fff"});
      this.endDrawing(x, y);
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
  this.drawingWall.line.remove();
  this.drawingWall.startCircle.remove();
  this.drawingWall.endCircle.remove();
  this.drawingWall = null;

  this.restart();
};

/**
 * updateDrawing
 * @param x
 * @param y
 */
WallsDrawer.prototype.updateDrawing = function (x, y) {
  console.log("update drawing wall", x, y);

  //move wall endpoint
  let line = this.drawingWall.line, endCircle = this.drawingWall.endCircle;
  line.attr({x2: x, y2: y});
  endCircle.attr({cx: x, cy: y});
};

/**
 * endDrawing
 * @param x
 * @param y
 */
WallsDrawer.prototype.endDrawing = function (x, y) {
  console.log("end drawing wall", x, y);

  //set new wall
  let wall = this.drawingWall;
  wall.startCircle.attr({stroke: "#8E9BA2"});
  wall.endCircle.attr({cx: x, cy: y, stroke: "#8E9BA2"});
  wall.line.attr({x2: x, y2: y, stroke: "#8E9BA2"});

  //update wall structure
  wall.data.x2 = x;
  wall.data.y2 = y;
  this.walls.push(wall);

  //restart
  this.restart();
  if (this.walle.superPower) this.beginDrawing(x, y);

};

/** useSnapPoints */
WallsDrawer.prototype.useSnapPoints = function (handlers) {

  let addSnapPoint = (x, y, endpoint, sensitiveness) => {

    let snapPoint = this.paper.circle(x, y, sensitiveness);
    snapPoint.attr({strokeWidth: 1, stroke: "#000", fill: "#fff", opacity: this.walle.debugMode ? 0.5 : 0});

    for (let handlerName in handlers) {
      let handler = handlers[handlerName];

      snapPoint[handlerName](event => {
        handler(event, x, y, endpoint);
      });
    }

    this.snapPoints.push(snapPoint);
  };

  //add wall snap point
  this.walls.forEach((wall) => {
    addSnapPoint(wall.data.x1, wall.data.y1, wall.startCircle, 20);
    addSnapPoint(wall.data.x2, wall.data.y2, wall.endCircle, 20);
  });


};

/** destroySnapPoints */
WallsDrawer.prototype.destroySnapPoints = function () {
  this.snapPoints.forEach(p => {
    p.remove()
  });
  this.snapPoints = [];
};


