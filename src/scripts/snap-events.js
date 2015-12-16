"use strict";

var SnapEvents = function (walle) {
  this.walle = walle;
  this.paper = walle.paper;

  this.snapPoints = [];

  walle.model.walls = walle.model.walls || [];
  walle.model.edges = walle.model.edges || [];

  this.walls = walle.model.walls;
  this.edges = walle.model.edges;
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

    handlers.mouseover = event => {
      edge.hovered(true);
    };
    handlers.mouseout = event => {
      edge.hovered(false);
    };

    this.addSnapPoint(edge.x, edge.y, edge, handlers);

  });
};

/**
 * Remove all snap points
 */
SnapEvents.prototype.remove = function () {
  console.log("remove snap events");

  this.snapPoints.forEach(p => {
    p.remove()
  });
  this.snapPoints = [];
};

/**
 * Add a snap line based on a rect
 * @param x1
 * @param y1
 * @param x2
 * @param y2
 * @param anchorObject
 * @param clickFn = function(event, x, y, anchorObject)
 * @param mouseMoveFn = function(event, x, y, anchorObject)
 * @returns line
 */
SnapEvents.prototype.addSnapLine = function (x1, y1, x2, y2, anchorObject, handlers) {

  let paper = this.paper;

  let anchor = paper.line(x1, y1, x2, y2).attr({strokeWidth: 1, stroke: "#1c79bc", opacity: 0});

  let line = paper.line(x1, y1, x2, y2)
    .attr({strokeWidth: 15, stroke: "#000", opacity: this.walle.debugMode ? 0.3 : 0})
    .mouseover(event => {
      anchor.attr({opacity: 1});
    })
    .mouseout(event => {
      anchor.attr({opacity: 0});
    })
    .click(event => {
      anchor.attr({opacity: 0});
    });

  for (let handlerName in handlers) {
    let handler = handlers[handlerName];

    line[handlerName](event => {
      let coords = Utils.intersectPoint(x1, y1, x2, y2, event.offsetX, event.offsetY);
      handler(event, coords.x, coords.y, anchorObject);
    });
  }

  this.snapPoints.push(line);
};

/**
 * Add a snap point based on a circle
 * @param x
 * @param y
 * @param anchorObject
 * @param clickFn = function(event, x, y, anchorObject)
 * @param mouseMoveFn = function(event, x, y, anchorObject)
 * @returns {*}
 */
SnapEvents.prototype.addSnapPoint = function (x, y, anchorObject, handlers) {

  let paper = this.paper;

  let circle = paper.circle(x, y, 20)
    .attr({strokeWidth: 1, stroke: "#000", fill: "#fff", opacity: this.walle.debugMode ? 0.5 : 0});

  for (let handlerName in handlers) {
    let handler = handlers[handlerName];

    circle[handlerName](event => {
      handler(event, x, y, anchorObject);
    });
  }

  this.snapPoints.push(circle);
};
