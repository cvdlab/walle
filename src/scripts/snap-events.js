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

SnapEvents.prototype.add = function (clickFn, mouseMoveFn) {

  console.log("use snap events");

  mouseMoveFn = mouseMoveFn || Function.prototype;

  let width = this.walle.width;
  let height = this.walle.height;
  let snapPoints = this.snapPoints;
  let paper = this.paper;

  //add horizontal and vertical snap line
  this.edges.forEach((edge) => {
    let hCoords = Utils.horizontalLineIntoBox(edge.x, edge.y, width, height);
    let vCoords = Utils.verticalLineIntoBox(edge.x, edge.y, width, height);

    this.addSnapLine(hCoords.r1.x, hCoords.r1.y, hCoords.r2.x, hCoords.r2.y, edge, clickFn, mouseMoveFn);
    this.addSnapLine(vCoords.r1.x, vCoords.r1.y, vCoords.r2.x, vCoords.r2.y, edge, clickFn, mouseMoveFn);
  });

  //add continue snap point
  this.walls.forEach((wall) => {
    let coords = Utils.lineIntoBox(wall.edges[0].x, wall.edges[0].y, wall.edges[1].x, wall.edges[1].y, width, height);

    this.addSnapLine(coords.r1.x, coords.r1.y, coords.r2.x, coords.r2.y, wall, clickFn, mouseMoveFn);
  });

  //add wall snap point
  this.edges.forEach((edge) => {

    this.addSnapPoint(edge.x, edge.y, edge, clickFn, mouseMoveFn)
      .mouseover(event => {
        edge.hovered(true);
      })
      .mouseout(event => {
        edge.hovered(false);
      });

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
SnapEvents.prototype.addSnapLine = function (x1, y1, x2, y2, anchorObject, clickFn, mouseMoveFn) {

  let paper = this.paper;
  mouseMoveFn = mouseMoveFn || Function.prototype;

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
      let coords = Utils.intersectPoint(x1, y1, x2, y2, event.offsetX, event.offsetY);
      clickFn(event, coords.x, coords.y, anchorObject);
    })
    .mousemove(event => {
      let coords = Utils.intersectPoint(x1, y1, x2, y2, event.offsetX, event.offsetY);
      mouseMoveFn(event, coords.x, coords.y, anchorObject);
    });

  this.snapPoints.push(line);
  return line;
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
SnapEvents.prototype.addSnapPoint = function (x, y, anchorObject, clickFn, mouseMoveFn) {

  let paper = this.paper;
  mouseMoveFn = mouseMoveFn || Function.prototype;

  let circle = paper.circle(x, y, 20)
    .attr({strokeWidth: 1, stroke: "#000", fill: "#fff", opacity: this.walle.debugMode ? 0.5 : 0})
    .click(event => {
      clickFn(event, x, y, anchorObject);
    })
    .mousemove(event => {
      mouseMoveFn(event, x, y, anchorObject);
    });

  this.snapPoints.push(circle);
  return circle;
};
