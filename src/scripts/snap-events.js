"use strict";

var SnapEvents = function (walle) {
  this.walle = walle;
  this.paper = walle.paper;

  this.snapPoints = [];
  this.snapLines = [];

  walle.model.walls = walle.model.walls || [];
  walle.model.edges = walle.model.edges || [];

  this.walls = walle.model.walls;
  this.edges = walle.model.edges;

  this.paper
    .click(this._handlerServeSnapPoints.bind(this))
    .mousemove(this._handlerServeSnapPoints.bind(this))
    .click(this._handlerServeSnapLines.bind(this))
    .mousemove(this._handlerServeSnapLines.bind(this));
};

/**
 * Add all snap points
 * @param clickFn = function(event, x, y, anchorObject)
 * @param mouseMoveFn = function(event, x, y, anchorObject)
 */

SnapEvents.prototype.add = function (handlers) {

  console.log("use snap events");

  let width = this.walle.width;
  let height = this.walle.height;
  let snapPoints = this.snapPoints;
  let paper = this.paper;

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


  //add wall snap point
  this.edges.forEach((edge) => {

    this.addSnapPoint(edge.x, edge.y, edge, handlers);

  });
};

/**
 * Remove all snap points
 */
SnapEvents.prototype.remove = function () {
  console.log("remove snap events");

  this.snapPoints = [];
  this.snapLines = [];
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
SnapEvents.prototype.addSnapLine = function (x1, y1, x2, y2, anchorObject, handlers) {
  this.snapLines.push({x1, y1, x2, y2, anchorObject, handlers});
};

SnapEvents.prototype._handlerServeSnapLines = function (event) {


  let minDistance = 15;

  let xp = event.offsetX, yp = event.offsetY;

  this.snapLines.forEach(snapLine => {

    snapLine.over = snapLine.over || false;

    let x1 = snapLine.x1, y1 = snapLine.y1;
    let x2 = snapLine.x2, y2 = snapLine.y2;
    let handlers = snapLine.handlers;
    let anchorObject = snapLine.anchorObject;

    let distance = Utils.linePointDistance(x1, y1, x2, y2, xp, yp);

    if (distance <= minDistance) {

      let coords = Utils.intersectPoint(x1, y1, x2, y2, event.offsetX, event.offsetY);
      let x = coords.x, y = coords.y;
      let eventType = event.type;

      if (distance > minDistance) return;

      if (eventType === 'click' || eventType === 'mousemove' && handlers.hasOwnProperty(eventType)) {
        console.log(handlers[eventType].toString());
        handlers[eventType](event, x, y, anchorObject);
        event.stopImmediatePropagation();
      }
    }

  });

};


/**
 * Add a snap point based on a circle
 * @param x
 * @param y
 * @param anchorObject
 * @param handlers[] = function(event, x, y, anchorObject)
 * @returns {*}
 */
SnapEvents.prototype.addSnapPoint = function (x, y, anchorObject, handlers) {
  this.snapPoints.push({x, y, anchorObject, handlers});
};

SnapEvents.prototype._handlerServeSnapPoints = function (event) {


  let minDistance = 15;

  let xp = event.offsetX, yp = event.offsetY;

  this.snapPoints.forEach(snapPoint => {

    let x = snapPoint.x, y = snapPoint.y;
    let handlers = snapPoint.handlers;
    let anchorObject = snapPoint.anchorObject;
    snapPoint.over = snapPoint.over || false;

    let distance = Utils.twoPointsDistance(x, y, xp, yp);
    let eventType = event.type;

    if (distance > minDistance) return;

    if (eventType === 'click' || eventType === 'mousemove' && handlers.hasOwnProperty(eventType)) {
      console.log(handlers[eventType].toString());
      handlers[eventType](event, x, y, anchorObject);
      event.stopImmediatePropagation();
    }

  });

};
