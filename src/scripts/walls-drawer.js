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
  this.paper.click(this.beginDrawing, this);

  this.useSnapPoints({
    click: (event, x, y) => {
      this.beginDrawing({offsetX: x, offsetY: y});
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

  this.drawingWall = null;
  this.walle.changeCursor("auto");

  //register events
  this.paper.unmousemove(this.updateDrawing);
  this.paper.unclick(this.endDrawing);
  this.walle.unregisterAbort(this.abortDrawing);

  this.start();
};


/**
 * stop
 */
WallsDrawer.prototype.stop = function () {
  console.log("stop walls mode");
  if (this.drawingWall !== null) this.abortDrawing();
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

  this.drawingWall = {line, startCircle, endCircle, data: {x1: x, y1: y}};

  this.walle.changeCursor("crosshair");

  //register events
  this.paper.mousemove(this.updateDrawing, this);
  this.paper.click(this.endDrawing, this);
  this.paper.unclick(this.beginDrawing);
  this.walle.registerAbort(this.abortDrawing, this);

  this.useSnapPoints({
    mouseover: event => {
      endCircle.attr({fill: "#00e5ff"});
    },
    mouseout: event => {
      endCircle.attr({fill: "#fff"});
    },
    mousemove: (event, x, y) => {
      this.updateDrawing({offsetX: x, offsetY: y});
      event.stopPropagation();
    },
    click: (event, x, y) => {
      endCircle.attr({fill: "#fff"});
      this.endDrawing({offsetX: x, offsetY: y});
      this.destroySnapPoints();
      event.stopPropagation();
    }
  });

};

/**
 * abortDrawing
 */
WallsDrawer.prototype.abortDrawing = function () {
  console.log("abort drawing wall");

  this.drawingWall.line.remove();
  this.drawingWall.startCircle.remove();
  this.drawingWall.endCircle.remove();

  this.restart();
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

  wall.startCircle.attr({stroke: "#8E9BA2"});
  wall.endCircle.attr({cx: x, cy: y, stroke: "#8E9BA2"});
  wall.line.attr({x2: x, y2: y, stroke: "#8E9BA2"});
  wall.data.x2 = x;
  wall.data.y2 = y;
  this.walls.push(wall);

  this.restart();

  if (this.walle.superPower) this.beginDrawing(point);

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


