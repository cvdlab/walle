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


  //register snapPoints
  let snapPoints = [];

  this.walls.forEach((wall) => {

    let addSnapPoint = function (x, y, circle) {

      let point = this.paper.circle(x, y, 30);
      point.attr({strokeWidth: 1, stroke: "#000", fill: "#fff", opacity: 0});

      point.click(
        event => {
          this.endDrawing({offsetX: x, offsetY: y});
          snapPoints.forEach(p => {
            p.remove()
          });
          event.stopPropagation();
        });

      point.hover(
        event => {
          circle.attr({fill: "#00e5ff"});
        },
        event => {
          circle.attr({fill: "#fff"});
        });

      point.mousemove(
        event => {
          console.log("mv", x, y);
          this.updateDrawing({offsetX: x, offsetY: y});
          event.stopPropagation();
        });

      snapPoints.push(point);

    }.bind(this);

    addSnapPoint(wall.data.x1, wall.data.y1, wall.startCircle);
    addSnapPoint(wall.data.x2, wall.data.y2, wall.endCircle);

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

  this._resetDrawer();
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

  this._resetDrawer();

  if(this.walle.superPower) this.beginDrawing(point);

};


/**
 * resetDrawer
 * @param point
 */
WallsDrawer.prototype._resetDrawer = function () {
  this.drawingWall = null;
  this.walle.changeCursor("auto");

  //register events
  this.paper.unmousemove(this.updateDrawing);
  this.paper.unclick(this.endDrawing);
  this.walle.unregisterAbort(this.abortDrawing);
  this.paper.click(this.beginDrawing, this);
};

