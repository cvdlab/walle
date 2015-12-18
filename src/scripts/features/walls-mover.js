"use strict";

var WallsMover = function (walle) {
  this.walle = walle;
  this.paper = walle.paper;

  walle.model.walls = walle.model.walls || [];

  this.movingWall = null;
};


/**
 * start
 */
WallsMover.prototype.start = function () {
  console.log("start edges mover mode");

  let walls = this.walle.model.walls;
  let self = this;

  walls.forEach(wall => {

    wall.handleMoverStart = (x, y, event) => {
      self.beginMoving(wall);
    };

    wall.handleMoverMove = (dx, dy, x, y, event) => {
      this.updateMovingWithPoint(event.offsetX, event.offsetY);
    };

    wall.handleMoverEnd = (event) => {
      this.endMovingWithPoint(event.offsetX, event.offsetY);
    };

    wall.drag(wall.handleMoverStart, wall.handleMoverMove, wall.handleMoverEnd, this, this, this);

  });

};


/**
 * begin moving
 * @param wall
 */
WallsMover.prototype.beginMoving = function (wall) {

  console.log("begin moving");

  let paper = this.paper;
  let width = this.walle.width, height = this.walle.height;

  let center = Utils.centerPoint(wall.edges[0].x, wall.edges[0].y, wall.edges[1].x, wall.edges[1].y);

  let centerPoint = paper.circle(center.x, center.y, 5).attr({fill: "green"});
  let horizontalLine = paper.line(0, center.y, width, center.y).attr({strokeWidth: 1, stroke: "green"});
  let verticalLine = paper.line(center.x, 0, center.x, height).attr({strokeWidth: 1, stroke: "green"});

  this.movingWall = {
    wall,
    centerPoint,
    horizontalLine,
    verticalLine,
    originalPosition: {x1: wall.edges[0].x, y1: wall.edges[0].y, x2: wall.edges[1].x, y2: wall.edges[1].y}
  };


};


/**
 * update moving
 * @param x
 * @param y
 */
WallsMover.prototype.updateMovingWithPoint = function (x, y) {

  let paper = this.paper;
  let width = this.walle.width, height = this.walle.height;

  let movingWall = this.movingWall;
  let ox1 = movingWall.originalPosition.x1, oy1 = movingWall.originalPosition.y1,
    ox2 = movingWall.originalPosition.x2, oy2 = movingWall.originalPosition.y2;
  let edge0 = movingWall.wall.edges[0], edge1 = movingWall.wall.edges[1];

  let center = Utils.centerPoint(edge0.x, edge0.y, edge1.x, edge1.y);

  movingWall.centerPoint.attr({cx: center.x, cy: center.y});
  movingWall.horizontalLine.attr({x1: 0, y1: center.y, x2: width, y2: center.y});
  movingWall.verticalLine.attr({x1: center.x, y1: 0, x2: center.x, y2: height});

  let translationVector = Utils.translationVector(ox1, oy1, ox2, oy2, x, y);
  let vx = translationVector.vx, vy = translationVector.vy;

  edge0.move(ox1 + vx, oy1 + vy);
  edge1.move(ox2 + vx, oy2 + vy);

};

/**
 * end moving
 * @param x
 * @param y
 */
WallsMover.prototype.endMovingWithPoint = function (x, y) {

  this.updateMovingWithPoint(x, y);

  let movingWall = this.movingWall;
  movingWall.centerPoint.remove();
  movingWall.horizontalLine.remove();
  movingWall.verticalLine.remove();

  this.movingWall = null;

};

/**
 * stop
 */
WallsMover.prototype.stop = function () {
  console.log("stop edges mover mode");

};

