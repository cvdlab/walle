"use strict";

var SnapTo = function (walle) {
  this.walle = walle;
  this.paper = walle.paper;

  this.walls = walle.model.walls = walle.model.walls || [];
  this.edges = walle.model.edges = walle.model.edges || [];

  this.snapElements = [];

  let handler = function (event) {

    let minDistance = 15;
    let xp = event.offsetX, yp = event.offsetY;
    let eventType = event.type;

    let found = false;

    this.snapElements.forEach(element => {

      if (found) return;

      element.over = element.over || false;

      let handlers = element.handlers;
      let anchorObject = element.anchorObject;
      let distance = element.distanceFn(xp, yp);

      if (distance > minDistance) return;

      found = true;

      let coords = element.snapPointFn(xp, yp);

      if (eventType === 'click' || eventType === 'mousemove' && handlers.hasOwnProperty(eventType)) {
        handlers[eventType](event, coords.x, coords.y, anchorObject);
        event.stopImmediatePropagation();
      }

    });

  }.bind(this);


  this.paper
    .click(handler)
    .mousemove(handler);
};

/**
 * Add all snap points
 * @param clickFn = function(event, x, y, anchorObject)
 * @param mouseMoveFn = function(event, x, y, anchorObject)
 */

SnapTo.prototype.add = function (handlers) {

  console.log("use snap events");

  let width = this.walle.width;
  let height = this.walle.height;
  let snapElements = this.snapElements;
  let paper = this.paper;

  //add wall snap point
  this.edges.forEach((edge) => {

    this.addSnapPoint(edge.x, edge.y, edge, handlers);

  });

  //add horizontal and vertical snap line
  this.edges.forEach((edge) => {
    let hCoords = Utils.horizontalLineIntoBox(edge.x, edge.y, width, height);
    let vCoords = Utils.verticalLineIntoBox(edge.x, edge.y, width, height);

    this.addSnapLine(hCoords.r1.x, hCoords.r1.y, hCoords.r2.x, hCoords.r2.y, edge, handlers);
    this.addSnapLine(vCoords.r1.x, vCoords.r1.y, vCoords.r2.x, vCoords.r2.y, edge, handlers);
  });

  //add continue snap point
  this.walls.forEach((wall) => {
    let coords = Utils.lineIntoBox(wall.edges[0].x, wall.edges[0].y, wall.edges[1].x, wall.edges[1].y, width, height);

    this.addSnapLine(coords.r1.x, coords.r1.y, coords.r2.x, coords.r2.y, wall, handlers);
  });
};

/**
 * Remove all snap points
 */
SnapTo.prototype.remove = function () {
  console.log("remove snap events");

  this.snapElements.forEach(item => {
    item.debugArea.remove()
  });

  this.snapElements = [];

};

/**
 * Add a snap line based on a rect
 * @param x1
 * @param y1
 * @param x2
 * @param y2
 * @param anchorObject
 * @param handlers[] = function(event, x, y, anchorObject)
 * @returns line
 */
SnapTo.prototype.addSnapLine = function (x1, y1, x2, y2, anchorObject, handlers) {
  let debugArea = this.paper.line(x1, y1, x2, y2).attr({
    strokeWidth: 1,
    stroke: "red",
    opacity: this.walle.debugMode ? 0.5 : 0
  });

  let snapPointFn = function (xp, yp) {
    return Utils.intersectPoint(x1, y1, x2, y2, event.offsetX, event.offsetY);
  };

  let distanceFn = function (xp, yp) {
    return Utils.linePointDistance(x1, y1, x2, y2, xp, yp);
  };

  this.snapElements.push({x1, y1, x2, y2, anchorObject, handlers, debugArea, snapPointFn, distanceFn});
};

/**
 * Add a snap point based on a circle
 * @param x
 * @param y
 * @param anchorObject
 * @param handlers[] = function(event, x, y, anchorObject)
 * @returns {*}
 */
SnapTo.prototype.addSnapPoint = function (x, y, anchorObject, handlers) {
  let debugArea = this.paper.circle(x, y, 15).attr({
    strokeWidth: 3,
    stroke: "red",
    fill: "#fff",
    opacity: this.walle.debugMode ? 0.5 : 0
  });

  let snapPointFn = function (xp, yp) {
    return {x, y};
  };

  let distanceFn = function (xp, yp) {
    return Utils.twoPointsDistance(x, y, xp, yp);
  };

  this.snapElements.push({x, y, anchorObject, handlers, debugArea, snapPointFn, distanceFn});
};
