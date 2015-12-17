"use strict";

var EdgesMover = function (walle) {
  this.walle = walle;
  this.paper = walle.paper;

  walle.model.edges = walle.model.edges || [];

  this.movingEdge = null;

};


/**
 * start
 */
EdgesMover.prototype.start = function () {
  console.log("start edges mover mode");

  let edges = this.walle.model.edges;
  let self = this;

  edges.forEach(function (edge) {

    let start = (x, y, event) => {
      self.beginMoving(edge);
    };

    let move = (dx, dy, x, y, event) => {
      self.updateMovingWithPoint(event.offsetX, event.offsetY);
    };

    let end = (event) => {
      self.endMovingWithPoint(event.offsetX, event.offsetY);
    };

    edge.drag(start, move, end);

  });

};

/**
 * begin mobing
 * @param edge
 */
EdgesMover.prototype.beginMoving = function (edge) {

  this.movingEdge = edge;

};

/**
 * update moving
 * @param x
 * @param y
 */
EdgesMover.prototype.updateMovingWithPoint = function (x, y) {

  //console.log("updateMoving", x, y);

  this.movingEdge.move(x, y);

};

/**
 * end moving
 * @param x
 * @param y
 */
EdgesMover.prototype.endMovingWithPoint = function (x, y) {

  console.log("endMoving", x, y);

  this.movingEdge.move(x, y);
  this.movingEdge = null;

};

/**
 * stop
 */
EdgesMover.prototype.stop = function () {
  console.log("stop edges mover mode");

  edges.forEach(function (edge) {
    edge.undrag();
  });

};
